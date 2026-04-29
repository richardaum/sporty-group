import { fireEvent, render, within } from "@testing-library/vue";
import { shallowRef } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LeaguesCatalog from "@/components/leagues/LeaguesCatalog.vue";

const mockUseLeaguesCatalogDataViewModel = vi.fn();

vi.mock("@/composables/useLeaguesCatalogDataViewModel", () => ({
  useLeaguesCatalogDataViewModel: () => mockUseLeaguesCatalogDataViewModel(),
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
        sportLeagueGroups: shallowRef([
          {
            sport: "Soccer",
            items: [
              {
                idLeague: "2",
                strLeague: "La Liga",
                strSport: "Soccer",
                strLeagueAlternate: "Primera Division",
                imageSrc: "/sport.jpg",
              },
            ],
          },
        ]),
      });

      render(LeaguesCatalog);

      const sportRail = within(document.body).getByLabelText("Soccer horizontal rail");
      expect(within(sportRail).getByText("La Liga")).toBeTruthy();
      expect(within(sportRail).getByText("Soccer")).toBeTruthy();
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
      });

      render(LeaguesCatalog);

      const mainRailScroller = within(document.body)
        .getAllByLabelText("Scrollable leagues list")
        .find((scrollRegion) => Boolean(within(scrollRegion).queryByText("Main Rail League")));
      expect(mainRailScroller).toBeTruthy();
      expect(within(mainRailScroller!).getByText("Tennis")).toBeTruthy();
      expect(within(mainRailScroller!).getByText("Alternate MRL")).toBeTruthy();
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
      });

      render(LeaguesCatalog);

      expect(within(document.body).getByText("No leagues were returned by the API.")).toBeTruthy();
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
      });

      render(LeaguesCatalog);

      expect(
        within(document.body).getByText("Showing the last loaded leagues. Refresh failed."),
      ).toBeTruthy();
      expect(within(document.body).getAllByText("Cached League").length).toBeGreaterThanOrEqual(1);
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
      });

      render(LeaguesCatalog);

      await fireEvent.keyDown(window, { key: "k", metaKey: true });

      expect(within(document.body).getAllByLabelText("Search leagues").length).toBeGreaterThan(0);
    });
  });
});
