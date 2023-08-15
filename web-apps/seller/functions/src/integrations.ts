import * as functions from 'firebase-functions';
import axios from 'axios';

export const sendSlackMessage = async (channel: string, message: string): Promise<void> => {
  functions.logger.info(`Sending slack message: "${message}"`);

  try {
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel,
        text: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${functions.config().slack.api_key}`,
        },
      }
    );
  } catch (e) {
    functions.logger.error('Failed to send slack message', e);
  }

  functions.logger.info(`Sent slack message: "${message}"`);
};
