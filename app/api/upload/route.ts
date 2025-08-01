import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import cloudinary from 'cloudinary';

// Configure Cloudinary
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Convert buffer to readable stream
 */
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => { }; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Handle file upload requests
 */
export async function POST(req: NextRequest) {
  try {
    // Get form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || undefined;
    const publicId = formData.get('publicId') as string || undefined;
    const preset = undefined;
    const tags = formData.get('tags') as string || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // Convert buffer to stream
    const stream = bufferToStream(buffer);

    let result;

    if (preset) {
      // Use preset-based upload
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          {
            public_id: publicId,
            folder: folder,
            upload_preset: preset,
            tags: tags ? tags.split(',') : undefined
          },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            resolve(uploadResult);
          }
        );

        stream.pipe(uploadStream);
      });
    } else {
      // Use default upload with signed options
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          {
            public_id: publicId,
            folder: folder,
            tags: tags ? tags.split(',') : undefined
          },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            resolve(uploadResult);
          }
        );

        stream.pipe(uploadStream);
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

/**
 * Handle image deletion
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }

    const result = await cloudinaryV2.uploader.destroy(publicId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
