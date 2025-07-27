export const generateQueryParams = (options: Record<string, any>) => {
  const params = new URLSearchParams(options);
  return params.toString();
}