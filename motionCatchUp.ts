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

const installEarlyIntersectionObservers = () => {
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

    // All of the portfolio entrance observers use low thresholds. Give those
    // observers a much larger runway so their motion begins before the section
    // reaches the viewport instead of starting after the user has already
    // scrolled onto it.
    const isEntranceObserver = !options.root && highestThreshold <= 0.3;

    const tunedOptions: IntersectionObserverInit = isEntranceObserver
      ? {
          ...options,
          threshold: 0.035,
          rootMargin: '55% 0px 55% 0px',
        }
      : options;

    return new NativeObserver(callback, tunedOptions);
  } as unknown as typeof IntersectionObserver;

  MotionAwareObserver.prototype = NativeObserver.prototype;
  (window as any).IntersectionObserver = MotionAwareObserver;
};

const revealNearbyFallbacks = () => {
  const top = -window.innerHeight * 0.45;
  const bottom = window.innerHeight * 1.45;

  document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom >= top && rect.top <= bottom) element.classList.add('is-visible');
  });
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

  const settle = () => {
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => setTimelineSpeed(1), 150);
  };

  const sampleScroll = () => {
    framePending = false;

    const now = performance.now();
    const y = window.scrollY;
    const elapsed = Math.max(now - lastTime, 16);
    const velocity = Math.abs(y - lastY) / elapsed;

    // Normal reading speed keeps the intended choreography. Faster flicks
    // automatically speed up active entrance timelines so animations cannot
    // remain several sections behind the user's scroll position.
    if (velocity > 3.2) setTimelineSpeed(5);
    else if (velocity > 1.8) setTimelineSpeed(3.6);
    else if (velocity > 0.9) setTimelineSpeed(2.25);
    else if (velocity > 0.45) setTimelineSpeed(1.45);
    else setTimelineSpeed(1);

    if (velocity > 0.8) revealNearbyFallbacks();

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
  window.addEventListener('resize', revealNearbyFallbacks);
  revealNearbyFallbacks();
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

  // Install this before the section-specific motion modules create their
  // IntersectionObservers.
  installEarlyIntersectionObservers();
  installVelocityCatchUp();
};

export {};
