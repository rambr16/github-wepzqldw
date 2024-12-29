import { ProcessedEmail, ProcessingStatus } from '../types';
import { getMxProvider } from './domainUtils';
import { assignOtherDmNames } from './emailEnrichment';
import { normalizeContactData } from './dataNormalization';
import { removeDuplicateEmails } from './emailUtils';
import { isScenario1 } from './csvValidator';
import { processEmailRecord } from './emailProcessor';
import { ProgressTracker, TaskWeights } from './progressTracker';

const TASKS = {
  PARSING: 'Parsing CSV data',
  PROCESSING: 'Processing emails',
  MX_LOOKUP: 'Looking up email providers',
  DEDUPLICATION: 'Removing duplicates',
  ENRICHMENT: 'Enriching data'
};

const DEFAULT_WEIGHTS: TaskWeights = {
  processing: 40,
  mxLookup: 40,
  deduplication: 10,
  enrichment: 10
};

export const processEmailsScenario1 = async (
  data: any[],
  updateStatus: (status: ProcessingStatus) => void
): Promise<ProcessedEmail[]> => {
  const progress = new ProgressTracker(DEFAULT_WEIGHTS);
  const processedEmails: ProcessedEmail[] = [];
  const totalEmails = data.length * 3;
  let processedCount = 0;

  // Process emails and collect domains
  const domains = new Set<string>();
  for (const row of data) {
    for (let i = 1; i <= 3; i++) {
      const email = row[`email_${i}`];
      if (email?.trim()) {
        const prefix = `email_${i}_`;
        const processed = processEmailRecord(email, row, prefix);
        domains.add(processed.email.split('@')[1]);
        processedEmails.push(processed);
      }
      processedCount++;
      
      const currentProgress = progress.calculateProgress(
        processedCount, 
        totalEmails, 
        DEFAULT_WEIGHTS.processing, 
        0
      );
      progress.updateStatus(TASKS.PROCESSING, currentProgress, false, updateStatus);
    }
  }

  // Process MX records and update other fields
  await processMXRecords(processedEmails, domains, progress, updateStatus);
  return finalizeProcessing(processedEmails, progress, updateStatus);
};

export const processEmailsScenario2 = async (
  data: any[],
  updateStatus: (status: ProcessingStatus) => void
): Promise<ProcessedEmail[]> => {
  const progress = new ProgressTracker(DEFAULT_WEIGHTS);
  const processedEmails: ProcessedEmail[] = [];
  const totalEmails = data.length;
  let processedCount = 0;

  // Process emails and collect domains
  const domains = new Set<string>();
  for (const row of data) {
    const email = row.email;
    if (email?.trim()) {
      const normalizedData = normalizeContactData(row);
      const processed = processEmailRecord(email, { ...row, ...normalizedData });
      domains.add(processed.email.split('@')[1]);
      processedEmails.push(processed);
    }
    processedCount++;
    
    const currentProgress = progress.calculateProgress(
      processedCount, 
      totalEmails, 
      DEFAULT_WEIGHTS.processing, 
      0
    );
    progress.updateStatus(TASKS.PROCESSING, currentProgress, false, updateStatus);
  }

  // Process MX records and update other fields
  await processMXRecords(processedEmails, domains, progress, updateStatus);
  return finalizeProcessing(processedEmails, progress, updateStatus);
};

async function processMXRecords(
  emails: ProcessedEmail[],
  domains: Set<string>,
  progress: ProgressTracker,
  updateStatus: (status: ProcessingStatus) => void
): Promise<void> {
  const domainArray = Array.from(domains);
  const mxResults = await Promise.all(
    domainArray.map(async (domain, index) => {
      const result = await getMxProvider(domain);
      const currentProgress = progress.calculateProgress(
        index + 1,
        domainArray.length,
        DEFAULT_WEIGHTS.mxLookup,
        DEFAULT_WEIGHTS.processing
      );
      progress.updateStatus(TASKS.MX_LOOKUP, currentProgress, false, updateStatus);
      return [domain, result] as [string, string];
    })
  );

  const mxMap = new Map(mxResults);
  emails.forEach(email => {
    const domain = email.email.split('@')[1];
    email.mxProvider = mxMap.get(domain) || 'unknown';
  });
}

function finalizeProcessing(
  emails: ProcessedEmail[],
  progress: ProgressTracker,
  updateStatus: (status: ProcessingStatus) => void
): ProcessedEmail[] {
  // Remove duplicates
  progress.updateStatus(
    TASKS.DEDUPLICATION,
    DEFAULT_WEIGHTS.processing + DEFAULT_WEIGHTS.mxLookup + DEFAULT_WEIGHTS.deduplication / 2,
    false,
    updateStatus
  );
  const uniqueEmails = removeDuplicateEmails(emails);

  // Enrich data
  progress.updateStatus(
    TASKS.ENRICHMENT,
    95,
    false,
    updateStatus
  );
  const enrichedEmails = assignOtherDmNames(uniqueEmails);

  progress.updateStatus(
    'Processing complete',
    100,
    true,
    updateStatus
  );

  return enrichedEmails;
}

export { isScenario1 };