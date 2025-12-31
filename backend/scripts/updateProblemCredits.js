import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contest from '../models/Contest.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
const HEADERS = {
  'Content-Type': 'application/json',
  'Referer': 'https://leetcode.com',
  'User-Agent': 'Mozilla/5.0'
};

async function fetchCreditsForContest(contestSlug) {
  const questionQuery = {
    query: `
      query contestQuestionList($contestSlug: String!) {
        contestQuestionList(contestSlug: $contestSlug) {
          title
          titleSlug
          credit
        }
      }
    `,
    variables: { contestSlug }
  };

  const qRes = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(questionQuery)
  });

  const json = await qRes.json();
  return json?.data?.contestQuestionList || [];
}

async function updateCredits() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const contests = await Contest.find({});

    for (const contest of contests) {
      // Check if all problems already have credits
      const allCreditsExist = contest.problems.every(problem => problem.credit !== undefined);
      if (allCreditsExist) {
        console.log(`Credits already exist for all problems in ${contest.titleSlug}`);
        continue;
      }

      const updatedProblems = await fetchCreditsForContest(contest.titleSlug);

      if (updatedProblems.length === 0) {
        console.log(`No problems found for ${contest.titleSlug}`);
        continue;
      }

      // Update problem credits inside the contest
      contest.problems = contest.problems.map(existingProb => {
        const updated = updatedProblems.find(p => p.titleSlug === existingProb.titleSlug);
        return updated ? { ...existingProb.toObject(), credit: updated.credit } : existingProb;
      });

      await contest.save();
      console.log(`✅ Updated credits for ${contest.title}`);
    }

    console.log('All contests updated!');
  } catch (err) {
    console.error('Error updating credits:', err);
  } finally {
    mongoose.disconnect();
  }
}

updateCredits();
