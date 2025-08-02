import { ICON_SIZE } from "@/config/constant";
import { cloudinaryService } from "@/lib/cloudinaryService";
import { Button, FileButton, Image, Stack, StackProps, Text } from "@mantine/core";
import { useState } from "react";
import { IconCloudUpload } from "@tabler/icons-react";
import { UploadPreset } from "@/lib/cloudinary";
import { uploadFileClient, UploadResult } from "@/lib/cloudinaryClient";

type ImageUploaderProps = {
  imageUrl?: string;
  defaultImageUrl?: string;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  width?: number;
  height?: number;
  radius?: number | string;
  title?: string;
  description?: string;
  disabled?: boolean;
  preset: UploadPreset;
  onUploadComplete?: (result: UploadResult) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  imageId?: string;
  className?: string;
  aspectRatio?: string; // e.g., '1:1', '16:9', '4:3'
} & StackProps

const ImageUploader = ({
  preset,
  maxSizeMB = 5,
  acceptedFileTypes = 'image/*',
  imageId,
  className = '',
  aspectRatio = '1:1',
  imageUrl,
  defaultImageUrl = 'https://placehold.co/128x128',
  onUploadSuccess,
  onUploadError,
  folder = 'ez2start/avatars',
  width = 128,
  height = 128,
  radius = '0',
  title = 'Upload image',
  description = 'For best results, use an image at least 128px by 128px in .jpg format',
  disabled = false,
  ...rest
}: ImageUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const uniqueId = imageId || `${preset}_${Date.now()}`;

      const result = await uploadFileClient(file, uniqueId, preset, folder);
      console.log("🚀 ----------------------------------🚀")
      console.log("🚀 ~ handleUpload ~ result:", result)
      console.log("🚀 ----------------------------------🚀")
      onUploadSuccess?.(result);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Stack align="center" {...rest}>
      <Image
        src={imageUrl || defaultImageUrl}
        h={height}
        w={width}
        radius={radius}
      />
      <FileButton
        onChange={(file) => {
          if (file) handleUpload(file);
        }}
        accept="image/png,image/jpeg"
        disabled={disabled || isLoading}
      >
        {(props) => (
          <Button
            {...props}
            variant="subtle"
            leftSection={<IconCloudUpload size={ICON_SIZE} />}
            loading={isLoading}
          >
            {isLoading ? 'Uploading...' : title}
          </Button>
        )}
      </FileButton>
      <Text ta="center" size="xs" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
};

export { ImageUploader };