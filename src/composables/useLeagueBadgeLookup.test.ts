import { shallowRef } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLeagueBadgeLookup } from "@/composables/useLeagueBadgeLookup";

const mockUseQuery = vi.fn();

vi.mock("@tanstack/vue-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

describe("useLeagueBadgeLookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks selected league and exposes primary badge", () => {
    mockUseQuery.mockReturnValue({
      data: shallowRef([
        {
          season: "2024-2025",
          badgeUrl: "/badge.png",
        },
      ]),
    });

    const items = shallowRef([
      {
        idLeague: "1",
        strLeague: "Premier League",
        strSport: "Soccer",
        strLeagueAlternate: "EPL",
        imageSrc: "/main.jpg",
        alternateLabel: "EPL",
        alternateTags: ["EPL"],
        imageAlt: "Premier League",
      },
    ]);

    const viewModel = useLeagueBadgeLookup(() => items.value);

    expect(viewModel.selectedLeague.value).toBeNull();

    viewModel.selectLeague("1");
    expect(viewModel.selectedLeagueId.value).toBe("1");
    expect(viewModel.selectedLeague.value?.strLeague).toBe("Premier League");
    expect(viewModel.primaryBadge.value?.badgeUrl).toBe("/badge.png");

    viewModel.clearSelectedLeague();
    expect(viewModel.selectedLeagueId.value).toBeNull();
  });

  it("builds query options from selected league state", () => {
    mockUseQuery.mockReturnValue({ data: shallowRef([]) });
    const viewModel = useLeagueBadgeLookup(() => []);

    const [options] = mockUseQuery.mock.calls.at(-1) as [
      { queryKey: { value: unknown[] }; enabled: { value: boolean } },
    ];

    expect(options.queryKey.value).toEqual(["league-season-badges", null]);
    expect(options.enabled.value).toBe(false);

    viewModel.selectLeague("42");

    expect(options.queryKey.value).toEqual(["league-season-badges", "42"]);
    expect(options.enabled.value).toBe(true);
  });

  it("builds preview assets for badge and missing-badge seasons", () => {
    mockUseQuery.mockReturnValue({
      data: shallowRef([
        {
          season: "2024-2025",
          badgeUrl: "/badge.png",
        },
        {
          season: "2023-2024",
          badgeUrl: null,
        },
      ]),
    });

    const items = shallowRef([
      {
        idLeague: "1",
        strLeague: "Premier League",
        strSport: "Soccer",
        strLeagueAlternate: "EPL",
        imageSrc: "/main.jpg",
        alternateLabel: "EPL",
        alternateTags: ["EPL"],
        imageAlt: "Premier League",
      },
    ]);

    const viewModel = useLeagueBadgeLookup(() => items.value);

    expect(viewModel.badgePreviewAssets.value).toEqual([]);
    expect(viewModel.badgePreviewAsset.value).toBeNull();

    viewModel.selectLeague("missing-id");
    expect(viewModel.selectedLeague.value).toBeNull();
    expect(viewModel.badgePreviewAssets.value).toEqual([]);

    viewModel.selectLeague("1");

    expect(viewModel.badgePreviewAssets.value).toEqual([
      {
        imageSrc: "/badge.png",
        imageAlt: "Season badge for Premier League",
        strSeason: "2024-2025",
        caption: undefined,
      },
      {
        imageSrc: "",
        imageAlt: "No season badge available for Premier League",
        strSeason: "2023-2024",
        caption: "No season badge is available.",
      },
    ]);
    expect(viewModel.badgePreviewAsset.value?.imageSrc).toBe("/badge.png");
  });
});
