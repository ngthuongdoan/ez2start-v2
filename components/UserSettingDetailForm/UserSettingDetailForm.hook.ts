import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useUserSettingMutation = () => {
  const [saveErrorInfo, setSaveErrorInfo] = useState('');

  const saveAccountInfoMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save account info');
      return res.json();
    },
    onSuccess: () => {
      setSaveErrorInfo('');
      setTimeout(() => {
        saveAccountInfoMutation.reset();
      }, 2000);
      // Optionally refetch user data here
      // queryClient.invalidateQueries(['user']);
    },
    onError: (error: any) => {
      setSaveErrorInfo(error.message || 'Failed to save');
    },
  });

  return {
    saveAccountInfo: saveAccountInfoMutation.mutate,
    saveErrorInfo,
    isSaving: saveAccountInfoMutation.isPending,
    isSuccess: saveAccountInfoMutation.isSuccess,
  }
}

export const useUserSettingQuery = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      setUser(data);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    fetchUserData,
  };
}