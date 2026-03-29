// frontend/src/hooks/engagement/useReport.ts
import { useMutation } from '@tanstack/react-query';
import { engagementApi } from '../../services/api/engagement.api';
import { showToast } from '../../components/ui/Toast/Toast';

interface ReportData {
  targetType: 'content' | 'comment' | 'user';
  targetId: string;
  reason: string;
}

export const useReport = () => {
  return useMutation({
    mutationFn: (data: ReportData) => engagementApi.reportContent(data),
    onSuccess: () => {
      showToast.success('Report submitted successfully');
    },
    onError: (error: any) => {
      showToast.error(error.message || 'Failed to submit report');
    },
  });
};
