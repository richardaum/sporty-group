import { defineComponent, nextTick, shallowRef } from "vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLeagueSearch } from "@/composables/useLeagueSearch";

type MockLeague = {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
};

const sample: MockLeague[] = [
  {
    idLeague: "1",
    strLeague: "Premier League",
    strSport: "Soccer",
    strLeagueAlternate: "EPL",
  },
  {
    idLeague: "2",
    strLeague: "NFL Super Bowl",
    strSport: "American Football",
    strLeagueAlternate: "",
  },
];

function mountLeagueSearch(
  itemsRef: { value: MockLeague[] },
  isActive: boolean | { value: boolean },
) {
  return mount(
    defineComponent({
      setup() {
        const active = typeof isActive === "boolean" ? shallowRef(isActive) : isActive;
        return useLeagueSearch(
          () => itemsRef.value,
          () => active.value,
        );
      },
      template: "<div />",
    }),
    { attachTo: document.body },
  );
}

describe("useLeagueSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("filters by strLeague substring (case-insensitive) after debounce when search is active", async () => {
    const items = shallowRef(sample);
    const wrapper = mountLeagueSearch(items, true);

    wrapper.vm.setSearchQuery("prem");
    await nextTick();

    expect(wrapper.vm.searchResults).toHaveLength(2);

    vi.advanceTimersByTime(119);
    await nextTick();
    expect(wrapper.vm.searchResults).toHaveLength(2);

    vi.advanceTimersByTime(2);
    await nextTick();
    expect(wrapper.vm.searchResults).toHaveLength(1);
    expect(wrapper.vm.searchResults[0].strLeague).toBe("Premier League");

    wrapper.vm.setSearchQuery("NFL");
    await nextTick();

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.vm.searchResults).toHaveLength(1);
    expect(wrapper.vm.searchResults[0].idLeague).toBe("2");
  });

  it("does not filter while search is inactive, even when the query is non-empty", async () => {
    const items = shallowRef(sample);
    const wrapper = mountLeagueSearch(items, false);

    wrapper.vm.setSearchQuery("NFL");

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.vm.searchResults).toHaveLength(2);
    expect(wrapper.vm.hasSearchQuery).toBe(true);
  });

  it("restore full list after clearSearchQuery", async () => {
    const items = shallowRef(sample);
    const wrapper = mountLeagueSearch(items, true);

    wrapper.vm.setSearchQuery("xyz");
    await nextTick();

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.vm.searchResults).toHaveLength(0);

    wrapper.vm.clearSearchQuery();
    await nextTick();

    vi.runAllTimers();
    await nextTick();

    expect(wrapper.vm.searchResults).toHaveLength(2);
    expect(wrapper.vm.hasSearchQuery).toBe(false);
  });
});
