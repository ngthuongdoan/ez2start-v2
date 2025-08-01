import cloudinary from 'cloudinary';
import { UploadPreset } from './cloudinary';

// Only import stream types on server-side
type ReadableStream = import('stream').Readable;

// Only import stream functionality on server-side
if (typeof window === 'undefined') {
  import('stream').then(() => {
    // Stream module loaded
  });
}


let cloudinaryV2: typeof cloudinary.v2;

if (typeof window === 'undefined') {
  // Configure cloudinary (server-side only)
  cloudinaryV2 = cloudinary.v2;
  cloudinaryV2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

interface CloudinaryDeleteResponse {
  result: string;
}

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'lpad' | 'mpad' | 'mfit';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

class CloudinaryService {
  private uploadPreset: string;
  private cloudName: string;

  constructor() {
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  }

  /**
   * Upload image to Cloudinary (client-side using upload preset)
   */
  async uploadImage(
    file: File | Blob,
    options: {
      folder?: string;
      publicId?: string;
      tags?: string[];
      transformation?: CloudinaryTransformOptions;
    } = {}
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      if (options.folder) {
        formData.append('folder', "ez2start/" + options.folder);
      }

      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }

      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }

      if (options.transformation) {
        const transformString = Object.entries(options.transformation)
          .map(([key, value]) => `${key}_${value}`)
          .join(',');
        formData.append('transformation', transformString);
      }

      const response = await cloudinaryV2.uploader.upload(file.toString(), {
        upload_preset: this.uploadPreset,
        folder: options.folder,
        public_id: options.publicId,
        tags: options.tags,
        transformation: options.transformation,
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Delete image from Cloudinary (server-side only)
   */
  async deleteImage(publicId: string): Promise<CloudinaryDeleteResponse> {
    if (typeof window !== 'undefined') {
      throw new Error('deleteImage can only be called from server-side code');
    }

    try {
      const result = await cloudinaryV2.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(
    publicId: string,
    transformations: CloudinaryTransformOptions = {}
  ): string {
    if (typeof window !== 'undefined') {
      // Client-side: construct URL manually
      const transformationStr = Object.entries({
        ...transformations,
        f: 'auto',
        q: 'auto',
      })
        .map(([key, value]) => `${key}_${value}`)
        .join(',');

      return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformationStr}/${publicId}`;
    }

    // Server-side: use cloudinary SDK
    return cloudinaryV2.url(publicId, {
      ...transformations,
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  /**
   * Get image info/details (server-side only)
   */
  async getImageInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinaryV2.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary get image info error:', error);
      throw new Error('Failed to get image info from Cloudinary');
    }
  }

  /**
   * List images in a folder (server-side only)
   */
  async listImages(
    folder?: string,
    maxResults: number = 10
  ): Promise<any> {
    try {
      const options: any = {
        max_results: maxResults,
        resource_type: 'image',
      };

      if (folder) {
        options.prefix = folder;
      }

      const result = await cloudinaryV2.api.resources(options);
      return result;
    } catch (error) {
      console.error('Cloudinary list images error:', error);
      throw new Error('Failed to list images from Cloudinary');
    }
  }

  /**
   * Update image tags (server-side only)
   */
  async updateImageTags(
    publicId: string,
    tags: string[],
    command: 'add' | 'remove' | 'replace' = 'replace'
  ): Promise<any> {
    try {
      let result;

      switch (command) {
        case 'add':
          result = await cloudinaryV2.uploader.add_tag(tags.join(','), [publicId]);
          break;
        case 'remove':
          result = await cloudinaryV2.uploader.remove_tag(tags.join(','), [publicId]);
          break;
        case 'replace':
        default:
          result = await cloudinaryV2.uploader.replace_tag(tags.join(','), [publicId]);
          break;
      }

      return result;
    } catch (error) {
      console.error('Cloudinary update tags error:', error);
      throw new Error('Failed to update image tags in Cloudinary');
    }
  }

  /**
   * Upload image from URL (server-side only)
   */
  async uploadFromUrl(
    url: string,
    options: {
      folder?: string;
      publicId?: string;
      tags?: string[];
      transformation?: CloudinaryTransformOptions;
    } = {}
  ): Promise<CloudinaryUploadResponse> {
    try {
      const uploadOptions: any = {
        folder: options.folder,
        public_id: options.publicId,
        tags: options.tags,
        ...options.transformation,
      };

      const result = await cloudinaryV2.uploader.upload(url, uploadOptions);
      return result;
    } catch (error) {
      console.error('Cloudinary upload from URL error:', error);
      throw new Error('Failed to upload image from URL to Cloudinary');
    }
  }

  /**
   * Generate upload signature for secure client-side uploads
   */
  generateUploadSignature(params: Record<string, any>): { signature: string; timestamp: number } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsWithTimestamp = { ...params, timestamp };

    const signature = cloudinaryV2.utils.api_sign_request(
      paramsWithTimestamp,
      process.env.CLOUDINARY_API_SECRET!
    );

    return { signature, timestamp };
  }
}

/**
 * Upload a logo image (server-side only)
 */
export const uploadLogo = (name: string, stream: ReadableStream): Promise<string> => {
  if (typeof window !== 'undefined') {
    throw new Error('uploadLogo can only be called from server-side code');
  }

  return new Promise((resolve, reject) => {
    const outStream = cloudinaryV2.uploader.upload_stream(
      {
        public_id: name,
        folder: 'logos',
      },
      (err, callResult) => {
        if (err) {
          return reject(err);
        }

        const successResult = callResult as cloudinary.UploadApiResponse;

        return resolve(
          `https://res.cloudinary.com/daily-now/image/upload/t_logo,f_auto/v1/${successResult.public_id}`,
        );
      },
    );
    stream.pipe(outStream);
  });
};

