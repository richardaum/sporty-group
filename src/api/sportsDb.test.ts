import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAllLeagues } from "@/api/sportsDb";

describe("fetchAllLeagues", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("maps leagues to required assignment fields", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        leagues: [
          {
            idLeague: "4328",
            strLeague: "English Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
          },
        ],
      }),
    }) as typeof fetch;

    const leagues = await fetchAllLeagues();

    expect(leagues).toHaveLength(1);
    expect(leagues[0]).toEqual({
      idLeague: "4328",
      strLeague: "English Premier League",
      strSport: "Soccer",
      strLeagueAlternate: "EPL",
    });
  });

  it("fills missing nullable fields with deterministic fallbacks without crashing", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        leagues: [
          {
            idLeague: "1",
            strLeague: null,
            strSport: null,
            strLeagueAlternate: null,
          },
        ],
      }),
    }) as typeof fetch;

    const leagues = await fetchAllLeagues();

    expect(leagues).toHaveLength(1);
    expect(leagues[0]).toMatchObject({
      idLeague: "1",
      strLeague: "Unknown league",
      strSport: "Unknown sport",
      strLeagueAlternate: "N/A",
    });
  });

  it("throws when the HTTP status is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn(),
    }) as typeof fetch;

    await expect(fetchAllLeagues()).rejects.toThrow(/Unable to load leagues \(status 500\)/);
  });

  it("returns an empty array when leagues is absent", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    }) as typeof fetch;

    await expect(fetchAllLeagues()).resolves.toEqual([]);
  });
});
