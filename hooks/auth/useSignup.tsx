import { SignupBody } from "@/types/auth";
import { PATH_AUTH } from "@/routes";
import { createMutation } from "@/utils/create-mutation";
import { UseMutationOptions } from '@tanstack/react-query';
import { notifications } from "@/utils/notifications";
import { useRouter } from "next/navigation";

export function useSignupMutation(options?: UseMutationOptions<unknown, unknown, SignupBody>) {
  return createMutation<SignupBody>(
    async (values) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }
      return res.json();
    },
    options
  );
}
export const useSignup = () => {
  const router = useRouter();

  const { mutateAsync: signup, isPending } = useSignupMutation();

  const handleSubmit = async (values: SignupBody) => {
    try {
      await signup(values);
      notifications.show({
        title: 'Account created',
        message: 'You can now sign in with your new account',
        type: 'success',
      }); router.push(PATH_AUTH.signin);
    } catch (error: any) {
      notifications.show({ message: error.message, type: 'error' });
    }
  };

  return { handleSubmit, isPending };
}