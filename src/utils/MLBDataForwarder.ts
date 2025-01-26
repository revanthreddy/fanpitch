import { Conversation } from '../types';
import { getMockTime } from './dateUtils';
import { MLBGameResponse } from './MLBStatsPoller';

const MLB_FORWARDING_ENDPOINT =
  'https://us-central1-ethereal-temple-448819-n0.cloudfunctions.net/playgist_function/interesting';

export interface MLBForwardingResponse {
  summary: string;
}

export class MLBDataForwarder {
  private static instance: MLBDataForwarder | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): MLBDataForwarder {
    if (!MLBDataForwarder.instance) {
      MLBDataForwarder.instance = new MLBDataForwarder();
    }
    return MLBDataForwarder.instance;
  }

  private getFilteredConversation(conversation: Conversation): Conversation {
    const currentTime = getMockTime();
    return {
      ...conversation,
      messages: conversation.messages.filter(
        (msg) => msg.timestamp <= currentTime,
      ),
    };
  }

  public async forwardData(
    mlbData: MLBGameResponse,
    conversation: Conversation,
  ): Promise<MLBForwardingResponse> {
    const filteredConversation = this.getFilteredConversation(conversation);

    try {
      const response = await fetch(MLB_FORWARDING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat: filteredConversation,
          events: mlbData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to forward data: ${response.statusText}`);
      }

      const data = await response.json();
      return data as MLBForwardingResponse;
    } catch (error) {
      console.error('Error forwarding data:', error);
      throw error;
    }
  }
}
