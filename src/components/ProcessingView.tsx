import React from 'react';
import { ProcessingStatus } from '../types';
import { ProgressBar } from './ProgressBar';

interface ProcessingViewProps {
  status: ProcessingStatus;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ status }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <ProgressBar status={status} />
    </div>
  );
};