type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiClient<TResponse>(endpoint: string, options: ApiOptions = {}): Promise<TResponse> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(endpoint, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
