'use client';

import { ShareNetwork } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

interface ShareButtonProps {
  title: string;
  isLocked: boolean;
}

export default function ShareButton({ title, isLocked }: ShareButtonProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleShare = async () => {
    const shareData = {
      title: isLocked ? "IQ Nikte' | Mayan Medicine Guide" : title,
      text: isLocked
        ? 'Explore traditional Mayan knowledge about medicinal plants on IQ Nikte\'.'
        : `Check out this content on IQ Nikte': ${title}`,
      url: isLocked ? window.location.origin : window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Don't show an error toast if the user cancels the share dialog
        if ((error as DOMException).name !== 'AbortError') {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not share this content.',
             });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: t('shareButton.toast'),
        });
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to copy link.',
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary" size="sm">
      <ShareNetwork className="mr-2 h-4 w-4" />
      {t('shareButton.label')}
    </Button>
  );
}
