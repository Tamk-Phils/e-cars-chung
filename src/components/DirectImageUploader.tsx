import React, { useRef, useState } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, Plus, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface DirectImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const DirectImageUploader: React.FC<DirectImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 25,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compress image on client canvas to keep localStorage and network ultra-fast (~100-200KB per photo)
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Export as crisp webp or jpeg
            const compressed = canvas.toDataURL('image/jpeg', 0.86);
            resolve(compressed);
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setProcessing(true);

    try {
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setErrorMessage(`Maximum of ${maxImages} images allowed per vehicle.`);
        setProcessing(false);
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const newImageUrls: string[] = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const processed = await processImageFile(file);
        newImageUrls.push(processed);
      }

      if (newImageUrls.length > 0) {
        onChange([...images, ...newImageUrls]);
      }
    } catch (err) {
      console.error('Error processing images:', err);
      setErrorMessage('Failed to read one or more images. Please try again.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setErrorMessage(`Maximum of ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setErrorMessage(null);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([target, ...remaining]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div style={{ marginTop: '4px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={16} style={{ color: 'var(--accent-purple)' }} />
          Direct Vehicle Photos ({images.length}/{maxImages})
        </label>
        <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
          First image will be the primary listing cover
        </span>
      </div>

      {errorMessage && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', marginBottom: '8px' }}>
          {errorMessage}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed var(--accent-purple)' : '2px dashed #cbd5e1',
          background: isDragging ? 'var(--accent-purple-light)' : '#f8fafc',
          borderRadius: 'var(--radius-md)',
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '10px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload size={28} style={{ color: isDragging ? 'var(--accent-purple)' : '#94a3b8', margin: '0 auto 6px' }} />
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
          {processing ? 'Processing & Optimizing Images...' : 'Click to Upload Direct Photos or Drag & Drop'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
          PNG, JPG, WEBP, or AVIF from your computer or phone • Auto-compressed for instant loading
        </div>
      </div>

      {/* Or add via URL */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <LinkIcon size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
          <input
            type="url"
            className="input"
            placeholder="Or paste an image web URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ paddingLeft: '30px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="btn btn-secondary"
          style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          <Plus size={14} /> Add URL
        </button>
      </div>

      {/* Thumbnails Gallery */}
      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {images.map((imgUrl, index) => {
            const isCover = index === 0;
            return (
              <div
                key={`${imgUrl.slice(0, 30)}-${index}`}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: isCover ? '2px solid var(--accent-purple)' : '1px solid #cbd5e1',
                  background: '#f1f5f9',
                  boxShadow: isCover ? '0 2px 6px rgba(116, 39, 199, 0.25)' : 'none',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Upload ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Primary Cover Badge */}
                {isCover ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      background: 'var(--accent-purple)',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Star size={9} fill="#fff" /> COVER
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMakeCover(index)}
                    title="Set as Cover Photo"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      fontSize: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <Star size={8} /> Make Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="Remove Image"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(239, 68, 68, 0.85)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} />
                </button>

                {/* Reorder Arrows */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    display: 'flex',
                    gap: '2px',
                  }}
                >
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'left')}
                      title="Move Left"
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowLeft size={10} />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'right')}
                      title="Move Right"
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

