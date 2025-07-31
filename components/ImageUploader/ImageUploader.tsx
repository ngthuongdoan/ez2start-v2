import { ICON_SIZE } from "@/config/constant";
import { cloudinaryService } from "@/lib/cloudinaryService";
import { Button, FileButton, Image, Stack, StackProps, Text } from "@mantine/core";
import { useState } from "react";
import { IconCloudUpload } from "@tabler/icons-react";

type ImageUploaderProps = {
  imageUrl?: string;
  defaultImageUrl?: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  width?: number;
  height?: number;
  radius?: number | string;
  title?: string;
  description?: string;
  disabled?: boolean;
} & StackProps

const ImageUploader = ({
  imageUrl,
  defaultImageUrl = 'https://placehold.co/128x128',
  onUploadSuccess,
  onUploadError,
  folder = 'images',
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
      const result = await cloudinaryService.uploadImage(file, {
        folder
      });
      const url = result.secure_url;
      onUploadSuccess?.(url);
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