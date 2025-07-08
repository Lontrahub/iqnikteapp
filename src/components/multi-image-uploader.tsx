'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadSimple, XCircle, Image as ImageIcon } from 'phosphor-react';
import { cn } from '@/lib/utils';

interface MultiImageUploaderProps {
  initialUrls?: string[];
  onUrlsChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  initialUrls = [],
  onUrlsChange,
  maxImages = 5,
}: MultiImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (urls.length >= maxImages) {
        toast({
            variant: 'destructive',
            title: 'Upload Limit Reached',
            description: `You can only upload a maximum of ${maxImages} images.`,
        });
        return;
    }

    setUploading(true);
    setProgress(0);
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        console.error('Upload failed', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error uploading your image.',
        });
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((newUrl) => {
          const updatedUrls = [...urls, newUrl];
          setUrls(updatedUrls);
          onUrlsChange(updatedUrls);
          setUploading(false);
          toast({
            title: 'Upload Successful',
            description: 'Image added to the list.',
          });
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        });
      }
    );
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedUrls = urls.filter(url => url !== urlToRemove);
    setUrls(updatedUrls);
    onUrlsChange(updatedUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {urls.map((url, index) => (
          <div key={url} className="relative aspect-square w-full">
            <Image src={url} alt={`Uploaded image ${index + 1}`} fill className="object-cover rounded-lg" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 z-10 rounded-full h-6 w-6"
              onClick={() => handleRemoveImage(url)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {urls.length < maxImages && (
            <div 
                className={cn(
                    "relative aspect-square w-full border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 text-muted-foreground",
                    uploading ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted/80 transition-colors'
                )}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className="text-center p-2">
                        <Progress value={progress} className="w-full h-2" />
                        <p className="text-xs mt-2">Uploading...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <UploadSimple className="mx-auto h-8 w-8" />
                        <p className="text-sm mt-1">Add Image</p>
                    </div>
                )}
            </div>
        )}
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={uploading || urls.length >= maxImages}
      />
    </div>
  );
}
