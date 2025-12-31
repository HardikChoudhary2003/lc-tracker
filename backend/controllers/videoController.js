import { getContestVideoLink, searchYouTubeForContest } from '../services/videoService.js';

/**
 * Get video link for a contest
 */
export const getContestVideos = async (req, res) => {
  const { slug } = req.params; // This is the contest titleSlug

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Valid contest slug is required' });
  }

  try {
    // 1. Check database first
    const dbResult = await getContestVideoLink(slug);
    
    // If found in DB, return it
    if (dbResult && dbResult.link) {
      return res.json({ videoLink: dbResult.link, source: 'database' });
    }

    // 2. If not found in DB, search YouTube
    console.log(`Video link for contest ${slug} not found in DB or empty. Searching YouTube...`);
    const youtubeResult = await searchYouTubeForContest(slug);

    res.json({ ...youtubeResult, source: 'youtube_api' });
  } catch (error) {
    console.error(`Error fetching/searching YouTube video for contest ${slug}:`, error);
    res.status(500).json({
      message: 'Failed to search for contest videos',
      error: error.message 
    });
  }
};
