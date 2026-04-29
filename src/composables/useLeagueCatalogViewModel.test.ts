import { defineComponent, shallowRef } from "vue";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { LeagueListItem } from "@/api/sportsDb";
import { useLeaguesCatalogDataViewModel } from "@/composables/useLeaguesCatalogDataViewModel";

const mockUseLeaguesQuery = vi.fn();

vi.mock("@/composables/useLeaguesQuery", () => ({
  useLeaguesQuery: () => mockUseLeaguesQuery(),
}));

function league(
  id: string,
  strLeague: string,
  strSport: string,
  strLeagueAlternate: string,
): LeagueListItem {
  return { idLeague: id, strLeague, strSport, strLeagueAlternate };
}

const CatalogVmProbe = defineComponent({
  setup() {
    return useLeaguesCatalogDataViewModel();
  },
  template: "<div />",
});

describe("useLeaguesCatalogDataViewModel", () => {
  function mountWithData(items: LeagueListItem[]) {
    mockUseLeaguesQuery.mockReturnValue({
      data: shallowRef(items),
    });
    const wrapper = mount(CatalogVmProbe, { attachTo: document.body });
    return wrapper;
  }

  it("maps query data into hero from the first league, league list mirrors all leagues, assigns image cycling", () => {
    const items: LeagueListItem[] = [
      league("1", "Alpha", "Soccer", "A"),
      league("2", "Beta", "Soccer", "B"),
    ];

    const wrapper = mountWithData(items);

    expect(wrapper.vm.heroItem?.strLeague).toBe("Alpha");

    expect(wrapper.vm.leagueItems).toHaveLength(2);
    expect(wrapper.vm.leagueItems[0].imageSrc).toBeDefined();
    expect(wrapper.vm.leagueItems[0].imageSrc).not.toBe(wrapper.vm.leagueItems[1].imageSrc);

    wrapper.unmount();
  });

  it("builds sport rails only for sports with at least four leagues, sorted by count descending", () => {
    const items: LeagueListItem[] = [
      ...Array.from({ length: 5 }, (_, i) => league(`c-${i}`, `Cricket ${i}`, "Cricket", "alt")),
      ...Array.from({ length: 4 }, (_, i) => league(`s-${i}`, `Soccer ${i}`, "Soccer", "alt")),
      ...Array.from({ length: 3 }, (_, i) => league(`b-${i}`, `Basket ${i}`, "Basketball", "alt")),
    ];

    const wrapper = mountWithData(items);

    const rails = wrapper.vm.sportLeagueGroups;
    expect(rails.map((r: { sport: string }) => r.sport)).toEqual(["Cricket", "Soccer"]);
    expect(rails[0].items).toHaveLength(5);
    expect(rails[1].items).toHaveLength(4);

    wrapper.unmount();
  });

  it("returns empty rails and null hero when query data is empty", () => {
    const wrapper = mountWithData([]);

    expect(wrapper.vm.heroItem).toBeNull();
    expect(wrapper.vm.leagueItems).toHaveLength(0);
    expect(wrapper.vm.sportLeagueGroups).toEqual([]);

    wrapper.unmount();
  });

  it("supports sport-filtered visible items for combined search/filter composition", () => {
    const items: LeagueListItem[] = [
      league("1", "Premier League", "Soccer", "EPL"),
      league("2", "NFL", "American Football", "NFL"),
      league("3", "La Liga", "Soccer", "Primera"),
    ];
    const wrapper = mountWithData(items);

    expect(wrapper.vm.visibleLeagueItems).toHaveLength(3);
    expect(wrapper.vm.sportFilterOptions.map((option: { value: string }) => option.value)).toEqual([
      "all",
      "American Football",
      "Soccer",
    ]);

    wrapper.vm.setSelectedSport("Soccer");
    expect(wrapper.vm.selectedSport).toBe("Soccer");
    expect(
      wrapper.vm.visibleLeagueItems.map((item: { strLeague: string }) => item.strLeague),
    ).toEqual(["Premier League", "La Liga"]);
    expect(wrapper.vm.heroItem?.strLeague).toBe("Premier League");

    wrapper.vm.setSelectedSport("all");
    expect(wrapper.vm.visibleLeagueItems).toHaveLength(3);

    wrapper.unmount();
  });
});
