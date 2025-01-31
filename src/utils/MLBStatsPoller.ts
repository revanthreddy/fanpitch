import { getMockTime } from './dateUtils';

export interface MLBGameResponse {
  start: string | null;
  end: string | null;
}

const MLB_GAME_ID = '746011';

export class MLBStatsPoller {
  private static instance: MLBStatsPoller | null = null;
  private static intervalId: number | null = null;
  private static initializationPromise: Promise<void> | null = null;
  private readonly pollInterval: number;
  private readonly endTime: number;
  private readonly onUpdate: (response: MLBGameResponse) => void;
  private lastPollTime: string | null = null;
  private availableTimestamps: string[] = [];

  private constructor(
    pollIntervalMs: number,
    endTime: number,
    onUpdate: (response: MLBGameResponse) => void,
  ) {
    this.pollInterval = pollIntervalMs;
    this.endTime = endTime;
    this.onUpdate = onUpdate;
    this.startPolling().catch(console.error);
  }

  public static getInstance(
    pollIntervalMs: number = 2000,
    endTime: number,
    onUpdate: (response: MLBGameResponse) => void,
  ): MLBStatsPoller {
    if (!MLBStatsPoller.instance) {
      MLBStatsPoller.instance = new MLBStatsPoller(
        pollIntervalMs,
        endTime,
        onUpdate,
      );
    }
    return MLBStatsPoller.instance;
  }

  private shouldContinuePolling(): boolean {
    const now = getMockTime();
    return now < this.endTime;
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
    return timestamps.reduce((closest, timestamp) => {
      if (timestamp <= currentTime && timestamp > closest) {
        return timestamp;
      }
      return closest;
    }, '');
  }

  private getCurrentTimestamp(): string {
    const now = new Date(getMockTime());
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
        this.lastPollTime = this.availableTimestamps[0];
      }
    } catch (error) {
      console.error('Failed to initialize timestamps:', error);
      throw error;
    }
  }

  private async poll() {
    try {
      if (!this.shouldContinuePolling()) {
        console.log('Chat simulation ended, stopping MLB stats polling');
        this.stopPolling();
        return;
      }

      const currentTimestamp = this.getCurrentTimestamp();
      const newTimestamp = this.findClosestPastTimestamp(
        this.availableTimestamps,
        currentTimestamp,
      );

      if (newTimestamp > (this.lastPollTime || 0)) {
        this.onUpdate({ start: this.lastPollTime, end: newTimestamp });
        this.lastPollTime = newTimestamp;
      }
    } catch (error) {
      console.error('Error during polling:', error);
    }
  }

  private async startPolling(): Promise<void> {
    if (MLBStatsPoller.initializationPromise) {
      await MLBStatsPoller.initializationPromise;
      return;
    }

    if (MLBStatsPoller.intervalId !== null) {
      return;
    }

    MLBStatsPoller.initializationPromise = (async () => {
      try {
        await this.initialize();
        await this.poll();
        MLBStatsPoller.intervalId = window.setInterval(
          () => this.poll(),
          this.pollInterval,
        );
      } catch (error) {
        MLBStatsPoller.initializationPromise = null;
        throw error;
      }
    })();

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
