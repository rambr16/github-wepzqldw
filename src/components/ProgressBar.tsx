import React from 'react';
import { ProcessingStatus } from '../types';

interface ProgressBarProps {
  status: ProcessingStatus;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{status.currentTask}</span>
        <span>{Math.round(status.progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${status.progress}%` }}
        />
      </div>
      {!status.isComplete && status.eta > 0 && (
        <p className="text-sm text-gray-500">
          Estimated time remaining: {Math.ceil(status.eta)} seconds
        </p>
      )}
    </div>
  );
};