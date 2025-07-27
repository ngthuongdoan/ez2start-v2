import { ICON_SIZE } from "@/config/constant";
import { cloudinaryService } from "@/lib/cloudinaryService";
import { Button, FileButton, Image, Stack, StackProps, Text } from "@mantine/core";
import { useUserSettingQuery } from "./UserSettingDetailForm.hook";
import { useState } from "react";
import { IconCloudUpload } from "@tabler/icons-react";

type ImageUploaderProps = {
  photoUrl?: string;
} & StackProps

const ImageUploader = ({ photoUrl, ...rest }: ImageUploaderProps) => {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { fetchUserData, user, loading } = useUserSettingQuery();
  const uploadAvatar = async (file: File) => {
    setAvatarLoading(true);
    try {
      const result = await cloudinaryService.uploadImage(file, {
        folder: 'avatars'
      });
      const url = result.secure_url;
      // Update user info with new photoUrl
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!res.ok) throw new Error('Failed to update user photo');
      fetchUserData()
    } catch (e) {
      // Optionally handle error
    } finally {
      setAvatarLoading(false);
    }
  };
  return (
    <Stack align="center" {...rest}>
      <Image
        src={user.photoUrl || 'https://res.cloudinary.com/ddh7hfzso/image/upload/v1700303804/me/ovqjhhs79u3g2fwbl2dd.jpg'}
        h={128}
        w={128}
        radius="50%"
      />
      <FileButton
        onChange={(f) => {
          if (f) uploadAvatar(f);
        }}
        accept="image/png,image/jpeg"
        disabled={loading || avatarLoading}
      >
        {(props) => (
          <Button
            {...props}
            variant="subtle"
            leftSection={<IconCloudUpload size={ICON_SIZE} />}
            loading={avatarLoading}
          >
            {avatarLoading ? 'Uploading...' : 'Upload image'}
          </Button>
        )}
      </FileButton>
      <Text ta="center" size="xs" c="dimmed">
        For best results, use an image at least 128px by 128px
        in .jpg format
      </Text>
    </Stack>
  );
};

export { ImageUploader };