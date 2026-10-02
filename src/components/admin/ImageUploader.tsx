'use client';

import { useRef, useState } from 'react';
import { upload } from '@imagekit/next';
import Image from 'next/image';
import { ImagePlus, Star, X, Loader2 } from 'lucide-react';

type Value = string | string[] | null | undefined;

/**
 * `value` is either a single URL string (multiple=false) or an array of URL
 * strings (multiple=true). `onChange` receives the same shape back.
 *
 * When `multiple` and `showCoverPicker` are both set, the first image in the
 * array is treated as the "cover" — each other thumbnail gets a star button
 * that promotes it to index 0.
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = '/al-hareer/uploads',
  previewClassName = 'h-24 w-24',
  showCoverPicker = false,
  objectFit = 'cover',
}: {
  value: Value;
  onChange: (value: Value) => void;
  multiple?: boolean;
  folder?: string;
  previewClassName?: string;
  showCoverPicker?: boolean;
  objectFit?: 'cover' | 'contain';
}) {
  const urls = multiple ? ((value as string[]) || []) : value ? [value as string] : [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const authRes = await fetch('/api/imagekit/auth');
      if (!authRes.ok) throw new Error('Not authorized to upload');
      const auth = await authRes.json();

      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const result = await upload({
          file,
          fileName: file.name,
          folder,
          token: auth.token,
          expire: auth.expire,
          signature: auth.signature,
          publicKey: auth.publicKey,
          useUniqueFileName: true,
        });
        if (result.url) uploaded.push(result.url);
      }

      if (multiple) {
        onChange([...(value as string[] | undefined) ?? [], ...uploaded]);
      } else if (uploaded[0]) {
        onChange(uploaded[0]);
      }
    } catch (err) {
      console.error('Image upload failed', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (idx: number) => {
    if (multiple) onChange(((value as string[]) || []).filter((_, i) => i !== idx));
    else onChange(null);
  };

  const setCover = (idx: number) => {
    if (idx === 0) return;
    const rest = urls.filter((_, i) => i !== idx);
    onChange([urls[idx], ...rest]);
  };

  const showCover = multiple && showCoverPicker && urls.length > 1;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, idx) => (
          <div
            key={url}
            className={`relative overflow-hidden rounded-xl border ${idx === 0 && showCover ? 'border-gold' : 'border-cream-300'} ${previewClassName}`}
          >
            <Image src={url} alt="" fill sizes="(max-width: 640px) 100vw, 448px" className={objectFit === 'contain' ? 'object-contain' : 'object-cover'} unoptimized />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3 w-3" />
            </button>
            {showCover && (
              <button
                type="button"
                onClick={() => setCover(idx)}
                disabled={idx === 0}
                title={idx === 0 ? 'Cover image' : 'Set as cover image'}
                className={`absolute bottom-1 left-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                  idx === 0 ? 'bg-gold text-brand-900' : 'bg-black/60 text-white/80 hover:text-gold'
                }`}
              >
                <Star className={`h-2.5 w-2.5 ${idx === 0 ? 'fill-brand-900' : ''}`} />
                {idx === 0 ? 'Cover' : 'Set'}
              </button>
            )}
          </div>
        ))}

        {(multiple || urls.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-cream-400 text-muted transition-colors hover:border-brand-400 hover:text-brand-600 disabled:opacity-60 ${previewClassName}`}
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-xs">{uploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
