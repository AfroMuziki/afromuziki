// frontend/src/components/engagement/DownloadButton/DownloadButton.tsx
import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useDownload } from '../../../hooks/engagement/useDownload';
import { Button } from '../../ui/Button/Button';
import { showToast } from '../../ui/Toast/Toast';

export interface DownloadButtonProps {
  contentId: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DownloadButton = ({ contentId, title, size = 'md' }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { mutate: download } = useDownload();

  const handleDownload = async () => {
    setIsDownloading(true);
    
    download(contentId, {
      onSuccess: (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast.success('Download started');
      },
      onError: () => {
        showToast.error('Failed to download. Please try again.');
      },
      onSettled: () => {
        setIsDownloading(false);
      },
    });
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleDownload}
      isLoading={isDownloading}
      icon={<ArrowDownTrayIcon className="w-4 h-4" />}
    >
      Download
    </Button>
  );
};
