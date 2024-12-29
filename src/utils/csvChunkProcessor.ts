import { ProcessedEmail } from '../types';

const CHUNK_SIZE = 2000; // Increased chunk size for better performance

export const processInChunks = async <T,>(
  data: T[],
  processFunction: (chunk: T[]) => Promise<ProcessedEmail[]>,
  onProgress: (progress: number) => void
): Promise<ProcessedEmail[]> => {
  const results: ProcessedEmail[] = [];
  const chunks = Math.ceil(data.length / CHUNK_SIZE);
  
  // Process chunks in parallel with a limit
  const MAX_CONCURRENT = 4;
  for (let i = 0; i < chunks; i += MAX_CONCURRENT) {
    const chunkPromises = [];
    
    for (let j = 0; j < MAX_CONCURRENT && (i + j) < chunks; j++) {
      const start = (i + j) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, data.length);
      const chunk = data.slice(start, end);
      
      chunkPromises.push(processFunction(chunk));
    }
    
    const processedChunks = await Promise.all(chunkPromises);
    results.push(...processedChunks.flat());
    
    onProgress(Math.min(((i + MAX_CONCURRENT) / chunks) * 100, 100));
  }
  
  return results;
};