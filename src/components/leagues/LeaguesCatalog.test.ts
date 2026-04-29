import { fireEvent, render, within } from "@testing-library/vue";
import { shallowRef } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LeaguesCatalog from "@/components/leagues/LeaguesCatalog.vue";
import type * as UseLeaguesCatalogDataViewModelModule from "@/composables/useLeaguesCatalogDataViewModel";

const mockUseLeaguesCatalogDataViewModel = vi.fn();
const mockUseLeagueBadgeLookup = vi.fn();

vi.mock("@/composables/useLeaguesCatalogDataViewModel", async () => {
  const actual = await vi.importActual<typeof UseLeaguesCatalogDataViewModelModule>(
    "@/composables/useLeaguesCatalogDataViewModel",
  );

  return {
    ...actual,
    useLeaguesCatalogDataViewModel: () => mockUseLeaguesCatalogDataViewModel(),
  };
});

vi.mock("@/composables/useLeagueBadgeLookup", () => ({
  useLeagueBadgeLookup: (items: unknown) => mockUseLeagueBadgeLookup(items),
}));

describe("LeaguesCatalog", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );

    mockUseLeagueBadgeLookup.mockReturnValue({
      selectedLeagueId: shallowRef(null),
      selectedLeague: shallowRef(null),
      badgesQuery: {
        isLoading: shallowRef(false),
        isError: shallowRef(false),
      },
      primaryBadge: shallowRef(null),
      badgePreviewAssets: shallowRef([]),
      badgePreviewAsset: shallowRef(null),
      selectLeague: vi.fn(),
      clearSelectedLeague: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("league list fields", () => {
    it("shows strLeague, strSport and strLeagueAlternate on sport-group rail cards", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "1",
          strLeague: "Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
          imageSrc: "/hero.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League 1",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            alternateTags: ["EPL"],
            imageSrc: "/main.jpg",
          },
          {
            idLeague: "11",
            strLeague: "Premier League 2",
            strSport: "Soccer",
            strLeagueAlternate: "EPL 2",
            alternateTags: ["EPL 2"],
            imageSrc: "/main-2.jpg",
          },
          {
            idLeague: "12",
            strLeague: "Serie A",
            strSport: "Soccer",
            strLeagueAlternate: "ITA",
            alternateTags: ["ITA"],
            imageSrc: "/main-3.jpg",
          },
          {
            idLeague: "13",
            strLeague: "Bundesliga",
            strSport: "Soccer",
            strLeagueAlternate: "GER",
            imageSrc: "/main-4.jpg",
          },
          {
            idLeague: "2",
            strLeague: "La Liga",
            strSport: "Soccer",
            strLeagueAlternate: "Primera Division",
            alternateTags: ["Primera Division"],
            imageSrc: "/sport.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      const sportRail = within(document.body).getByLabelText("Soccer horizontal rail");
      expect(within(sportRail).getByText("La Liga")).toBeTruthy();
      expect(within(sportRail).getAllByText("Soccer").length).toBeGreaterThan(0);
      expect(within(sportRail).getByText("Primera Division")).toBeTruthy();
    });

    it("shows hero title and alternate text derived from league fields", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "9",
          strLeague: "Hero League Title",
          strSport: "Ice Hockey",
          strLeagueAlternate: "HLT Alt",
          imageSrc: "/hero.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "9",
            strLeague: "Hero League Title",
            strSport: "Ice Hockey",
            strLeagueAlternate: "HLT Alt",
            imageSrc: "/rail.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "9",
            strLeague: "Hero League Title",
            strSport: "Ice Hockey",
            strLeagueAlternate: "HLT Alt",
            imageSrc: "/rail.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(
        within(document.body).getByRole("heading", {
          level: 1,
          name: "Hero League Title",
        }),
      ).toBeTruthy();
      expect(within(document.body).getByText(/Alternate title:\s+HLT Alt/)).toBeTruthy();
      expect(
        within(document.body).getByText(/Ice Hockey league catalog from TheSportsDB/),
      ).toBeTruthy();
    });

    it("shows strLeague, strSport and strLeagueAlternate on the main leagues rail cards", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "10",
            strLeague: "Main Rail League",
            strSport: "Tennis",
            strLeagueAlternate: "Alternate MRL",
            alternateTags: ["Alternate MRL"],
            imageSrc: "/m.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "10",
            strLeague: "Main Rail League",
            strSport: "Tennis",
            strLeagueAlternate: "Alternate MRL",
            imageSrc: "/m.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      const mainRailScroller = within(document.body)
        .getAllByLabelText("Scrollable leagues list")
        .find((scrollRegion) => Boolean(within(scrollRegion).queryByText("Main Rail League")));
      expect(mainRailScroller).toBeTruthy();
      expect(within(mainRailScroller!).getByText("Tennis")).toBeTruthy();
      expect(within(mainRailScroller!).getByText("Alternate MRL")).toBeTruthy();
    });

    it("renders the sport filter dropdown in the header", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([{ value: "all", label: "All sports" }]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(within(document.body).getByRole("combobox")).toBeTruthy();
    });

    it("shows a loading skeleton when leagues are fetching", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(true),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(within(document.body).getByLabelText("Loading leagues")).toBeTruthy();
      expect(within(document.body).getByText("Loading catalog")).toBeTruthy();
    });

    it("shows retry when the leagues query fails and no cached list is rendered", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(true),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(within(document.body).getByText("We could not load leagues right now.")).toBeTruthy();
      expect(within(document.body).getByRole("button", { name: "Try again" })).toBeTruthy();
    });

    it("shows empty catalog copy when leagues loaded successfully but the list is empty", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(
        within(document.body).getAllByText("No leagues were returned by the API.").length,
      ).toBeGreaterThan(0);
    });

    it("shows stale-error banner above catalog when refresh fails but cached leagues exist", () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(true),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "1",
          strLeague: "Cached League",
          strSport: "Soccer",
          strLeagueAlternate: "CACHE",
          imageSrc: "/cached.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Cached League",
            strSport: "Soccer",
            strLeagueAlternate: "CACHE",
            imageSrc: "/rail.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Cached League",
            strSport: "Soccer",
            strLeagueAlternate: "CACHE",
            imageSrc: "/rail.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      expect(
        within(document.body).getByText("Showing the last loaded leagues. Refresh failed."),
      ).toBeTruthy();
      expect(within(document.body).getAllByText("Cached League").length).toBeGreaterThanOrEqual(1);
    });

    it("shows designed empty state for active sport filter with reset action", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "10",
            strLeague: "Main Rail League",
            strSport: "Tennis",
            strLeagueAlternate: "Alternate MRL",
            imageSrc: "/m.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);
      const sportFilterNativeSelect = within(document.body)
        .getAllByRole("combobox", { hidden: true })
        .find((element): element is HTMLSelectElement => element.tagName === "SELECT");
      expect(sportFilterNativeSelect).toBeTruthy();
      await fireEvent.update(sportFilterNativeSelect!, "soccer");

      expect(within(document.body).getByText("No leagues match this sport filter")).toBeTruthy();
      expect(
        within(document.body).getByText(
          "Try another sport, or reset the filter to browse every league.",
        ),
      ).toBeTruthy();
      expect(within(document.body).getByRole("button", { name: "Show all sports" })).toBeTruthy();
    });

    it("selects a league and renders a loaded season badge preview", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "10",
            strLeague: "Main Rail League",
            strSport: "Tennis",
            strLeagueAlternate: "Alternate MRL",
            imageSrc: "/m.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "10",
            strLeague: "Main Rail League",
            strSport: "Tennis",
            strLeagueAlternate: "Alternate MRL",
            imageSrc: "/m.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      mockUseLeagueBadgeLookup.mockReturnValue({
        selectedLeagueId: shallowRef("10"),
        selectedLeague: shallowRef({
          idLeague: "10",
          strLeague: "Main Rail League",
          strSport: "Tennis",
          strLeagueAlternate: "Alternate MRL",
          imageSrc: "/m.jpg",
          alternateLabel: "Alternate MRL",
          imageAlt: "League image",
        }),
        badgesQuery: {
          data: shallowRef([
            {
              season: "2024-2025",
              badgeUrl: "/badge.png",
            },
          ]),
          isLoading: shallowRef(false),
          isError: shallowRef(false),
        },
        primaryBadge: shallowRef({
          season: "2024-2025",
          badgeUrl: "/badge.png",
        }),
        badgePreviewAssets: shallowRef([
          {
            imageSrc: "/badge.png",
            imageAlt: "Season badge for Main Rail League",
            strSeason: "2024-2025",
          },
        ]),
        badgePreviewAsset: shallowRef({
          imageSrc: "/badge.png",
          imageAlt: "Season badge for Main Rail League",
          strSeason: "2024-2025",
        }),
        selectLeague: vi.fn(),
        clearSelectedLeague: vi.fn(),
      });

      render(LeaguesCatalog);
      expect(
        within(document.body).getByRole("dialog", { name: "League badge lookup result" }),
      ).toBeTruthy();
      expect(within(document.body).getByAltText("Season badge for Main Rail League")).toBeTruthy();
      expect(within(document.body).getByText("2024")).toBeTruthy();
      expect(within(document.body).getByText("2025")).toBeTruthy();
    });
  });

  describe("search", () => {
    it("updates visible search query from overlay input immediately", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "1",
          strLeague: "Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
          imageSrc: "/hero.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      const [openButton] = within(document.body).getAllByRole("button", {
        name: "Open league search",
      });
      await fireEvent.click(openButton);
      const searchInput = within(document.body).getByLabelText(
        "Search leagues",
      ) as HTMLInputElement;
      await fireEvent.update(searchInput, "prem");

      expect(searchInput.value).toBe("prem");
    });

    it("closes search and opens badge lookup when a search result row is clicked", async () => {
      const selectLeague = vi.fn();
      mockUseLeagueBadgeLookup.mockReturnValue({
        selectedLeagueId: shallowRef(null),
        selectedLeague: shallowRef(null),
        badgesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
        },
        primaryBadge: shallowRef(null),
        badgePreviewAssets: shallowRef([]),
        badgePreviewAsset: shallowRef(null),
        selectLeague,
        clearSelectedLeague: vi.fn(),
      });

      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "1",
          strLeague: "Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
          imageSrc: "/hero.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      const [openButton] = within(document.body).getAllByRole("button", {
        name: "Open league search",
      });
      await fireEvent.click(openButton);
      const searchInput = within(document.body).getByLabelText("Search leagues");
      await fireEvent.update(searchInput, "prem");

      const resultsRegion = within(document.body).getByRole("region", { name: "Search results" });
      await fireEvent.click(
        within(resultsRegion).getByRole("button", { name: "Select Premier League" }),
      );

      expect(selectLeague).toHaveBeenCalledWith("1");
      expect(within(document.body).queryByLabelText("Search leagues")).toBeNull();
      expect(
        within(document.body).getByRole("dialog", { name: "League badge lookup result" }),
      ).toBeTruthy();
    });

    it("clears the overlay query when Clear is clicked, restoring browsing from an empty query", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef({
          idLeague: "1",
          strLeague: "Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
          imageSrc: "/hero.jpg",
        }),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        visibleLeagueItems: shallowRef([
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
            imageSrc: "/main.jpg",
          },
        ]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([
          { value: "all", label: "All sports" },
          { value: "soccer", label: "Soccer" },
        ]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      const [openButton] = within(document.body).getAllByRole("button", {
        name: "Open league search",
      });
      await fireEvent.click(openButton);
      const searchInput = within(document.body).getByLabelText(
        "Search leagues",
      ) as HTMLInputElement;
      await fireEvent.update(searchInput, "prem");

      const clearButton = within(document.body).getByRole("button", { name: "Clear search" });
      await fireEvent.click(clearButton);

      expect(searchInput.value).toBe("");
    });

    it("opens the search overlay with Ctrl+K", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([{ value: "all", label: "All sports" }]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      await fireEvent.keyDown(window, { key: "k", ctrlKey: true });

      expect(within(document.body).getAllByLabelText("Search leagues").length).toBeGreaterThan(0);
    });

    it("opens the search overlay with Meta+K (⌘K)", async () => {
      mockUseLeaguesCatalogDataViewModel.mockReturnValue({
        leaguesQuery: {
          isLoading: shallowRef(false),
          isError: shallowRef(false),
          refetch: vi.fn(),
        },
        heroItem: shallowRef(null),
        heroImageSrc: "/hero.jpg",
        leagueItems: shallowRef([]),
        visibleLeagueItems: shallowRef([]),
        sportLeagueGroups: shallowRef([]),
        sportFilterOptions: shallowRef([{ value: "all", label: "All sports" }]),
        selectedSport: shallowRef("all"),
        isSportFilterActive: shallowRef(false),
      });

      render(LeaguesCatalog);

      await fireEvent.keyDown(window, { key: "k", metaKey: true });

      expect(within(document.body).getAllByLabelText("Search leagues").length).toBeGreaterThan(0);
    });
  });
});