interface OptionalProps {
  invalidate?: boolean;
}

interface UploadResult {
  url: string;
  id: string;
}

type UploadFn = (
  name: string,
  stream: ReadableStream,
  options?: OptionalProps,
) => Promise<UploadResult>;

/**
 * Upload a file using stream (server-side only)
 */
export const uploadFile = (
  name: string,
  preset: UploadPreset,
  stream: ReadableStream,
): Promise<UploadResult> => {
  if (typeof window !== 'undefined') {
    throw new Error('uploadFile can only be called from server-side code');
  }

  return new Promise((resolve, reject) => {
    const outStream = cloudinaryV2.uploader.upload_stream(
      {
        public_id: name,
        upload_preset: preset,
      },
      (err, callResult) => {
        if (err) {
          return reject(err);
        }

        const successResult = callResult as cloudinary.UploadApiResponse;

        return resolve({
          url: mapCloudinaryUrl(
            cloudinaryV2.url(successResult.public_id, {
              version: successResult.version,
              secure: true,
              fetch_format: 'auto',
              sign_url: true,
            }),
          ),
          id: successResult.public_id,
        });
      },
    );
    stream.pipe(outStream);
  });
};

export const uploadAvatar: UploadFn = (userId, stream) =>
  uploadFile(`${UploadPreset.Avatar}_${userId}`, UploadPreset.Avatar, stream);

interface ClearFileProps {
  referenceId: string;
  preset: UploadPreset;
}

export const clearFile = ({ referenceId, preset }: ClearFileProps) => {
  if (!process.env.CLOUDINARY_URL) {
    return;
  }

  const id = `${preset}_${referenceId}`;

  return cloudinaryV2.uploader.destroy(id);
};

export function mapCloudinaryUrl(url: string): string;
export function mapCloudinaryUrl(url: undefined): undefined;
export function mapCloudinaryUrl(url?: string | null): string | undefined;
export function mapCloudinaryUrl(url?: string | null): string | undefined {
  return url || ''
}

export const cloudinaryService = new CloudinaryService();
