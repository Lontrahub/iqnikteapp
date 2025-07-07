
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, XCircle, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  initialImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ initialImageUrl, onUploadComplete }: ImageUploaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setUploading(true);
    setProgress(0);
    const storageRef = ref(storage, `plants/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

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
          description: 'There was an error uploading your image. Please try again.',
        });
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          onUploadComplete(url);
          setUploading(false);
          toast({
            title: 'Upload Successful',
            description: 'Your image has been uploaded and the URL has been set.',
          });
        });
      }
    );
  };

  const handleRemoveImage = () => {
      setImageFile(null);
      setPreview(null);
      onUploadComplete('');
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-64 relative border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
        {preview ? (
          <>
            <Image src={preview} alt="Plant preview" fill className="object-contain rounded-lg" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full h-8 w-8"
              onClick={handleRemoveImage}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12" />
            <p>No image selected</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" disabled={uploading}/>
        <Button type="button" onClick={handleUpload} disabled={!imageFile || uploading}>
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
      
      {uploading && <Progress value={progress} className="w-full" />}
    </div>
  );
}
