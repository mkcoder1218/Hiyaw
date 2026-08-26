type GsapLike = {
  globalTimeline?: {
    timeScale: (value?: number) => any;
  };
};

declare global {
  interface Window {
    gsap?: GsapLike;
  }
}

let installed = false;

const BASE_SPEED = 1.15;

const installIsolatedIntersectionObservers = () => {
  const NativeObserver = window.IntersectionObserver;
  if (!NativeObserver || (window as any).__hyawMotionObserverPatched) return;

  (window as any).__hyawMotionObserverPatched = true;

  const MotionAwareObserver = function (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    const thresholdValues = Array.isArray(options.threshold)
      ? options.threshold
      : [typeof options.threshold === 'number' ? options.threshold : 0];
    const highestThreshold = Math.max(...thresholdValues);

    // Entrance observers should fire only after their target has moved into the
    // current viewport's active band. Full-page scenes keep their animation
    // isolated so neighboring scenes do not start early.
    const isEntranceObserver = !options.root && highestThreshold <= 0.35;

    const tunedOptions: IntersectionObserverInit = isEntranceObserver
      ? {
          ...options,
          rootMargin: '-14% 0px -20% 0px',
        }
      : options;

    return new NativeObserver(callback, tunedOptions);
  } as unknown as typeof IntersectionObserver;

  MotionAwareObserver.prototype = NativeObserver.prototype;
  (window as any).IntersectionObserver = MotionAwareObserver;
};

const installVelocityCatchUp = () => {
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let resetTimer = 0;
  let framePending = false;

  const setTimelineSpeed = (speed: number) => {
    const timeline = window.gsap?.globalTimeline;
    if (!timeline?.timeScale) return;
    timeline.timeScale(speed);
  };

  const applyBaseSpeed = (attempt = 0) => {
    const timeline = window.gsap?.globalTimeline;
    if (timeline?.timeScale) {
      timeline.timeScale(BASE_SPEED);
      return;
    }

    if (attempt < 120) requestAnimationFrame(() => applyBaseSpeed(attempt + 1));
  };

  const settle = () => {
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => setTimelineSpeed(BASE_SPEED), 130);
  };

  const sampleScroll = () => {
    framePending = false;

    const now = performance.now();
    const y = window.scrollY;
    const elapsed = Math.max(now - lastTime, 16);
    const velocity = Math.abs(y - lastY) / elapsed;

    // Keep the normal choreography slightly faster everywhere, then add only a
    // modest temporary boost while the user scrolls quickly.
    if (velocity > 3.0) setTimelineSpeed(2.55);
    else if (velocity > 1.7) setTimelineSpeed(2.05);
    else if (velocity > 0.9) setTimelineSpeed(1.68);
    else if (velocity > 0.45) setTimelineSpeed(1.38);
    else setTimelineSpeed(BASE_SPEED);

    lastY = y;
    lastTime = now;
    settle();
  };

  const onScroll = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(sampleScroll);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  applyBaseSpeed();
};

export const initMotionCatchUp = () => {
  if (installed) return;
  installed = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  // Install before section-specific motion modules create their observers.
  // This keeps each full-page scene responsible for its own entrance.
  installIsolatedIntersectionObservers();
  installVelocityCatchUp();
};

export {};
