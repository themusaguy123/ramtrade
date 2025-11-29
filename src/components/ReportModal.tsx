'use client';

import { useState } from 'react';
import { createReport, REPORT_REASONS, ReportType, ReportReason } from '@/lib/reports';

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType;
  reportedUserId?: string;
  listingId?: string;
  chatId?: string;
  reporterId: string;
};

export default function ReportModal({
  isOpen,
  onClose,
  reportType,
  reportedUserId,
  listingId,
  chatId,
  reporterId,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('Spam');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createReport({
      reporterId,
      type: reportType,
      reportedUserId,
      listingId,
      chatId,
      reason,
      details: details.trim() || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      alert('Report submitted successfully. Thank you for helping keep RamTrade safe!');
      onClose();
      setReason('Spam');
      setDetails('');
    } else {
      alert('Failed to submit report: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Report {reportType === 'listing' ? 'Listing' : reportType === 'user' ? 'User' : 'Chat'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Please provide any additional information..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Reports are reviewed by moderators. False reports may result in account suspension.
        </p>
      </div>
    </div>
  );
}