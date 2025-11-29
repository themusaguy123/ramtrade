import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type ReportType = 'listing' | 'user' | 'chat';

export type ReportReason = 
  | 'Spam'
  | 'Inappropriate Content'
  | 'Scam/Fraud'
  | 'Misleading Information'
  | 'Harassment'
  | 'Other';

export const REPORT_REASONS: ReportReason[] = [
  'Spam',
  'Inappropriate Content',
  'Scam/Fraud',
  'Misleading Information',
  'Harassment',
  'Other',
];

// Create a report
export async function createReport(data: {
  reporterId: string;
  type: ReportType;
  reportedUserId?: string;
  listingId?: string;
  chatId?: string;
  reason: ReportReason;
  details?: string;
}) {
  try {
    // Build the report object, only including fields that have values
    const reportData: any = {
      reporterId: data.reporterId,
      type: data.type,
      reason: data.reason,
      createdAt: serverTimestamp(),
      resolved: false,
    };

    // Only add optional fields if they exist
    if (data.reportedUserId) {
      reportData.reportedUserId = data.reportedUserId;
    }
    if (data.listingId) {
      reportData.listingId = data.listingId;
    }
    if (data.chatId) {
      reportData.chatId = data.chatId;
    }
    if (data.details && data.details.trim()) {
      reportData.details = data.details.trim();
    }

    await addDoc(collection(db, 'reports'), reportData);

    return { success: true };
  } catch (error: any) {
    console.error('Error creating report:', error);
    return { success: false, error: error.message };
  }
}