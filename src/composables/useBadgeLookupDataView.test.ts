import { describe, expect, it } from "vitest";
import { parsedSeasonYears, useBadgeLookupDataView } from "@/composables/useBadgeLookupDataView";

describe("useBadgeLookupDataView", () => {
  it("returns preview assets list when available", () => {
    const previewAssets = [
      {
        imageSrc: "/badge-1.png",
        imageAlt: "Badge 1",
        strSeason: "2024-2025",
      },
    ];

    const view = useBadgeLookupDataView({
      previewAsset: () => ({
        imageSrc: "/fallback.png",
        imageAlt: "Fallback",
      }),
      previewAssets: () => previewAssets,
    });

    expect(view.availablePreviewAssets.value).toEqual(previewAssets);
  });

  it("falls back to primary preview asset when list is empty", () => {
    const fallback = {
      imageSrc: "/fallback.png",
      imageAlt: "Fallback",
      season: "Season: 2022-2023",
    };
    const view = useBadgeLookupDataView({
      previewAsset: () => fallback,
      previewAssets: () => [],
    });

    expect(view.availablePreviewAssets.value).toEqual([fallback]);
  });

  it("returns empty list when neither preview list nor primary asset exist", () => {
    const view = useBadgeLookupDataView({
      previewAsset: () => null,
      previewAssets: () => [],
    });

    expect(view.availablePreviewAssets.value).toEqual([]);
  });
});

describe("parsedSeasonYears", () => {
  it("parses season ranges from strSeason and season formats", () => {
    expect(
      parsedSeasonYears({
        imageAlt: "Badge",
        strSeason: "2024-2025",
      }),
    ).toEqual(["2024", "2025"]);

    expect(
      parsedSeasonYears({
        imageAlt: "Badge",
        season: "Season: 2021-2022",
      }),
    ).toEqual(["2021", "2022"]);
  });

  it("returns empty list for missing or unparsable values", () => {
    expect(
      parsedSeasonYears({
        imageAlt: "Badge",
      }),
    ).toEqual([]);

    expect(
      parsedSeasonYears({
        imageAlt: "Badge",
        strSeason: "TBD",
      }),
    ).toEqual([]);
  });
});
