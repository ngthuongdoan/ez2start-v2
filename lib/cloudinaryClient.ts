import { UploadPreset } from './cloudinary';

interface OptionalProps {
  invalidate?: boolean;
}

export interface UploadResult {
  url: string;
  id: string;
}

interface ClearFileProps {
  referenceId: string;
  preset: UploadPreset;
}

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'lpad' | 'mpad' | 'mfit';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

/**
 * Map Cloudinary URL to use the appropriate domain
 */
export function mapCloudinaryUrl(url: string): string;
export function mapCloudinaryUrl(url: undefined): undefined;
export function mapCloudinaryUrl(url?: string | null): string | undefined;
export function mapCloudinaryUrl(url?: string | null): string | undefined {
  return url || '';
}

/**
 * Upload an image to Cloudinary via the API endpoint
 */
export const uploadImageClient = async (
  file: File,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    transformation?: CloudinaryTransformOptions;
  } = {}
): Promise<{ url: string; id: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  if (options.folder) {
    formData.append('folder', options.folder);
  }

  if (options.publicId) {
    formData.append('publicId', options.publicId);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    id: result.public_id,
  };
};

/**
 * Upload a logo image from client-side
 */
export const uploadLogoClient = async (file: File, name: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicId', name);
  formData.append('folder', 'logos');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload logo');
  }

  const result = await response.json();
  return `https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/${result.public_id}`;
};

/**
 * Upload a file from client-side using the API
 */
export const uploadFileClient = async (
  file: File,
  name: string,
  preset: UploadPreset,
  folder: string = 'ez2start',
  options: OptionalProps = {}
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicId', name);
  formData.append('preset', preset);
  formData.append('folder', folder);


  if (options.invalidate) {
    formData.append('invalidate', 'true');
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload file');
  }

  const result = await response.json();
  console.log("🚀 --------------------------------------🚀")
  console.log("🚀 ~ uploadFileClient ~ result:", result)
  console.log("🚀 --------------------------------------🚀")
  return {
    url: result.secure_url,
    id: result.public_id,
  };
};

/**
 * Client-side version of uploadAvatar
 */
export const uploadAvatarClient = (userId: string, file: File, options?: OptionalProps) =>
  uploadFileClient(file, `${UploadPreset.Avatar}_${userId}`, UploadPreset.Avatar, 'ez2start/avatars', options);

/**
 * Client-side version to delete an image
 */
export const clearFileClient = async ({ referenceId, preset }: ClearFileProps) => {
  const id = `${preset}_${referenceId}`;

  const response = await fetch(`/api/upload?publicId=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete image');
  }

  return response.json();
};

/**
 * Get optimized image URL with transformations (client-side only)
 */
export const getOptimizedUrlClient = (
  publicId: string,
  transformations: CloudinaryTransformOptions = {},
  cloudName: string = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
): string => {
  const transformationStr = Object.entries({
    ...transformations,
    f: 'auto',
    q: 'auto',
  })
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}/${publicId}`;
};

// Default export for all client functions
export default {
  uploadImageClient,
  uploadLogoClient,
  uploadFileClient,
  uploadAvatarClient,
  clearFileClient,
  getOptimizedUrlClient,
  mapCloudinaryUrl,
};
