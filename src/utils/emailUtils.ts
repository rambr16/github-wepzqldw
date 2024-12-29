import { ProcessedEmail } from '../types';
import { isValidEmail, normalizeEmail, normalizeEmailRecord } from './emailNormalizer';

export const removeDuplicateEmails = (emails: ProcessedEmail[]): ProcessedEmail[] => {
  // First filter out invalid emails
  const validEmails = emails.filter(email => isValidEmail(email.email));
  
  // Use a Map to store unique emails, keeping the first occurrence
  const emailMap = new Map<string, ProcessedEmail>();
  
  // Process each email record
  validEmails.forEach(record => {
    const normalizedEmail = normalizeEmail(record.email);
    
    if (!emailMap.has(normalizedEmail)) {
      // Normalize all fields in the record
      const normalizedRecord = normalizeEmailRecord(record);
      emailMap.set(normalizedEmail, normalizedRecord);
    }
  });
  
  return Array.from(emailMap.values());
};