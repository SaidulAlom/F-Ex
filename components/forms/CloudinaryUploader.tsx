'use client';

import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button-styles';
import type { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SignResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

interface UploadResponse {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
}

async function optimizeImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== 'function' || file.type === 'image/svg+xml') return file;
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.82),
  );
  if (!blob) return file;
  const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], name, { type: 'image/webp' });
}

export function CloudinaryUploader({
  context,
  onUploaded,
  maxFiles = 1,
  label = 'Upload images',
  compact = false,
  className,
}: {
  context: 'product' | 'repair';
  onUploaded: (images: ProductImage[]) => void;
  maxFiles?: number;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const files = Array.from(fileList).slice(0, maxFiles);
    setError('');
    setStatus('');
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Use JPG, PNG or WebP images only.');
        return;
      }
      if (file.size > 6 * 1024 * 1024) {
        setError('Each image must be under 6 MB.');
        return;
      }
    }

    setUploading(true);
    try {
      const uploaded: ProductImage[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setStatus(`Uploading ${index + 1} of ${files.length}…`);
        const optimized = await optimizeImage(file);
        // Each direct upload gets its own short-lived signed timestamp.
        const signResponse = await fetch('/api/uploads/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context }),
        });
        const signatureResponse = (await signResponse.json()) as SignResponse & {
          message?: string;
        };
        if (!signResponse.ok || !signatureResponse.signature) {
          throw new Error(signatureResponse.message || 'Image upload is not configured yet.');
        }
        const body = new FormData();
        body.append('file', optimized);
        body.append('api_key', signatureResponse.apiKey);
        body.append('timestamp', String(signatureResponse.timestamp));
        body.append('signature', signatureResponse.signature);
        body.append('folder', signatureResponse.folder);
        const upload = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureResponse.cloudName}/image/upload`,
          { method: 'POST', body },
        );
        const data = (await upload.json()) as UploadResponse;
        if (!upload.ok || !data.secure_url) {
          throw new Error(data.error?.message || 'Cloudinary rejected the upload.');
        }
        uploaded.push({
          url: data.secure_url,
          publicId: data.public_id,
          alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').slice(0, 160),
        });
      }
      onUploaded(uploaded);
      setStatus(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
      setStatus('');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('rounded-xl border border-dashed border-line bg-cloud/60 p-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor={id} className="text-sm font-bold text-navy">{label}</label>
          <p className="mt-0.5 text-xs text-ink">
            JPG, PNG or WebP · up to 6 MB each · {maxFiles === 1 ? '1 image' : `up to ${maxFiles} images`}.
          </p>
        </div>
        <label
          htmlFor={id}
          className={buttonStyles({ variant: 'outline', size: 'sm', className: 'cursor-pointer' })}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
          {uploading ? 'Uploading…' : 'Choose files'}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={maxFiles > 1}
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
          disabled={uploading}
        />
      </div>
      {!compact ? (
        <p className="mt-3 text-xs text-ink">
          Images are resized in the browser and sent directly to Cloudinary using a short-lived server signature.
        </p>
      ) : null}
      {status ? <p className="mt-2 text-xs font-semibold text-emerald-700" aria-live="polite">{status}</p> : null}
      {error ? (
        <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-red-700" role="alert">
          <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
