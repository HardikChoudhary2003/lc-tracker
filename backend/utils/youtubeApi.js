import axios from 'axios';
import NodeCache from 'node-cache';

import dotenv from 'dotenv';

dotenv.config();

// YouTube API configuration
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || `UC_xBkUq2z-rbp2mbZal-0cw`;

/**
 * Returns the YouTube channel ID from environment variables
 * @returns {string} - The channel ID
 */
export function resolveChannelId() {
  if (!YOUTUBE_CHANNEL_ID) {
    throw new Error('YouTube channel ID not found in environment variables');
  }
  return YOUTUBE_CHANNEL_ID;
}

/**
 * Converts a slug to a search query
 * @param {string} slug - The slug (e.g., weekly-contest-398)
 * @returns {string} - The search query (e.g., weekly contest 398)
 */
function slugToSearchQuery(slug) {
  return slug.replace(/-/g, ' ').trim();
}

/**
 * Checks if all words from the slug appear in the description
 * @param {string} slug - The original slug
 * @param {string} description - The video description
 * @returns {boolean} - True if all words are found
 */
function descriptionContainsAllSlugWords(slug, description) {
  if (!description) return false;
  
  const slugWords = slug.toLowerCase().split('-');
  const descriptionLower = description.toLowerCase();
  
  return slugWords.every(word => descriptionLower.includes(word));
}

/**
 * Searches for videos related to a contest slug in a specific channel
 * @param {string} slug - The contest slug (e.g., weekly-contest-398)
 * @returns {Promise<Array>} - Array of matching videos with title and link
 */
export async function searchVideosForContest(slug) {
  try {
    // Convert slug to search query
    const searchQuery = slugToSearchQuery(slug);
    
    // Get channel ID directly from environment
    const channelId = resolveChannelId();
    
    // Search for videos
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        channelId: channelId,
        q: searchQuery,
        type: 'video',
        maxResults: 2,
        key: YOUTUBE_API_KEY
      }
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return { found: false, message: `No videos found for ${slug}` };
    }
    
    // Get detailed info including descriptions
    const videoIds = response.data.items.map(item => item.id.videoId);
    const videoDetailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY
      }
    });
    
    // Filter videos where slug words appear in description
    const matchingVideos = videoDetailsResponse.data.items
      .filter(video => descriptionContainsAllSlugWords(slug, video.snippet.description))
      .map(video => ({
        title: video.snippet.title,
        link: `https://www.youtube.com/watch?v=${video.id}`
      }));
    
    if (matchingVideos.length === 0) {
      return { found: false, message: `No matching videos found for ${slug}` };
    }
    
    return { found: true, videos: matchingVideos };
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
}
