import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Contest from '../models/Contest.js';
import { parseArgs } from 'node:util';

dotenv.config();

// --- Configuration ---
const MONGO_URI = process.env.MONGODB_URI;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID_1 = process.env.YOUTUBE_CHANNEL_ID_1;
const CHANNEL_ID_2 = process.env.YOUTUBE_CHANNEL_ID_2;

const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 3000;
// --- End Configuration ---

// --- Argument Parsing ---
const options = {
  target: {
    type: 'string',
    short: 't',
    default: 'all',
  },
};

let args;
try {
  args = parseArgs({ options, allowPositionals: false, strict: true });
} catch (err) {
  console.error(`❌ Invalid argument: ${err.message}`);
  console.log('Usage: node scripts/updateContestLinks.js [--target <link|link2|all>]');
  process.exit(1);
}

const targetLinkField = args.values.target;
if (!['link', 'link2', 'all'].includes(targetLinkField)) {
  console.error(`❌ Invalid target specified: "${targetLinkField}". Must be 'link', 'link2', or 'all'.`);
  process.exit(1);
}
console.log(`🎯 Script target: Updating field(s) -> ${targetLinkField}`);
// --- End Argument Parsing ---

// --- Helper Functions ---
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word && word !== 'contest'); // ignore "contest"
}


async function fetchYoutubeVideoLink(query, channelId, fieldName) {
  if (!YOUTUBE_API_KEY) {
    console.error(`❌ YOUTUBE_API_KEY environment variable is not set.`);
    return null;
  }
  if (!channelId) {
    console.warn(`⚠️ Channel ID for field "${fieldName}" is not configured. Skipping fetch.`);
    return null;
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&maxResults=5&channelId=${channelId}&q=${encodeURIComponent(query)}`;

  try {
    console.log(`🔍 Searching YouTube channel ${channelId} (for ${fieldName}) for: "${query}"`);
    const response = await axios.get(url);
    const items = response.data.items || [];

    if (items.length === 0) {
      console.log(`ℹ️ No videos found for query "${query}"`);
      return null;
    }

    const contestWords = normalize(query);
    console.log(`🔎 YouTube returned ${items.length} videos:`);
    items.forEach((item, i) => {
      console.log(`   [${i + 1}] "${item.snippet.title}"`);
    });

    for (const item of items) {
      const title = item.snippet.title;
      const titleWords = normalize(title);
      const allMatch = contestWords.every(word => titleWords.includes(word));

      if (allMatch) {
        const videoId = item.id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`✅ Found match: "${title}" -> ${videoUrl}`);
        return videoUrl;
      }
    }

    console.log(`ℹ️ No suitable video found for query "${query}" after checking title words.`);
    return null;

  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error(`❌ YouTube API error for "${query}": ${errorMessage}`);
    if (errorMessage.includes('API key not valid')) {
      console.error("🚨 Check your YOUTUBE_API_KEY.");
    } else if (errorMessage.includes('quotaExceeded')) {
      console.error("🚨 YouTube API quota exceeded.");
    }
    return null;
  }
}
// --- End Helper Functions ---

// --- Main Update Logic ---
async function updateContestLinks() {
  if (!MONGO_URI) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    return;
  }

  let connection;
  try {
    console.log('🚀 Connecting to MongoDB...');
    connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    const totalCount = await Contest.countDocuments();
    if (totalCount === 0) {
      console.log('🤷 No contests to update.');
      return;
    }

    let processed = 0;
    let updatedCount = 0;

    while (processed < totalCount) {
      console.log(`--- Processing Batch ${Math.floor(processed / BATCH_SIZE) + 1} ---`);
      const batch = await Contest.find().select('_id title link link2').skip(processed).limit(BATCH_SIZE);

      const updateOperations = [];

      for (const contest of batch) {
        const query = `${contest.title}`;
        const updateFields = {};
        let needsUpdate = false;

        const fetchLink1 = targetLinkField === 'link' || targetLinkField === 'all';
        const fetchLink2 = targetLinkField === 'link2' || targetLinkField === 'all';

        if (fetchLink1) {
          const youtubeLink1 = await fetchYoutubeVideoLink(query, CHANNEL_ID_1, 'link');
          if (youtubeLink1 && contest.link !== youtubeLink1) {
            updateFields.link = youtubeLink1;
            needsUpdate = true;
          }
          await new Promise(res => setTimeout(res, 500));
        }

        if (fetchLink2) {
          if (CHANNEL_ID_2) {
            const youtubeLink2 = await fetchYoutubeVideoLink(query, CHANNEL_ID_2, 'link2');
            if (youtubeLink2 && contest.link2 !== youtubeLink2) {
              updateFields.link2 = youtubeLink2;
              needsUpdate = true;
            }
            await new Promise(res => setTimeout(res, 500));
          } else {
            console.log(`ℹ️ Skipping link2 for "${contest.title}" (YOUTUBE_CHANNEL_ID_2 not set).`);
          }
        }

        if (needsUpdate) {
          updateOperations.push({
            updateOne: {
              filter: { _id: contest._id },
              update: { $set: updateFields },
            },
          });
        }
      }

      if (updateOperations.length > 0) {
        const result = await Contest.bulkWrite(updateOperations);
        const modifiedCount = result.modifiedCount || 0;
        updatedCount += modifiedCount;
        console.log(`✅ Updated ${modifiedCount} contests in this batch.`);
      } else {
        console.log('ℹ️ No updates in this batch.');
      }

      processed += batch.length;
      console.log(`⏳ Progress: ${processed}/${totalCount}`);

      if (processed < totalCount) {
        console.log(`⏱️ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s...`);
        await new Promise(res => setTimeout(res, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`🎉 Done! Total contests updated: ${updatedCount}`);
  } catch (err) {
    console.error('❌ Update process error:', err);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}
// --- End Main Update Logic ---

// --- Execute Script ---
updateContestLinks();
// --- End ---
