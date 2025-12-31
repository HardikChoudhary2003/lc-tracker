import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Contest from '../models/Contest.js';

dotenv.config();

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const BATCH_SIZE = 15;

// GraphQL queries
const CONTEST_LIST_QUERY = `
  query {
    allContests {
      title
      titleSlug
      startTime
      duration
      originStartTime
    }
  }
`;

const CONTEST_DETAIL_QUERY = `
  query getContestDetail($titleSlug: String!) {
    contest(titleSlug: $titleSlug) {
      questions {
        title
        titleSlug
        questionId
        credit
      }
    }
  }
`;

// Fetches and stores contests in paginated batches
async function fetchAndStoreContests() {
  console.log('🚀 Starting full contest fetching...');

  try {
    const contestListRes = await axios.post(
      LEETCODE_API_ENDPOINT,
      { query: CONTEST_LIST_QUERY },
      {
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com/',
          Cookie: `csrftoken=${process.env.CSRF_TOKEN}`,
          'x-csrftoken': process.env.CSRF_TOKEN,
        },
      }
    );

    const contests = contestListRes.data?.data?.allContests || [];

    if (!Array.isArray(contests) || contests.length === 0) {
      console.error('❌ No contests returned from LeetCode.');
      return;
    }

    console.log(`📦 Total contests fetched: ${contests.length}`);
    let processed = 0;

    while (processed < contests.length) {
      const batch = contests.slice(processed, processed + BATCH_SIZE);
      const bulkOps = [];

      for (const contest of batch) {
        if (!contest.titleSlug || !contest.startTime) continue;

        console.log(`🔎 Fetching details for: ${contest.titleSlug}`);
        try {
          // First check if contest already exists to preserve data
          const existingContest = await Contest.findOne({ titleSlug: contest.titleSlug }).lean();
          
          const detailRes = await axios.post(
            LEETCODE_API_ENDPOINT,
            {
              query: CONTEST_DETAIL_QUERY,
              variables: { titleSlug: contest.titleSlug },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Referer: 'https://leetcode.com/',
                Cookie: `csrftoken=${process.env.CSRF_TOKEN}`,
                'x-csrftoken': process.env.CSRF_TOKEN,
              },
            }
          );

          const questions = detailRes.data?.data?.contest?.questions || [];
          
          // Create new problems array with credit information
          let problems = questions
            .map((q) => ({
              titleSlug: q.titleSlug,
              title: q.title,
              questionId: q.questionId,
              credit: q.credit || 0, // Add credit or default to 0
            }))
            .filter((p) => p.titleSlug && p.title);
          
          // If contest exists, try to merge existing problem data to preserve credits
          if (existingContest && existingContest.problems) {
            problems = problems.map(newProblem => {
              const existingProblem = existingContest.problems.find(
                p => p.titleSlug === newProblem.titleSlug
              );
              
              // If problem exists and has credit, use that credit value
              if (existingProblem && existingProblem.credit) {
                return {
                  ...newProblem,
                  credit: existingProblem.credit
                };
              }
              
              return newProblem;
            });
          }
          
          // Check if any problem is missing a credit value
          const hasMissingCredits = problems.some(p => !p.credit || p.credit === 0);
          
          // Add warning in logs
          if (hasMissingCredits) {
            console.warn(`⚠️ Some problems in ${contest.title} are missing credit values. Run update-credits script.`);
          }

          bulkOps.push({
            updateOne: {
              filter: { titleSlug: contest.titleSlug },
              update: {
                $set: {
                  title: contest.title,
                  startTime: new Date(contest.startTime * 1000),
                  duration: contest.duration,
                  originStartTime: contest.originStartTime,
                  problems: problems,
                  // Don't overwrite link if it exists
                  ...(existingContest && existingContest.link ? {} : { link: '' }),
                },
              },
              upsert: true,
            },
          });
        } catch (error) {
          console.error(`❌ Error fetching contest details for ${contest.titleSlug}:`, error.message);
        }

        // Add a small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (bulkOps.length > 0) {
        try {
          await Contest.bulkWrite(bulkOps);
          console.log(`✅ Processed ${bulkOps.length} contests from batch`);
        } catch (error) {
          console.error('❌ Error during bulk write:', error.message);
        }
      }

      processed += BATCH_SIZE;
    }

    console.log('🎉 Contest fetching completed!');
  } catch (error) {
    console.error('❌ Error fetching contest list:', error.message);
  }
}

// Schedule contest fetching
function scheduleContestFetching() {
  // Run every day at 00:00 UTC
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running scheduled contest fetch...');
    await fetchAndStoreContests();
  });
}

export { scheduleContestFetching, fetchAndStoreContests };