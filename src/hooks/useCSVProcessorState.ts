import { useState } from 'react';
import { ProcessingStatus, ProcessedEmail } from '../types';

export const useCSVProcessorState = () => {
  const [status, setStatus] = useState<ProcessingStatus>({
    currentTask: '',
    progress: 0,
    eta: 0,
    isComplete: false
  });
  
  const [processedData, setProcessedData] = useState<ProcessedEmail[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefresh = () => {
    setProcessedData(null);
    setIsProcessing(false);
    setStatus({
      currentTask: '',
      progress: 0,
      eta: 0,
      isComplete: false
    });
  };

  return {
    status,
    processedData,
    isProcessing,
    setStatus,
    setProcessedData,
    setIsProcessing,
    handleRefresh
  };
};