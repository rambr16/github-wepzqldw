import React from 'react';
import { FileUpload } from './FileUpload';
import { ProcessingView } from './ProcessingView';
import { ResultsPreview } from './ResultsPreview';
import { Header } from './Header';
import { useCSVProcessorState } from '../hooks/useCSVProcessorState';
import { useCSVProcessor } from '../hooks/useCSVProcessor';

export const CSVProcessor: React.FC = () => {
  const {
    status,
    processedData,
    isProcessing,
    setStatus,
    setProcessedData,
    setIsProcessing,
    handleRefresh
  } = useCSVProcessorState();

  const { handleFileSelect, handleDownload } = useCSVProcessor({
    setStatus,
    setProcessedData,
    setIsProcessing
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Header onRefresh={handleRefresh} />

        {!isProcessing && !processedData && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {isProcessing && (
          <ProcessingView status={status} />
        )}

        {processedData && !isProcessing && (
          <ResultsPreview 
            data={processedData} 
            onDownload={handleDownload} 
          />
        )}
      </div>
    </div>
  );
};