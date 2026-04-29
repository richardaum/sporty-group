import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/api/apiClient";

describe("apiClient", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("performs a GET request and parses JSON", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    }) as typeof fetch;

    const responsePromise = apiClient.get<{ ok: boolean }>("https://example.com/resource");
    await vi.runAllTimersAsync();

    await expect(responsePromise).resolves.toEqual({ ok: true });
    expect(globalThis.fetch).toHaveBeenCalledWith("https://example.com/resource", {
      signal: undefined,
    });
  });

  it("does not delay when delayMs is not provided", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    }) as typeof fetch;

    await apiClient.get<{ ok: boolean }>("https://example.com/resource");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("allows overriding delay per request", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    }) as typeof fetch;

    const responsePromise = apiClient.get("https://example.com/resource", { delayMs: 125 });

    await vi.advanceTimersByTimeAsync(124);
    expect(globalThis.fetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await responsePromise;

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns JSON as-is without HTTP status checks", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockResolvedValue({ message: "still returned" }),
    }) as typeof fetch;

    const requestPromise = apiClient.get<{ message: string }>("https://example.com/resource");
    await vi.runAllTimersAsync();
    await expect(requestPromise).resolves.toEqual({ message: "still returned" });
  });
});
