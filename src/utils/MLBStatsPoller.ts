import { Conversation } from '../types';
import { MLBDataForwarder, MLBForwardingResponse } from './MLBDataForwarder';

interface MLBGamePlay {
  result: {
    description: string;
    event: string;
    eventType: string;
    isOut: boolean;
  };
  about: {
    startTime: string;
    endTime: string;
    isComplete: boolean;
  };
}

export interface MLBGameResponse {
  liveData: {
    plays: {
      allPlays: MLBGamePlay[];
    };
  };
}

const MLB_GAME_ID = '746011';

export class MLBStatsPoller {
  private static instance: MLBStatsPoller | null = null;
  private static intervalId: number | null = null;
  private static initializationPromise: Promise<void> | null = null;
  private readonly pollInterval: number;
  private readonly dataForwarder: MLBDataForwarder;
  private readonly conversation: Conversation;
  private readonly onUpdate: (response: MLBForwardingResponse) => void;
  private lastPollTime: string;
  private availableTimestamps: string[] = [];

  private constructor(
    pollIntervalMs: number,
    conversation: Conversation,
    onUpdate: (response: MLBForwardingResponse) => void,
  ) {
    this.pollInterval = pollIntervalMs;
    this.conversation = conversation;
    this.onUpdate = onUpdate;
    this.dataForwarder = MLBDataForwarder.getInstance();
    this.lastPollTime = '20230923_231815'; // Default value, will be updated in initialize()
    this.startPolling().catch(console.error);
  }

  public static getInstance(
    pollIntervalMs: number = 30000,
    conversation: Conversation,
    onUpdate: (response: MLBForwardingResponse) => void,
  ): MLBStatsPoller {
    if (!MLBStatsPoller.instance) {
      MLBStatsPoller.instance = new MLBStatsPoller(
        pollIntervalMs,
        conversation,
        onUpdate,
      );
    }
    return MLBStatsPoller.instance;
  }

  private async fetchTimestamps(): Promise<string[]> {
    const url = `https://statsapi.mlb.com/api/v1.1/game/${MLB_GAME_ID}/feed/live/timestamps`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `MLB Timestamps API request failed: ${response.statusText}`,
      );
    }
    return await response.json();
  }

  private findClosestPastTimestamp(
    timestamps: string[],
    currentTime: string,
  ): string {
    // Find the largest timestamp that's less than or equal to current time
    return timestamps.reduce((closest, timestamp) => {
      if (timestamp <= currentTime && timestamp > closest) {
        return timestamp;
      }
      return closest;
    }, '');
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[^0-9]/g, '')
      .replace(/(\d{8})(\d{6}).*/, '$1_$2');
  }

  private async initialize(): Promise<void> {
    try {
      this.availableTimestamps = await this.fetchTimestamps();
      const currentTimestamp = this.getCurrentTimestamp();
      this.lastPollTime = this.findClosestPastTimestamp(
        this.availableTimestamps,
        currentTimestamp,
      );

      if (!this.lastPollTime) {
        // If no past timestamp found, use the earliest available
        this.lastPollTime = this.availableTimestamps[0];
      }
    } catch (error) {
      console.error('Failed to initialize timestamps:', error);
      throw error;
    }
  }

  private async fetchMLBStats(): Promise<MLBGameResponse> {
    const url = `https://statsapi.mlb.com/api/v1.1/game/${MLB_GAME_ID}/feed/live?timecode=${this.lastPollTime}&fields=liveData,plays,allPlays,result,description,event,eventType,isOut,about,startTime,endTime,isComplete`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MLB API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Update the last poll time to the latest play's end time if available
    const plays = data.liveData?.plays?.allPlays || [];
    if (plays.length > 0) {
      const lastPlay = plays[plays.length - 1];
      if (lastPlay.about?.endTime) {
        // Convert ISO date to required format (YYYYMMDD_HHMMSS)
        const newTimestamp = lastPlay.about.endTime
          .replace(/[^0-9]/g, '')
          .replace(/(\d{8})(\d{6})/, '$1_$2');

        // Only update if the new timestamp exists in our available timestamps
        if (this.availableTimestamps.includes(newTimestamp)) {
          this.lastPollTime = newTimestamp;
        }
      }
    }

    return data;
  }

  private async poll() {
    try {
      console.log('Fetching MLB stats');
      const mlbData = await this.fetchMLBStats();
      const response = await this.dataForwarder.forwardData(
        mlbData,
        this.conversation,
      );
      this.onUpdate(response);
    } catch (error) {
      console.error('Error during polling:', error);
    }
  }

  private async startPolling(): Promise<void> {
    // If there's an existing initialization in progress, wait for it
    if (MLBStatsPoller.initializationPromise) {
      await MLBStatsPoller.initializationPromise;
      return;
    }

    // If polling is already running (after initialization), return
    if (MLBStatsPoller.intervalId !== null) {
      return;
    }

    // Create and store the initialization promise
    MLBStatsPoller.initializationPromise = (async () => {
      try {
        await this.initialize();

        // Initial poll
        await this.poll();

        // Start periodic polling
        MLBStatsPoller.intervalId = window.setInterval(
          () => this.poll(),
          this.pollInterval,
        );
      } catch (error) {
        // Clear the initialization promise on failure
        MLBStatsPoller.initializationPromise = null;
        throw error;
      }
    })();

    // Wait for initialization to complete
    await MLBStatsPoller.initializationPromise;
  }

  public stopPolling(): void {
    if (MLBStatsPoller.intervalId !== null) {
      window.clearInterval(MLBStatsPoller.intervalId);
      MLBStatsPoller.intervalId = null;
    }
    MLBStatsPoller.initializationPromise = null;
  }
}
