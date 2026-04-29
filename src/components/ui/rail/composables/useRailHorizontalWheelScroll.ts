type ScrollElementGetter = () => HTMLElement | null;

type UseRailHorizontalWheelScrollOptions = {
  getScrollElement: ScrollElementGetter;
  onWheelActivity?: () => void;
};

const WHEEL_MAX_STEP_PX = 88;
const WHEEL_EASING = 0.3;

export function useRailHorizontalWheelScroll(options: UseRailHorizontalWheelScrollOptions) {
  let wheelTargetLeft: number | null = null;
  let wheelRafId: number | null = null;

  function clearWheelAnimation() {
    if (wheelRafId !== null) {
      window.cancelAnimationFrame(wheelRafId);
      wheelRafId = null;
    }
    wheelTargetLeft = null;
  }

  function onWheel(event: WheelEvent) {
    options.onWheelActivity?.();

    const scrollEl = options.getScrollElement();
    if (!scrollEl) {
      return;
    }

    const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
    const hasHorizontalRange = maxScrollLeft > 0;
    const dominantDeltaRaw =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const deltaModeScale =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? scrollEl.clientWidth
          : 1;
    const dominantDelta = dominantDeltaRaw * deltaModeScale;
    const boundedDelta =
      Math.sign(dominantDelta) * Math.min(Math.abs(dominantDelta), WHEEL_MAX_STEP_PX);
    const appliedDelta = hasHorizontalRange ? boundedDelta : 0;
    const beforeLeft = scrollEl.scrollLeft;

    if (appliedDelta === 0) {
      return;
    }

    event.preventDefault();

    if (wheelTargetLeft === null) {
      wheelTargetLeft = beforeLeft;
    }

    wheelTargetLeft = Math.min(Math.max(wheelTargetLeft + appliedDelta, 0), maxScrollLeft);

    if (wheelRafId !== null) {
      return;
    }

    const animateWheel = () => {
      const currentScrollEl = options.getScrollElement();
      if (!currentScrollEl || wheelTargetLeft === null) {
        wheelRafId = null;
        return;
      }

      const distance = wheelTargetLeft - currentScrollEl.scrollLeft;
      if (Math.abs(distance) <= 1.5) {
        currentScrollEl.scrollLeft = wheelTargetLeft;
        wheelTargetLeft = null;
        wheelRafId = null;
        return;
      }

      currentScrollEl.scrollLeft += distance * WHEEL_EASING;
      wheelRafId = window.requestAnimationFrame(animateWheel);
    };

    wheelRafId = window.requestAnimationFrame(animateWheel);
  }

  return {
    onWheel,
    clearWheelAnimation,
  };
}
