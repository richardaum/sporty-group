<script setup lang="ts">
import UITypography from "@/components/ui/UITypography.vue";
import UISquareBadge from "@/components/ui/UISquareBadge.vue";
import UIItemNavigator from "@/components/ui/UIItemNavigator.vue";
import { useBadgeLookupDataView, type PreviewAsset } from "@/composables/useBadgeLookupDataView";
import { PhArrowRight } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    hasSelection?: boolean;
    selectedLabel?: string;
    isLoading?: boolean;
    isError?: boolean;
    previewAsset: PreviewAsset | null;
    previewAssets?: PreviewAsset[];
    idleMessage?: string;
    loadingMessage?: string;
    errorMessage?: string;
    emptyResultMessage?: string;
  }>(),
  {
    title: "Preview",
    hasSelection: false,
    selectedLabel: "",
    isLoading: false,
    isError: false,
    previewAssets: () => [],
    idleMessage: "Select an item to load a preview.",
    loadingMessage: "Loading preview for {label}...",
    errorMessage: "Could not load preview right now. Try selecting the item again.",
    emptyResultMessage: "No preview is available for {label}.",
  },
);

const { availablePreviewAssets, parsedSeasonYears } = useBadgeLookupDataView({
  previewAsset: () => props.previewAsset,
  previewAssets: () => props.previewAssets,
});

function withLabel(template: string, label: string) {
  return template.replace("{label}", label || "selected item");
}
</script>

<template>
  <section class="badge-panel" aria-live="polite">
    <UITypography as="h2" variant="titleSm" class="badge-panel-title">{{ title }}</UITypography>
    <section
      v-if="hasSelection && !isLoading && !isError && !availablePreviewAssets.length"
      class="badge-state-shell"
    >
      <div class="badge-state-visual badge-state-visual-empty" aria-hidden="true">
        <div class="badge-state-ring">
          <div class="badge-state-exclamation">!</div>
        </div>
      </div>
      <p class="badge-panel-copy">
        {{ withLabel(emptyResultMessage, selectedLabel || "") }}
      </p>
    </section>
    <section v-else-if="!hasSelection" class="badge-state-shell">
      <div class="badge-state-visual badge-state-visual-empty" aria-hidden="true">
        <div class="badge-state-ring">
          <div class="badge-state-exclamation">!</div>
        </div>
      </div>
      <p class="badge-panel-copy">
        {{ idleMessage }}
      </p>
    </section>
    <section v-else-if="isLoading" class="badge-state-shell">
      <div class="badge-state-visual badge-state-visual-loading" aria-hidden="true">
        <div class="skeleton-block skeleton-block-title" />
        <div class="skeleton-block skeleton-block-mark" />
      </div>
      <p class="badge-panel-copy">
        {{ withLabel(loadingMessage, selectedLabel || "") }}
      </p>
    </section>
    <section v-else-if="isError" class="badge-state-shell">
      <div class="badge-state-visual badge-state-visual-error" aria-hidden="true">
        <div class="badge-state-ring badge-state-ring-error">
          <div class="badge-state-cross" />
        </div>
      </div>
      <p class="badge-panel-copy badge-panel-copy-error">
        {{ errorMessage }}
      </p>
    </section>
    <UIItemNavigator
      v-else-if="availablePreviewAssets.length"
      :items="availablePreviewAssets"
      previous-label="Show previous season badge"
      next-label="Show next season badge"
    >
      <template #default="{ currentItem }">
        <img
          v-if="currentItem.imageSrc"
          :src="currentItem.imageSrc"
          :alt="currentItem.imageAlt"
          class="badge-panel-image"
        />
        <div v-else class="badge-state-visual badge-state-visual-empty badge-state-visual-missing">
          <div class="badge-state-ring" aria-hidden="true">
            <div class="badge-state-exclamation">!</div>
          </div>
          <p class="badge-state-inline-copy">
            {{ currentItem.caption || "No season badge is available." }}
          </p>
        </div>
        <div v-if="parsedSeasonYears(currentItem).length === 2" class="badge-season-list">
          <UISquareBadge class="badge-season-chip">
            {{ parsedSeasonYears(currentItem)[0] }}
          </UISquareBadge>
          <span class="badge-season-arrow" aria-hidden="true">
            <PhArrowRight :size="16" weight="bold" />
          </span>
          <UISquareBadge class="badge-season-chip">
            {{ parsedSeasonYears(currentItem)[1] }}
          </UISquareBadge>
        </div>
      </template>
    </UIItemNavigator>
  </section>
</template>

