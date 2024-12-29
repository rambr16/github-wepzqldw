import { ProcessedEmail } from '../types';

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return trimmed.includes('@') && 
         trimmed.split('@').length === 2 && 
         trimmed.split('@')[0].length > 0 && 
         trimmed.split('@')[1].length > 0;
};

export const normalizeEmailRecord = (record: ProcessedEmail): ProcessedEmail => {
  return {
    ...record,
    email: normalizeEmail(record.email),
    fullName: record.fullName?.trim() || '',
    firstName: record.firstName?.trim() || '',
    lastName: record.lastName?.trim() || '',
    title: record.title?.trim() || '',
    cleanedWebsite: record.cleanedWebsite?.trim() || '',
    mxProvider: record.mxProvider?.trim() || '',
    otherDmName: record.otherDmName?.trim() || ''
  };
};