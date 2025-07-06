'use client';

import React, { useState } from 'react';
import {
  Card,
  Group,
  Text,
  TextInput,
  Button,
  Avatar,
  Stack,
  Switch,
  Select,
  Alert,
  LoadingOverlay,
  CardProps,
} from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useUserProfile } from '@/hooks/useUserProfile';

export function ProfileSettingsCard(prop: CardProps) {
  const { profile, loading, error, updateProfile, updatePreferences } = useUserProfile();
  const [formData, setFormData] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
      });
      setPreferences({
        theme: profile.preferences?.theme || 'light',
        language: profile.preferences?.language || 'en',
        notifications: profile.preferences?.notifications ?? true,
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      
      await updateProfile(formData);
      await updatePreferences(preferences);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card withBorder p="xl" radius="md">
        <LoadingOverlay visible={loading} />
        <Text>Loading profile...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  return (
    <Card withBorder p="xl" radius="md" {...prop}>
      <Stack>
        <Group>
          <Avatar
            src={profile?.photoURL}
            size={80}
            radius="md"
          >
            {profile?.displayName?.charAt(0).toUpperCase() || 
             profile?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text size="lg" fw={500}>
              {profile?.displayName || profile?.email}
            </Text>
            <Text size="sm" c="dimmed">
              {profile?.email}
            </Text>
            <Text size="xs" c="dimmed">
              Role: {profile?.role || 'User'}
            </Text>
          </div>
        </Group>

        <Stack gap="md">
          <TextInput
            label="Display Name"
            value={formData.displayName}
            onChange={(event) => setFormData({...formData, displayName: event.currentTarget.value})}
          />
          
          <Group grow>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChange={(event) => setFormData({...formData, firstName: event.currentTarget.value})}
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChange={(event) => setFormData({...formData, lastName: event.currentTarget.value})}
            />
          </Group>
          
          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(event) => setFormData({...formData, phoneNumber: event.currentTarget.value})}
          />
          
          <Text size="sm" fw={500} mt="md">Preferences</Text>
          
          <Select
            label="Theme"
            value={preferences.theme}
            onChange={(value) => setPreferences({...preferences, theme: value || 'light'})}
            data={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Auto' },
            ]}
          />
          
          <Select
            label="Language"
            value={preferences.language}
            onChange={(value) => setPreferences({...preferences, language: value || 'en'})}
            data={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
          />
          
          <Switch
            label="Email Notifications"
            checked={preferences.notifications}
            onChange={(event) => setPreferences({...preferences, notifications: event.currentTarget.checked})}
          />
        </Stack>

        {success && (
          <Alert icon={<IconCheck size={16} />} title="Success" color="green">
            Profile updated successfully!
          </Alert>
        )}

        <Button
          onClick={handleSaveProfile}
          loading={saving}
          disabled={saving}
          fullWidth
          mt="md"
        >
          Save Changes
        </Button>
      </Stack>
    </Card>
  );
}
