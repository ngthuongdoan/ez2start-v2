'use client';
import { Surface } from '@/components';
import {
  Box,
  Button,
  Grid,
  Group,
  noop,
  Paper,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { SurfaceProps } from '../Surface/Surface';
import { useEffect } from 'react';
import { useUserSettingMutation, useUserSettingQuery } from './UserSettingDetailForm.hook';
import { useForm } from '@mantine/form';
import { ImageUploader } from '../ImageUploader';
import { UploadPreset } from '@/lib/cloudinary';

type UserSettingDetailFormProps = {

} & Omit<SurfaceProps, "children">;

const UserSettingDetailForm = ({ ...rest }: UserSettingDetailFormProps) => {
  const { saveAccountInfo, saveErrorInfo, isSaving, isSuccess } = useUserSettingMutation();
  const { fetchUserData, user } = useUserSettingQuery();
  const accountInfoForm = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      avatar: ''
    },
  });
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      accountInfoForm.setValues(user);
    }
  }, [user]);

  const handleSaveAccountInfo = (values: typeof accountInfoForm.values) => {
    saveAccountInfo({ ...values });
  };
  return (
    <Surface component={Paper} {...rest} >
      <form onSubmit={accountInfoForm.onSubmit(handleSaveAccountInfo)}>
        <Stack>
          <Text size="lg" fw={600}>
            Account information
          </Text>
          <Grid>
            <Grid.Col span={10}>
              <Stack>

                <Group grow>
                  <TextInput
                    label="User Name"
                    placeholder="user name"
                    {...accountInfoForm.getInputProps('username')}
                    disabled={isSaving}
                  />
                  <TextInput
                    label="First name"
                    placeholder="first name"
                    {...accountInfoForm.getInputProps('firstName')}
                    disabled={isSaving}
                  />
                  <TextInput
                    label="Last name"
                    placeholder="last name"
                    {...accountInfoForm.getInputProps('lastName')}
                    disabled={isSaving}
                  />
                </Group>
                <Group grow>

                  <TextInput
                    label="Email"
                    placeholder="email"
                    {...accountInfoForm.getInputProps('email')}
                    disabled={isSaving}
                  />
                  <TextInput
                    label="Address"
                    placeholder="address"
                    {...accountInfoForm.getInputProps('address')}
                    disabled={isSaving}
                  />
                </Group>
                <TextInput
                  label="Apartment/Studio/Floor"
                  placeholder="apartment, studio, or floor"
                  {...accountInfoForm.getInputProps('apartment')}
                  disabled={isSaving}
                />
                <Group grow>
                  <TextInput
                    label="City"
                    placeholder="city"
                    {...accountInfoForm.getInputProps('city')}
                    disabled={isSaving}
                  />
                  <TextInput
                    label="State"
                    placeholder="state"
                    {...accountInfoForm.getInputProps('state')}
                    disabled={isSaving}
                  />
                  <TextInput
                    label="Zip"
                    placeholder="zip"
                    {...accountInfoForm.getInputProps('zip')}
                    disabled={isSaving}
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
              <ImageUploader
                preset={UploadPreset.Avatar}
                aspectRatio="1:1"
                className="w-48 h-48"
                onUploadSuccess={(result) => {
                  accountInfoForm.setFieldValue('avatar', result.url);
                }}
                imageUrl={accountInfoForm.values.avatar}
              />
            </Grid.Col>
          </Grid>


          <Box style={{ width: 'auto' }}>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              disabled={isSaving}
              color={isSuccess ? 'green' : undefined}
              type="submit"
            >
              {isSaving ? 'Saving...' : isSuccess ? 'Saved!' : 'Save changes'}
            </Button>
            {saveErrorInfo && (
              <Text c="red" size="xs">{saveErrorInfo}</Text>
            )}
          </Box>
        </Stack>
      </form>
    </Surface>
  );
};

export { UserSettingDetailForm };
