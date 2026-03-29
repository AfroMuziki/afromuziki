// frontend/src/components/engagement/ShareButton/ShareButton.tsx
import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/Button/Button';
import { Modal } from '../../ui/Modal/Modal';
import { showToast } from '../../ui/Toast/Toast';
import { cn } from '../../../utils/cn';

export interface ShareButtonProps {
  title: string;
  url: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost';
}

const sharePlatforms = [
  { name: 'Twitter', url: (text: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, icon: '𝕏' },
  { name: 'Facebook', url: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: 'f' },
  { name: 'WhatsApp', url: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, icon: 'W' },
  { name: 'Telegram', url: (text: string, url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, icon: 'T' },
  { name: 'LinkedIn', url: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, icon: 'in' },
  { name: 'Email', url: (subject: string, body: string) => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, icon: '✉' },
];

export const ShareButton = ({ title, url, size = 'md', variant = 'ghost' }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast.success('Link copied to clipboard');
      setIsOpen(false);
    } catch {
      showToast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: typeof sharePlatforms[0]) => {
    let shareUrl = '';
    if (platform.name === 'Twitter' || platform.name === 'WhatsApp' || platform.name === 'Telegram') {
      shareUrl = platform.url(title, url);
    } else if (platform.name === 'Facebook' || platform.name === 'LinkedIn') {
      shareUrl = platform.url(url);
    } else if (platform.name === 'Email') {
      shareUrl = platform.url(`Check out ${title} on AfroMuziki`, `I found this great content on AfroMuziki: ${title}\n\n${url}`);
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon={<ShareIcon className="w-4 h-4" />}
        onClick={() => setIsOpen(true)}
      >
        Share
      </Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Share this content">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {sharePlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-sm">{platform.name}</span>
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              />
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
