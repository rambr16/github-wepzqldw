import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { ProcessedEmail, ProcessingStatus } from '../types';
import { isScenario1, processEmailsScenario1, processEmailsScenario2 } from '../utils/csvProcessor';
import { processInChunks } from '../utils/csvChunkProcessor';

interface UseCSVProcessorProps {
  setStatus: (status: ProcessingStatus) => void;
  setProcessedData: (data: ProcessedEmail[] | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useCSVProcessor = ({
  setStatus,
  setProcessedData,
  setIsProcessing
}: UseCSVProcessorProps) => {
  const downloadingRef = useRef(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setStatus({
      currentTask: 'Parsing CSV file',
      progress: 0,
      eta: 0,
      isComplete: false
    });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const headers = Object.keys(results.data[0]);
        const scenario1 = isScenario1(headers);
        
        try {
          const processed = await processInChunks(
            results.data,
            async (chunk) => scenario1
              ? await processEmailsScenario1(chunk, setStatus)
              : await processEmailsScenario2(chunk, setStatus),
            (progress) => setStatus(prev => ({
              ...prev,
              progress,
              eta: (100 - progress) * 0.5
            }))
          );
          
          setProcessedData(processed);
          setStatus(prev => ({
            ...prev,
            currentTask: 'Processing complete',
            progress: 100,
            isComplete: true
          }));
        } catch (error) {
          console.error('Processing error:', error);
          setStatus(prev => ({
            ...prev,
            currentTask: 'Error processing file',
            isComplete: true
          }));
        } finally {
          setIsProcessing(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setIsProcessing(false);
        setStatus(prev => ({
          ...prev,
          currentTask: 'Error parsing file',
          isComplete: true
        }));
      }
    });
  }, [setIsProcessing, setStatus, setProcessedData]);

  const prepareCSVData = useCallback((data: ProcessedEmail[]): any[] => {
    return data.map(record => ({
      // Original data first
      ...record.originalData,
      // Then processed data (will override any duplicate fields)
      email: record.email,
      fullName: record.fullName,
      firstName: record.firstName,
      lastName: record.lastName,
      title: record.title,
      phone: record.phone,
      website: record.website,
      cleanedWebsite: record.cleanedWebsite,
      mxProvider: record.mxProvider,
      otherDmName: record.otherDmName
    }));
  }, []);

  const handleDownload = useCallback(() => {
    // Prevent multiple downloads using ref
    if (downloadingRef.current) return;
    downloadingRef.current = true;

    setProcessedData(prevData => {
      if (!prevData) {
        downloadingRef.current = false;
        return null;
      }

      try {
        const csvData = prepareCSVData(prevData);
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'processed_emails.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
      }

      // Reset downloading state after a short delay
      setTimeout(() => {
        downloadingRef.current = false;
      }, 1000);

      return prevData;
    });
  }, [setProcessedData, prepareCSVData]);

  return {
    handleFileSelect,
    handleDownload
  };
};