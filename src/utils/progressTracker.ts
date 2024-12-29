import { ProcessingStatus } from '../types';

export interface TaskWeights {
  processing: number;
  mxLookup: number;
  deduplication: number;
  enrichment: number;
}

export class ProgressTracker {
  private startTime: number;
  private weights: TaskWeights;

  constructor(weights: TaskWeights) {
    this.startTime = Date.now();
    this.weights = weights;
  }

  calculateProgress(current: number, total: number, taskWeight: number, baseProgress: number): number {
    return baseProgress + ((current / total) * taskWeight);
  }

  calculateETA(progress: number): number {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const remaining = (100 - progress) * (elapsed / progress);
    return Math.ceil(remaining);
  }

  updateStatus(
    currentTask: string,
    progress: number,
    isComplete: boolean,
    updateFn: (status: ProcessingStatus) => void
  ): void {
    updateFn({
      currentTask,
      progress,
      eta: isComplete ? 0 : this.calculateETA(progress),
      isComplete
    });
  }
}