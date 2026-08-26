const waitForMobileProject = (attempt = 0) => {
  const section = document.querySelector<HTMLElement>('.project--mobile');
  const gsap = (window as Window & { gsap?: any }).gsap;

  if (!section || !gsap) {
    if (attempt < 120) window.requestAnimationFrame(() => waitForMobileProject(attempt + 1));
    return;
  }

  if (section.dataset.mobileGsapReady === 'true') return;
  section.dataset.mobileGsapReady = 'true';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const narrow = window.matchMedia('(max-width: 420px)').matches;
  const wordmark = section.querySelector<HTMLElement>('.project-wordmark');
  const copy = section.querySelector<HTMLElement>('.project-copy--mobile');
  const index = copy?.querySelector<HTMLElement>('.project-index');
  const title = copy?.querySelector<HTMLElement>('h3');
  const description = copy?.querySelector<HTMLElement>('p');
  const meta = copy?.querySelector<HTMLElement>('.project-meta');
  const link = copy?.querySelector<HTMLElement>('a');
  const phones = Array.from(section.querySelectorAll<HTMLElement>('.phones-cluster .phone'));

  if (!wordmark || !copy || !index || !title || !description || !meta || !link || phones.length < 3) return;

  section.classList.add('project--mobile-motion');
  section.classList.add('is-visible');
  section.style.opacity = '1';
  section.style.transform = 'none';
  section.style.transition = 'none';

  if (prefersReducedMotion) return;

  const [leftPhone, centerPhone, rightPhone] = phones;
  const phoneContent = phones.map((phone) =>
    phone.querySelectorAll<HTMLElement>('.phone-head, .phone-line, .phone-stack span'),
  );

  const finalState = mobile
    ? {
        leftRotation: -9,
        leftScale: narrow ? 0.78 : 0.84,
        centerRotation: 0,
        centerScale: narrow ? 0.88 : 0.94,
        rightRotation: 9,
        rightScale: narrow ? 0.78 : 0.84,
      }
    : {
        leftRotation: -9,
        leftScale: 1,
        centerRotation: 0,
        centerScale: 1.08,
        rightRotation: 10,
        rightScale: 1,
      };

  const resetToInitialState = () => {
    gsap.set(wordmark, {
      opacity: 0,
      x: mobile ? -24 : -90,
      y: mobile ? 8 : 0,
      scale: mobile ? 0.99 : 0.96,
      transformOrigin: 'left center',
    });
    gsap.set(index, { opacity: 0, y: mobile ? -8 : -16 });
    gsap.set(title, {
      opacity: 0,
      y: mobile ? 28 : 72,
      clipPath: 'inset(0 0 100% 0)',
      transformOrigin: 'left bottom',
    });
    gsap.set(description, { opacity: 0, y: mobile ? 16 : 28 });
    gsap.set(meta, { opacity: 0, y: mobile ? 12 : 20 });
    gsap.set(link, { opacity: 0, x: mobile ? -12 : -24 });

    gsap.set(leftPhone, {
      opacity: 0,
      x: mobile ? -54 : -170,
      y: mobile ? 42 : 90,
      rotation: mobile ? -16 : -28,
      scale: mobile ? finalState.leftScale * 0.9 : 0.82,
      transformOrigin: '50% 85%',
    });
    gsap.set(centerPhone, {
      opacity: 0,
      x: 0,
      y: mobile ? 72 : 180,
      rotation: 0,
      scale: mobile ? finalState.centerScale * 0.9 : 0.82,
      transformOrigin: '50% 85%',
    });
    gsap.set(rightPhone, {
      opacity: 0,
      x: mobile ? 54 : 170,
      y: mobile ? 44 : 100,
      rotation: mobile ? 16 : 28,
      scale: mobile ? finalState.rightScale * 0.9 : 0.82,
      transformOrigin: '50% 85%',
    });

    phoneContent.forEach((items) => {
      gsap.set(items, { opacity: 0, y: 9, scaleX: 0.72, transformOrigin: 'left center' });
    });
  };

  resetToInitialState();

  let hasPlayed = false;
  let floatStarted = false;

  const startFloating = () => {
    if (floatStarted) return;
    floatStarted = true;

    const floatDistance = mobile ? 5 : 10;
    const rotationDelta = mobile ? 0.35 : 0.8;

    gsap.to(leftPhone, {
      y: -floatDistance,
      rotation: finalState.leftRotation + rotationDelta,
      duration: 3.7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(centerPhone, {
      y: -(floatDistance + (mobile ? 2 : 4)),
      rotation: mobile ? 0.25 : 0.7,
      duration: 4.2,
      delay: 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(rightPhone, {
      y: -(floatDistance - 1),
      rotation: finalState.rightRotation - rotationDelta,
      duration: 3.9,
      delay: 0.35,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  };

  const play = () => {
    if (hasPlayed) return;
    hasPlayed = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(wordmark, {
      opacity: mobile ? 0.11 : 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: mobile ? 0.68 : 1.05,
      ease: 'expo.out',
    })
      .to(
        index,
        { opacity: 1, y: 0, duration: mobile ? 0.34 : 0.42 },
        mobile ? '-=0.42' : '-=0.15',
      )
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: mobile ? 0.72 : 0.92,
          ease: 'expo.out',
        },
        '-=0.18',
      )
      .to(description, { opacity: 1, y: 0, duration: mobile ? 0.48 : 0.62 }, '-=0.38')
      .to(meta, { opacity: 1, y: 0, duration: mobile ? 0.42 : 0.52 }, '-=0.3')
      .to(link, { opacity: 1, x: 0, duration: mobile ? 0.42 : 0.5 }, '-=0.25')
      .to(
        leftPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: finalState.leftRotation,
          scale: finalState.leftScale,
          duration: mobile ? 0.72 : 1.05,
          ease: 'back.out(1.2)',
        },
        mobile ? '-=0.12' : '-=0.55',
      )
      .to(
        centerPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: finalState.centerRotation,
          scale: finalState.centerScale,
          duration: mobile ? 0.76 : 1.08,
          ease: 'back.out(1.22)',
        },
        '-=0.56',
      )
      .to(
        rightPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: finalState.rightRotation,
          scale: finalState.rightScale,
          duration: mobile ? 0.72 : 1.05,
          ease: 'back.out(1.2)',
        },
        '-=0.54',
      )
      .to(phoneContent[0], { opacity: 1, y: 0, scaleX: 1, duration: 0.28, stagger: 0.035 }, '-=0.46')
      .to(phoneContent[1], { opacity: 1, y: 0, scaleX: 1, duration: 0.28, stagger: 0.035 }, '-=0.4')
      .to(phoneContent[2], { opacity: 1, y: 0, scaleX: 1, duration: 0.28, stagger: 0.035 }, '-=0.38')
      .call(startFloating);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      });
    },
    { threshold: mobile ? 0.18 : 0.26, rootMargin: '0px 0px -8% 0px' },
  );

  observer.observe(section);
};

export const initMobileProjectMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForMobileProject(), { once: true });
    return;
  }

  window.requestAnimationFrame(() => waitForMobileProject());
};
