import { ProcessedEmail } from '../types';
import { cleanDomain } from './domainUtils';
import { normalizeEmail } from './emailNormalizer';

export const processEmailRecord = (
  email: string,
  rowData: any,
  prefix: string = ''
): ProcessedEmail => {
  const normalizedEmail = normalizeEmail(email);
  
  return {
    email: normalizedEmail,
    fullName: rowData[`${prefix}full_name`]?.trim(),
    firstName: rowData[`${prefix}first_name`]?.trim(),
    lastName: rowData[`${prefix}last_name`]?.trim(),
    title: rowData[`${prefix}title`]?.trim(),
    phone: rowData[`${prefix}phone`]?.trim(),
    website: rowData.website || '',
    cleanedWebsite: cleanDomain(rowData.website || ''),
    mxProvider: '',
    otherDmName: '',
    // Preserve original row data
    originalData: { ...rowData }
  };
};