import { google } from 'googleapis';

const API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

interface ModerationResult {
  isToxic: boolean;
}

const analyzeText = async (text: string): Promise<ModerationResult> => {
  if (!API_KEY) {
    console.warn('[Moderation] PERSPECTIVE_API_KEY not found. Skipping moderation.');
    return { isToxic: false };
  }

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return { isToxic: false };
  }

  try {
    const client: any = await google.discoverAPI(DISCOVERY_URL);

    const analyzeRequest = {
      comment: { text },
      requestedAttributes: {
        TOXICITY: {},
      },
    };

    const response = await client.comments.analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    const toxicityScore =
      response.data.attributeScores.TOXICITY.summaryScore.value;
    const TOXICITY_THRESHOLD = 0.7;

    if (toxicityScore > TOXICITY_THRESHOLD) {
      console.log(`[Moderation] Flagged content with toxicity score: ${toxicityScore}`);
      return { isToxic: true };
    }

    return { isToxic: false };
  } catch (error) {
    console.error('[Moderation Service] Error analyzing text with Perspective API:', error);
    return { isToxic: false };
  }
};

export const moderationService = {
  analyzeText,
};