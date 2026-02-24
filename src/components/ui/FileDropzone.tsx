'use client';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileDropzoneProps {
  accept?: string;
  onFile: (file: File) => void;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function FileDropzone({ accept = 'image/*', onFile, label = 'Drop your file here', sublabel = 'or click to browse', className = '' }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center ${
        dragging
          ? 'border-primary-400 bg-primary-50/50 scale-[1.02]'
          : 'border-white/40 backdrop-blur-lg bg-white/30 hover:bg-white/50 hover:border-primary-300'
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary-100' : 'bg-white/60'}`}>
          <svg className={`w-8 h-8 ${dragging ? 'text-primary-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className={`text-base font-medium ${dragging ? 'text-primary-700' : 'text-gray-700'}`}>{label}</p>
          <p className="text-sm text-gray-400 mt-1">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}
