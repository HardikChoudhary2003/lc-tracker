import Contest from '../models/Contest.js';
import { searchVideosForContest } from '../utils/youtubeApi.js';

/**
 * Get contest video link from database
 * @param {string} contestSlug - Contest slug
 * @returns {Object|null} - Contest object with link or null
 */
export const getContestVideoLink = async (contestSlug) => {
  return Contest.findOne({ titleSlug: contestSlug }).select('link').lean();
};

/**
 * Search YouTube for contest videos
 * @param {string} contestSlug - Contest slug
 * @returns {Object} - YouTube search results
 */
export const searchYouTubeForContest = async (contestSlug) => {
  return searchVideosForContest(contestSlug);
};