<style scoped>
.badge-panel {
  border: none;
  border-radius: var(--radius-lg);
  box-sizing: border-box;
  width: 100%;
  max-width: min(30rem, calc(100vw - 2rem));
  margin-inline: auto;
  background: linear-gradient(
    160deg,
    color-mix(in oklab, var(--color-brand-100) 30%, var(--color-bg-surface)) 0%,
    var(--color-bg-surface) 45%,
    color-mix(in oklab, var(--color-bg-elevated) 78%, black) 100%
  );
  box-shadow:
    var(--shadow-soft),
    inset 0 1px 0 color-mix(in oklab, white 8%, transparent);
  padding: var(--space-5);
  min-height: min(70svh, 34rem);
  display: grid;
  gap: var(--space-3);
  justify-items: center;
}

.badge-panel-title {
  margin: 0;
  letter-spacing: 0.01em;
  color: color-mix(in oklab, var(--color-text-primary) 88%, white);
}

.badge-panel-image {
  max-width: 100%;
  width: min(28rem, 100%);
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-brand-500) 32%, var(--color-border));
  background: color-mix(in oklab, var(--color-bg-elevated) 84%, black);
  padding: var(--space-3);
  object-fit: contain;
  justify-self: center;
  display: block;
}

.badge-season-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  align-items: center;
}

.badge-season-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in oklab, var(--color-text-secondary) 82%, white);
}

.badge-season-arrow svg {
  width: 1rem;
  height: 1rem;
}

.badge-state-shell {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  width: 100%;
}

.badge-state-visual {
  width: min(24rem, 100%);
  min-height: min(56svh, 25rem);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-brand-500) 24%, var(--color-border));
  background: color-mix(in oklab, var(--color-bg-elevated) 84%, black);
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-3);
}

.badge-state-visual-empty {
  background:
    radial-gradient(
      circle at 50% 35%,
      color-mix(in oklab, var(--color-brand-400) 22%, transparent),
      transparent 56%
    ),
    color-mix(in oklab, var(--color-bg-elevated) 84%, black);
}

.badge-state-visual-missing {
  width: min(28rem, 100%);
  min-height: 0;
  aspect-ratio: 1 / 1;
  align-content: center;
  padding: var(--space-4);
}

.badge-state-ring {
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--color-brand-500) 42%, var(--color-border));
  display: grid;
  place-items: center;
}

.badge-state-exclamation {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: color-mix(in oklab, var(--color-brand-400) 82%, white);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.badge-state-visual-loading {
  align-content: center;
  gap: var(--space-3);
}

.skeleton-block {
  border-radius: var(--radius-sm);
  background: linear-gradient(
    110deg,
    color-mix(in oklab, var(--color-bg-elevated) 85%, black) 35%,
    color-mix(in oklab, var(--color-bg-surface) 80%, white) 50%,
    color-mix(in oklab, var(--color-bg-elevated) 85%, black) 65%
  );
  background-size: 220% 100%;
  animation: badge-shimmer 1.5s linear infinite;
}

.skeleton-block-title {
  width: min(72%, 14rem);
  height: 0.9rem;
}

.skeleton-block-mark {
  width: min(65%, 12.5rem);
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in oklab, var(--color-brand-500) 16%, var(--color-border));
}

.badge-state-visual-error {
  background:
    radial-gradient(
      circle at 50% 35%,
      color-mix(in oklab, var(--color-error) 22%, transparent),
      transparent 58%
    ),
    color-mix(in oklab, var(--color-bg-elevated) 84%, black);
}

.badge-state-ring-error {
  border-color: color-mix(in oklab, var(--color-error) 56%, var(--color-border));
}

.badge-state-cross {
  width: 1rem;
  height: 1rem;
  position: relative;
}

.badge-state-cross::before,
.badge-state-cross::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-error) 85%, white);
  transform-origin: center;
}

.badge-state-cross::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.badge-state-cross::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.badge-panel-copy {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.45;
  text-align: center;
  max-width: 32ch;
}

.badge-state-inline-copy {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.45;
  text-align: center;
  max-width: min(28ch, calc(100% - (2 * var(--space-3))));
  padding-inline: var(--space-2);
}

.badge-panel-copy-error {
  color: var(--color-error);
  border: 1px solid color-mix(in oklab, var(--color-error) 28%, var(--color-border));
  background: color-mix(in oklab, var(--color-error) 12%, var(--color-bg-surface));
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block {
    animation: none;
  }
}

@keyframes badge-shimmer {
  to {
    background-position-x: -220%;
  }
}
</style>
