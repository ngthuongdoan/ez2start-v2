import { LoginBody } from "@/@types/auth";
import { PATH_DASHBOARD } from "@/routes";
import { createMutation } from "@/utils/create-mutation";
import { notifications } from "@mantine/notifications";
import { UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useLoginMutation(options?: UseMutationOptions<unknown, unknown, LoginBody>) {
  return createMutation<LoginBody>(
    async (values) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      return res.json();
    },
    options
  );
}
export const useSignin = () => {
  const router = useRouter();

  const { mutateAsync: login, isPending, isSuccess } = useLoginMutation();

  const handleSubmit = async (values: LoginBody) => {
    try {
      await login(values);
    } catch (error: any) {
      notifications.show({ message: error.message, color: 'red' });
    }
  };

  useEffect(() => {
    if (isSuccess && !isPending) {
      notifications.show({ message: 'Login successful', color: 'green' });
      router.push(PATH_DASHBOARD.default);
    }
  }, [isSuccess, isPending]);

  return { handleSubmit, isPending };
}