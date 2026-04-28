type ScrollElementGetter = () => HTMLElement | null;
type CardOffsetsGetter = () => number[];

type UseRailSnapOptions = {
  getScrollElement: ScrollElementGetter;
  getCardOffsets: CardOffsetsGetter;
  onSnapStart?: () => void;
  onSnapEnd?: () => void;
  clearMomentum?: () => void;
};

const SNAP_IDLE_MS = 280;
const SNAP_WHEEL_GUARD_MS = 420;
const SNAP_MIN_DISTANCE_PX = 2;
const SNAP_MAX_DISTANCE_PX = 136;

export function useRailSnap(options: UseRailSnapOptions) {
  let scrollIdleLogTimer: ReturnType<typeof setTimeout> | null = null;
  let isSnapping = false;
  let snapUnlockTimer: ReturnType<typeof setTimeout> | null = null;
  let lastWheelTs = 0;
  let isWheelActive = false;
  let wheelIdleTimer: ReturnType<typeof setTimeout> | null = null;

  function getSnapPositions(): number[] {
    const scrollEl = options.getScrollElement();
    const offsets = options.getCardOffsets();
    if (!offsets.length) {
      return [0];
    }

    const scrollPaddingLeftRaw = scrollEl ? getComputedStyle(scrollEl).scrollPaddingLeft : "0px";
    const scrollPaddingLeft = Number.parseFloat(scrollPaddingLeftRaw) || 0;
    const adjustedOffsets = offsets.map((offset) => Math.max(0, offset - scrollPaddingLeft));
    const sortedPositions = [0, ...adjustedOffsets].sort((a, b) => a - b);
    const dedupedPositions: number[] = [];
    const snapTolerancePx = 1;

    sortedPositions.forEach((position) => {
      const normalizedPosition = position < snapTolerancePx ? 0 : position;
      const previousPosition = dedupedPositions[dedupedPositions.length - 1];
      if (
        previousPosition === undefined ||
        Math.abs(normalizedPosition - previousPosition) >= snapTolerancePx
      ) {
        dedupedPositions.push(normalizedPosition);
      }
    });

    return dedupedPositions;
  }

  function getClosestSnapPositionIndex(scrollLeft: number, snapPositions: number[]): number {
    if (!snapPositions.length) {
      return 0;
    }

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    snapPositions.forEach((position, index) => {
      const distance = Math.abs(position - scrollLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function evaluateSnapCandidate(ignoreWheelGuard = false) {
    const currentScrollEl = options.getScrollElement();
    if (!currentScrollEl) {
      return;
    }

    const now = Date.now();
    const sinceWheelMs = now - lastWheelTs;
    const snapPositions = getSnapPositions();
    const closestIndex = getClosestSnapPositionIndex(currentScrollEl.scrollLeft, snapPositions);
    const rawTarget = snapPositions[closestIndex] ?? currentScrollEl.scrollLeft;
    const maxScrollLeft = currentScrollEl.scrollWidth - currentScrollEl.clientWidth;
    const target = Math.min(Math.max(rawTarget, 0), maxScrollLeft);
    const distanceToSnap = target - currentScrollEl.scrollLeft;
    const blockedByWheel = ignoreWheelGuard
      ? false
      : isWheelActive || (sinceWheelMs >= 0 && sinceWheelMs < SNAP_WHEEL_GUARD_MS);
    const shouldSnap =
      !isSnapping &&
      !blockedByWheel &&
      Math.abs(distanceToSnap) > SNAP_MIN_DISTANCE_PX &&
      Math.abs(distanceToSnap) <= SNAP_MAX_DISTANCE_PX;

    if (!shouldSnap) {
      return;
    }

    options.clearMomentum?.();
    isSnapping = true;
    options.onSnapStart?.();

    if (snapUnlockTimer) {
      clearTimeout(snapUnlockTimer);
    }

    snapUnlockTimer = setTimeout(() => {
      isSnapping = false;
      options.onSnapEnd?.();
    }, 280);

    currentScrollEl.scrollTo({
      left: target,
      behavior: "smooth",
    });
  }

  function onScrollForSnap() {
    const scrollEl = options.getScrollElement();
    if (!scrollEl) {
      return;
    }

    if (scrollIdleLogTimer) {
      clearTimeout(scrollIdleLogTimer);
    }

    scrollIdleLogTimer = setTimeout(() => {
      evaluateSnapCandidate(false);
    }, SNAP_IDLE_MS);
  }

  function markWheelActivity() {
    lastWheelTs = Date.now();
    isWheelActive = true;

    if (wheelIdleTimer) {
      clearTimeout(wheelIdleTimer);
    }

    wheelIdleTimer = setTimeout(() => {
      isWheelActive = false;
      evaluateSnapCandidate(true);
    }, SNAP_WHEEL_GUARD_MS);
  }

  function goToNext() {
    const scrollEl = options.getScrollElement();
    if (!scrollEl) {
      return;
    }

    const snapPositions = getSnapPositions();
    const currentIndex = getClosestSnapPositionIndex(scrollEl.scrollLeft, snapPositions);
    const nextIndex = Math.min(currentIndex + 1, snapPositions.length - 1);
    scrollEl.scrollTo({
      left: snapPositions[nextIndex] ?? 0,
      behavior: "smooth",
    });
  }

  function goToPrevious() {
    const scrollEl = options.getScrollElement();
    if (!scrollEl) {
      return;
    }

    const snapPositions = getSnapPositions();
    const currentIndex = getClosestSnapPositionIndex(scrollEl.scrollLeft, snapPositions);
    const previousIndex = Math.max(currentIndex - 1, 0);
    scrollEl.scrollTo({
      left: snapPositions[previousIndex] ?? 0,
      behavior: "smooth",
    });
  }

  function cleanup() {
    if (scrollIdleLogTimer) {
      clearTimeout(scrollIdleLogTimer);
      scrollIdleLogTimer = null;
    }
    if (snapUnlockTimer) {
      clearTimeout(snapUnlockTimer);
      snapUnlockTimer = null;
    }
    if (wheelIdleTimer) {
      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = null;
    }
  }

  return {
    goToNext,
    goToPrevious,
    onScrollForSnap,
    markWheelActivity,
    cleanup,
  };
}
