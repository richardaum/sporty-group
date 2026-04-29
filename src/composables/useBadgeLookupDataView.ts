import { computed } from "vue";

export interface PreviewAsset {
  imageSrc?: string;
  imageAlt: string;
  caption?: string;
  season?: string;
  strSeason?: string;
}

function parseSeasonRange(season?: string): [string, string] | null {
  if (!season) {
    return null;
  }

  const normalizedSeason = season.replace(/^season:\s*/i, "").trim();
  const match = normalizedSeason.match(/^(\d{4})\D+(\d{4})$/);
  if (!match) {
    return null;
  }

  return [match[1], match[2]];
}

export function parsedSeasonYears(asset: PreviewAsset): string[] {
  const value = asset.strSeason ?? asset.season;
  const range = parseSeasonRange(value);
  return range ? [range[0], range[1]] : [];
}

export function useBadgeLookupDataView(options: {
  previewAsset: () => PreviewAsset | null;
  previewAssets: () => PreviewAsset[];
}) {
  const availablePreviewAssets = computed(() => {
    const assets = options.previewAssets();
    if (assets.length > 0) {
      return assets;
    }

    const primaryAsset = options.previewAsset();
    return primaryAsset ? [primaryAsset] : [];
  });

  return {
    availablePreviewAssets,
    parsedSeasonYears,
  };
}
