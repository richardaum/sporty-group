import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAllLeagues, fetchLeagueSeasonBadges } from "@/api/sportsDb";

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

  it("returns an empty array when response payload has no leagues", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({}),
    }) as typeof fetch;

    await expect(fetchAllLeagues()).resolves.toEqual([]);
  });

  it("returns an empty array when leagues is absent", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    }) as typeof fetch;

    await expect(fetchAllLeagues()).resolves.toEqual([]);
  });
});

describe("fetchLeagueSeasonBadges", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns all seasons and preserves missing badge URLs", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        seasons: [
          { strSeason: "2024-2025", strBadge: "https://img.example.com/badge-a.png" },
          { strSeason: "2023-2024", strBadge: null },
        ],
      }),
    }) as typeof fetch;

    await expect(fetchLeagueSeasonBadges("4328")).resolves.toEqual([
      {
        season: "2024-2025",
        badgeUrl: "https://img.example.com/badge-a.png",
      },
      {
        season: "2023-2024",
        badgeUrl: null,
      },
    ]);
  });

  it("returns an empty array when response payload has no seasons", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockResolvedValue({}),
    }) as typeof fetch;

    await expect(fetchLeagueSeasonBadges("4328")).resolves.toEqual([]);
  });
});
