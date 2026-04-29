import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLeaguesQuery } from "@/composables/useLeaguesQuery";

const mockUseQuery = vi.fn();
const mockFetchAllLeagues = vi.fn();

vi.mock("@tanstack/vue-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

vi.mock("@/api/sportsDb", () => ({
  fetchAllLeagues: (signal?: AbortSignal) => mockFetchAllLeagues(signal),
}));

describe("useLeaguesQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wires query key, stale time and query function", async () => {
    mockUseQuery.mockReturnValue({ data: null });
    mockFetchAllLeagues.mockResolvedValue([]);

    useLeaguesQuery();

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const [options] = mockUseQuery.mock.calls[0] as [
      {
        queryKey: string[];
        staleTime: number;
        queryFn: (ctx: { signal?: AbortSignal }) => unknown;
      },
    ];

    expect(options.queryKey).toEqual(["all-leagues"]);
    expect(options.staleTime).toBe(1000 * 60 * 5);
    expect(typeof options.queryFn).toBe("function");

    const controller = new AbortController();
    await options.queryFn({ signal: controller.signal });
    expect(mockFetchAllLeagues).toHaveBeenCalledWith(controller.signal);
  });
});
