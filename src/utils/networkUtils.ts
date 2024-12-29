interface RetryOptions {
  initialDelay?: number;
  maxRetries?: number;
  backoffFactor?: number;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  options: RetryOptions = {}
): Promise<T> {
  const {
    initialDelay = 1000,
    backoffFactor = 2
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry if request was aborted
      if (error.name === 'AbortError') {
        throw error;
      }
      
      lastError = error;
      if (attempt === maxRetries - 1) {
        break;
      }
      
      const delay = initialDelay * Math.pow(backoffFactor, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}