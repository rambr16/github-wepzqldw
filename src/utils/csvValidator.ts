import { ProcessedEmail } from '../types';

export const isScenario1 = (headers: string[]): boolean => {
  const requiredColumns = [
    'email_1',
    'email_1_full_name',
    'email_1_first_name',
    'email_1_last_name',
  ];
  return requiredColumns.every(col => headers.includes(col));
};