<script setup lang="ts">
import UITypography from "@/components/ui/UITypography.vue";

defineOptions({
  name: "UIHero",
});

interface UIHeroProps {
  kicker?: string;
  title: string;
  description: string;
  imageSrc: string;
}

const props = withDefaults(defineProps<UIHeroProps>(), {
  kicker: "",
});
</script>

<template>
  <section class="hero-panel" :style="{ backgroundImage: `url(${props.imageSrc})` }">
    <div class="hero-vignette">
      <UITypography v-if="props.kicker" as="p" variant="kicker">{{ props.kicker }}</UITypography>
      <UITypography as="h1" variant="title">{{ props.title }}</UITypography>
      <UITypography as="p" variant="muted">{{ props.description }}</UITypography>
    </div>
  </section>
</template>

<style scoped>
.hero-panel {
  min-height: 70vh;
  border-radius: var(--radius-lg);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.hero-vignette {
  min-height: 70vh;
  display: grid;
  align-content: end;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-5);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.94) 20%,
    rgba(0, 0, 0, 0.72) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

@media (min-width: 48rem) {
  .hero-panel,
  .hero-vignette {
    min-height: 76vh;
  }
}
</style>
