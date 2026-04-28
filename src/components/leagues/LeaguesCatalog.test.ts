import { render, within } from "@testing-library/vue";
import { shallowRef } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LeaguesCatalog from "./LeaguesCatalog.vue";

const mockUseLeagueCatalogViewModel = vi.fn();

vi.mock("../../composables/useLeagueCatalogViewModel", () => ({
  useLeagueCatalogViewModel: () => mockUseLeagueCatalogViewModel(),
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
    vi.clearAllMocks();
  });

  it("shows required fields in sport rails, including alternate league name", () => {
    mockUseLeagueCatalogViewModel.mockReturnValue({
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
      mainRailItems: shallowRef([
        {
          idLeague: "1",
          strLeague: "Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
          imageSrc: "/main.jpg",
        },
      ]),
      sportRails: shallowRef([
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
});
