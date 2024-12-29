export interface ProcessedEmail {
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  website?: string;
  cleanedWebsite?: string;
  mxProvider?: string;
  otherDmName?: string;
  originalData?: Record<string, any>;
  [key: string]: any;
}

export interface ProcessingStatus {
  currentTask: string;
  progress: number;
  eta: number;
  isComplete: boolean;
}