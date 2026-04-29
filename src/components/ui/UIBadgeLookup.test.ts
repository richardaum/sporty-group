import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UIBadgeLookup from "@/components/ui/UIBadgeLookup.vue";

describe("UIBadgeLookup", () => {
  it("renders preview image and parsed season chips when preview asset exists", () => {
    render(UIBadgeLookup, {
      props: {
        title: "League badge lookup",
        hasSelection: true,
        selectedLabel: "Premier League",
        previewAsset: {
          imageSrc: "/badge.png",
          imageAlt: "Season badge for Premier League",
          strSeason: "2024-2025",
        },
      },
    });

    expect(screen.getByRole("heading", { name: "League badge lookup" })).toBeTruthy();
    expect(screen.getByAltText("Season badge for Premier League")).toBeTruthy();
    expect(screen.getByText("2024")).toBeTruthy();
    expect(screen.getByText("2025")).toBeTruthy();
  });

  it("renders fallback state message when no preview exists", () => {
    render(UIBadgeLookup, {
      props: {
        hasSelection: true,
        selectedLabel: "Premier League",
        previewAsset: null,
        emptyResultMessage: "No preview is available for {label}.",
      },
    });

    expect(screen.getByText("No preview is available for Premier League.")).toBeTruthy();
  });

  it("navigates between season badges with arrow buttons", async () => {
    render(UIBadgeLookup, {
      props: {
        hasSelection: true,
        selectedLabel: "Premier League",
        previewAsset: {
          imageSrc: "/badge-2024.png",
          imageAlt: "Season badge 2024",
          strSeason: "2024-2025",
        },
        previewAssets: [
          {
            imageSrc: "/badge-2024.png",
            imageAlt: "Season badge 2024",
            strSeason: "2024-2025",
          },
          {
            imageSrc: "/badge-2023.png",
            imageAlt: "Season badge 2023",
            strSeason: "2023-2024",
          },
        ],
      },
    });

    const previousButton = screen.getByRole("button", {
      name: "Show previous season badge",
    });
    const nextButton = screen.getByRole("button", {
      name: "Show next season badge",
    });

    expect(screen.getByAltText("Season badge 2024")).toBeTruthy();
    expect(previousButton.hasAttribute("disabled")).toBe(true);
    expect(nextButton.hasAttribute("disabled")).toBe(false);

    await fireEvent.click(nextButton);

    expect(screen.getByAltText("Season badge 2023")).toBeTruthy();
    expect(previousButton.hasAttribute("disabled")).toBe(false);
    expect(nextButton.hasAttribute("disabled")).toBe(true);
  });

  it("keeps season navigation when a season has no badge and shows a caption", async () => {
    render(UIBadgeLookup, {
      props: {
        hasSelection: true,
        selectedLabel: "English League Championship",
        previewAsset: {
          imageSrc: "/badge-2024.png",
          imageAlt: "Season badge 2024",
          strSeason: "2024-2025",
          caption: "Season: 2024-2025",
        },
        previewAssets: [
          {
            imageSrc: "/badge-2024.png",
            imageAlt: "Season badge 2024",
            strSeason: "2024-2025",
            caption: "Season: 2024-2025",
          },
          {
            imageSrc: "",
            imageAlt: "No season badge available for English League Championship",
            strSeason: "2023-2024",
            caption: "No season badge is available.",
          },
        ],
      },
    });

    const nextButton = screen.getByRole("button", {
      name: "Show next season badge",
    });

    await fireEvent.click(nextButton);

    expect(
      screen.queryByAltText("No season badge available for English League Championship"),
    ).toBeNull();
    expect(screen.getByText("No season badge is available.")).toBeTruthy();
    expect(screen.getByText("2023")).toBeTruthy();
    expect(screen.getByText("2024")).toBeTruthy();
  });
});
