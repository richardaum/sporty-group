import { shallowRef } from "vue";
import { describe, expect, it } from "vitest";
import { useSportFilter } from "@/composables/useSportFilter";

const items = shallowRef([
  {
    idLeague: "1",
    strLeague: "Premier League",
    strSport: "Soccer",
    strLeagueAlternate: "EPL",
    imageSrc: "/a.jpg",
    alternateLabel: "EPL",
    alternateTags: ["EPL"],
    imageAlt: "A",
  },
  {
    idLeague: "2",
    strLeague: "NBA",
    strSport: "Basketball",
    strLeagueAlternate: "NBA",
    imageSrc: "/b.jpg",
    alternateLabel: "NBA",
    alternateTags: ["NBA"],
    imageAlt: "B",
  },
]);

describe("useSportFilter", () => {
  it("returns all items when filter is not active", () => {
    const viewModel = useSportFilter(() => items.value);

    expect(viewModel.selectedSport.value).toBe("all");
    expect(viewModel.isSportFilterActive.value).toBe(false);
    expect(viewModel.visibleItems.value).toHaveLength(2);
    expect(viewModel.sportFilterOptions.value.map((option) => option.value)).toEqual([
      "all",
      "soccer",
      "basketball",
      "motorsport",
    ]);
  });

  it("normalizes selected sport and filters visible items", () => {
    const viewModel = useSportFilter(() => items.value);

    viewModel.setSelectedSport("Soccer");

    expect(viewModel.selectedSport.value).toBe("soccer");
    expect(viewModel.isSportFilterActive.value).toBe(true);
    expect(viewModel.visibleItems.value).toHaveLength(1);
    expect(viewModel.visibleItems.value[0].strLeague).toBe("Premier League");
  });
});
