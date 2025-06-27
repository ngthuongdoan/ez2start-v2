import { MutationFunction, UseMutationOptions, useMutation } from '@tanstack/react-query';

export function createMutation<TBody = void, TResult = unknown>(
  mutationFn: MutationFunction<TResult, TBody>,
  options?: UseMutationOptions<TResult, unknown, TBody>
) {
  return useMutation<TResult, unknown, TBody>({
    mutationFn,
    ...options,
  });
}
