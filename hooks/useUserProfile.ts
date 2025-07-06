'use client';

import { useState, useEffect } from 'react';
import { useServerAuth } from './useServerAuth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export function useUserProfile() {
  const { isAuthenticated, user } = useServerAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData: Partial<UserProfile>) => {
    try {
      setError(null);

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const updatePreferences = async (preferences: UserProfile['preferences']) => {
    try {
      setError(null);

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      } : null);

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      console.error('Error updating preferences:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchUserProfile,
    updateProfile,
    updatePreferences,
  };
}
