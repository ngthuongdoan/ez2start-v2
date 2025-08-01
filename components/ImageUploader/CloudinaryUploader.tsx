'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadFileClient } from '@/lib/cloudinaryClient';
import { UploadPreset } from '@/lib/cloudinary';

interface CloudinaryUploaderProps {
  preset: UploadPreset;
  onUploadComplete?: (result: { url: string; id: string }) => void;
  onUploadError?: (error: Error) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  defaultImageUrl?: string;
  imageId?: string;
  className?: string;
  aspectRatio?: string; // e.g., '1:1', '16:9', '4:3'
}

export default function CloudinaryUploader({
  preset,
  onUploadComplete,
  onUploadError,
  maxSizeMB = 5,
  acceptedFileTypes = 'image/*',
  defaultImageUrl,
  imageId,
  className = '',
  aspectRatio = '1:1',
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(defaultImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the aspect ratio for styling
  const [width, height] = aspectRatio.split(':').map(Number);
  const paddingBottom = `${(height / width) * 100}%`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Generate a unique ID if none is provided
      const uniqueId = imageId || `${preset}_${Date.now()}`;
      const result = await uploadFileClient(file, uniqueId, preset);

      setImageUrl(result.url);

      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');

      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        style={{ paddingBottom }}
        className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div
          onClick={triggerFileSelect}
          className={`absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-200 ${isUploading ? 'pointer-events-none' : ''
            }`}
        >
          <div className="bg-white rounded-lg p-2 shadow-sm">
            {imageUrl ? 'Change Image' : 'Upload Image'}
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-6 w-6 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
