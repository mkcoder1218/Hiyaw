type GsapLike = {
  globalTimeline?: {
    timeScale: (value?: number) => any;
  };
  ticker?: {
    fps?: (value?: number) => any;
  };
  getTweensOf?: (targets: any) => any[];
};

declare global {
  interface Window {
    gsap?: GsapLike;
  }
}

let installed = false;

// Keep the site a little quicker without changing speed while the user scrolls.
// A stable time scale preserves every timeline's intended sequence.
const BASE_SPEED = 1.12;

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

    // Entrance animations only become eligible inside the current viewport's
    // active band. This prevents the next full-page scene from starting while
    // the user is still watching the current one.
    const isEntranceObserver = !options.root && highestThreshold <= 0.35;

    const tunedOptions: IntersectionObserverInit = isEntranceObserver
      ? {
          ...options,
          rootMargin: '-12% 0px -18% 0px',
        }
      : options;

    return new NativeObserver(callback, tunedOptions);
  } as unknown as typeof IntersectionObserver;

  MotionAwareObserver.prototype = NativeObserver.prototype;
  (window as any).IntersectionObserver = MotionAwareObserver;
};

const sceneSelectors = [
  '.hero',
  '.collaboration',
  '.work > .section-head',
  '.work > .project',
  '.services',
  '.surface-system',
  '.why',
  '.process',
  '.about > .habesha-collage',
  '.about > .founders',
  '.insights',
  '.contact',
].join(',');

const installSceneLifecycle = (attempt = 0) => {
  const gsap = window.gsap;
  if (!gsap?.globalTimeline?.timeScale || !gsap.getTweensOf) {
    if (attempt < 120) requestAnimationFrame(() => installSceneLifecycle(attempt + 1));
    return;
  }

  gsap.globalTimeline.timeScale(BASE_SPEED);

  // Low-end mobile devices were doing unnecessary work for every infinite
  // float/orbit animation from all previously viewed sections. A slightly lower
  // ticker rate is visually smooth on phones while reducing main-thread/GPU load.
  if (window.matchMedia('(max-width: 760px)').matches) {
    gsap.ticker?.fps?.(50);
  }

  const scenes = Array.from(document.querySelectorAll<HTMLElement>(sceneSelectors));
  if (!scenes.length) return;

  const tweensFor = (scene: HTMLElement) => {
    const targets = [scene, ...Array.from(scene.querySelectorAll<HTMLElement>('*'))];
    return gsap.getTweensOf?.(targets) ?? [];
  };

  const pauseScene = (scene: HTMLElement) => {
    tweensFor(scene).forEach((tween) => {
      if (typeof tween.pause === 'function') tween.pause();
    });
  };

  const resumeScene = (scene: HTMLElement) => {
    tweensFor(scene).forEach((tween) => {
      if (typeof tween.resume === 'function') tween.resume();
    });
  };

  const lifecycleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = entry.target as HTMLElement;
        if (entry.isIntersecting) resumeScene(scene);
        else pauseScene(scene);
      });
    },
    {
      threshold: 0,
      rootMargin: '8% 0px 8% 0px',
    },
  );

  scenes.forEach((scene) => lifecycleObserver.observe(scene));
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
  installIsolatedIntersectionObservers();
  installSceneLifecycle();
};

export {};
