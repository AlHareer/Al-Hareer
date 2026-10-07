'use client';

import { useRef, useState } from 'react';
import { upload } from '@imagekit/next';
import { Video, X, Loader2, Link2 } from 'lucide-react';

export default function VideoUploader({
  value,
  onChange,
  folder = '/al-hareer/products/videos',
}: {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  folder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'upload' | 'url'>(value ? 'url' : 'upload');

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);
    setUploading(true);
    try {
      const authRes = await fetch('/api/imagekit/auth');
      if (!authRes.ok) throw new Error('Upload authorization failed');
      const auth = await authRes.json();

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

      if (result.url) {
        onChange(result.url);
        setTab('url');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const isVideoFile = (url: string) =>
    /\.(mp4|webm|mov|ogg|mkv)(\?|$)/i.test(url);

  const isYouTube = (url: string) =>
    /youtube\.com|youtu\.be/i.test(url);

  const isVimeo = (url: string) =>
    /vimeo\.com/i.test(url);

  const getYouTubeId = (url: string) => {
    const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return m ? m[1] : null;
  };

  const getVimeoId = (url: string) => {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : null;
  };

  const getEmbedSrc = (url: string) => {
    if (isYouTube(url)) {
      const id = getYouTubeId(url);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (isVimeo(url)) {
      const id = getVimeoId(url);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-cream-100 p-1 rounded-lg w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`px-3 py-1.5 rounded-md transition-all ${tab === 'upload' ? 'bg-white shadow-sm text-brand-700' : 'text-muted hover:text-brand-600'}`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`px-3 py-1.5 rounded-md transition-all ${tab === 'url' ? 'bg-white shadow-sm text-brand-700' : 'text-muted hover:text-brand-600'}`}
        >
          Paste URL
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-cream-400 text-muted transition-colors hover:border-brand-400 hover:text-brand-600 disabled:opacity-60 bg-cream-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">Uploading…</span>
              </>
            ) : (
              <>
                <Video className="h-6 w-6" />
                <span className="text-xs">Click to upload MP4 / WebM / MOV</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted shrink-0" />
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="https://… or YouTube / Vimeo link"
            className="flex-1 h-9 px-3 text-sm rounded-lg border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1.5 rounded-full text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-[#024F5F]">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="rounded-xl overflow-hidden border border-cream-300 bg-[#00303A] aspect-video w-full max-w-sm">
          {isVideoFile(value) ? (
            <video
              src={value}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
          ) : getEmbedSrc(value) ? (
            <iframe
              src={getEmbedSrc(value)!}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60 text-xs p-4 text-center">
              <Video className="h-8 w-8 opacity-40 mr-2" />
              Video URL saved. Preview not available for this format.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
