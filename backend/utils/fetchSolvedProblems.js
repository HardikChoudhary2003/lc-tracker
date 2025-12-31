import fetch from 'node-fetch';
import { decrypt } from './crypto.js';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql/';

async function fetchSolvedProblems(encryptedSessionKey) {
    try {
        const sessionKey = decrypt(encryptedSessionKey);
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': `LEETCODE_SESSION=${sessionKey}`,
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://leetcode.com'
        };

        const query = {
            query: `
                query userProblemsSolved {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: "") {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                        submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                        problemsSolvedBeatsStats {
                            difficulty
                            percentage
                        }
                    }
                    userProfileUserQuestions {
                        titleSlug
                        status
                    }
                }
            `
        };

        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(query)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching solved problems:', error);
        throw error;
    }
}

export default fetchSolvedProblems;