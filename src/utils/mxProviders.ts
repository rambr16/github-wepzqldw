// MX record patterns for major email providers
export const MX_PATTERNS = {
  google: [
    'google',
    'gmail',
    'googlemail',
    'aspmx.l.google.com',
    'alt1.aspmx.l.google.com',
    'alt2.aspmx.l.google.com'
  ],
  outlook: [
    'outlook',
    'microsoft',
    'hotmail',
    'protection.outlook.com',
    'mail.protection.outlook.com',
    'olc.protection.outlook.com'
  ],
  // Add more providers as needed
};

export function identifyProvider(mxRecords: string[]): string {
  if (!Array.isArray(mxRecords) || mxRecords.length === 0) {
    return 'others';
  }

  const lowerRecords = mxRecords.map(record => record.toLowerCase());
  
  // Check for Google
  if (lowerRecords.some(record => 
    MX_PATTERNS.google.some(pattern => record.includes(pattern)))) {
    return 'google';
  }
  
  // Check for Outlook/Microsoft
  if (lowerRecords.some(record => 
    MX_PATTERNS.outlook.some(pattern => record.includes(pattern)))) {
    return 'outlook';
  }
  
  return 'others';
}