import { ProcessedEmail } from '../types';

export const assignOtherDmNames = (emails: ProcessedEmail[]): ProcessedEmail[] => {
  // Group emails by domain (from both email and website fields)
  const emailsByDomain = emails.reduce((acc, email) => {
    // Get domain from email
    const emailDomain = email.email.split('@')[1];
    // Get website domain (if exists)
    const websiteDomain = email.website || '';
    
    // Add to both domain groups if they exist
    if (emailDomain) {
      if (!acc[emailDomain]) acc[emailDomain] = [];
      acc[emailDomain].push(email);
    }
    if (websiteDomain && websiteDomain !== emailDomain) {
      if (!acc[websiteDomain]) acc[websiteDomain] = [];
      if (!acc[websiteDomain].some(e => e.email === email.email)) {
        acc[websiteDomain].push(email);
      }
    }
    
    return acc;
  }, {} as Record<string, ProcessedEmail[]>);

  // Process each domain group
  Object.values(emailsByDomain).forEach(domainEmails => {
    // Filter for valid contacts (those with full names)
    const validContacts = domainEmails.filter(e => 
      e.fullName && 
      e.fullName.trim() !== '' &&
      !e.email.includes('info@') && 
      !e.email.includes('contact@') && 
      !e.email.includes('support@') &&
      !e.email.includes('sales@') &&
      !e.email.includes('admin@')
    );

    if (validContacts.length > 1) {
      // Assign other_dm_name using round-robin
      validContacts.forEach((email, index) => {
        const nextContact = validContacts[(index + 1) % validContacts.length];
        email.otherDmName = nextContact.fullName;
      });
    }
  });

  return emails;
};