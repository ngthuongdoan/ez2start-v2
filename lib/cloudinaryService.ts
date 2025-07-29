import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  private baseUploadUrl: string;

  constructor() {
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.baseUploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
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

      const response = await axios.post<CloudinaryUploadResponse>(
        this.baseUploadUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
    try {
      const result = await cloudinary.uploader.destroy(publicId);
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
    return cloudinary.url(publicId, {
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
      const result = await cloudinary.api.resource(publicId);
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

      const result = await cloudinary.api.resources(options);
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
          result = await cloudinary.uploader.add_tag(tags.join(','), [publicId]);
          break;
        case 'remove':
          result = await cloudinary.uploader.remove_tag(tags.join(','), [publicId]);
          break;
        case 'replace':
        default:
          result = await cloudinary.uploader.replace_tag(tags.join(','), [publicId]);
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

      const result = await cloudinary.uploader.upload(url, uploadOptions);
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

    const signature = cloudinary.utils.api_sign_request(
      paramsWithTimestamp,
      process.env.CLOUDINARY_API_SECRET!
    );

    return { signature, timestamp };
  }
}

export const cloudinaryService = new CloudinaryService();
