// Re-export server methods
export enum UploadPreset {
  Avatar = 'avatar',
  Logo = 'logo',
}

// Export both as named objects
import * as cloudinaryClient from './cloudinaryClient';

export { cloudinaryClient };
