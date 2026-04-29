interface ApiClientGetOptions {
  signal?: AbortSignal;
  delayMs?: number;
}

export interface ApiClient {
  get<TResponse>(url: string | URL, options?: ApiClientGetOptions): Promise<TResponse>;
}

const wait = (ms: number): Promise<void> =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

export const apiClient: ApiClient = {
  async get<TResponse>(url: string | URL, options: ApiClientGetOptions = {}): Promise<TResponse> {
    await wait(options.delayMs ?? 0);
    const response = await fetch(url, { signal: options.signal });
    return (await response.json()) as TResponse;
  },
};
