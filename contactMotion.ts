const splitContactTitle = (element: HTMLElement) => {
  if (element.dataset.contactSandSplit === 'true') return;

  const accessibleText = element.innerText.replace(/\s+/g, ' ').trim();
  if (!accessibleText) return;

  element.dataset.contactSandSplit = 'true';
  element.setAttribute('aria-label', accessibleText);

  const fragment = document.createDocumentFragment();
  const chunks = accessibleText.split(/(\s+)/);

  chunks.forEach((chunk) => {
    if (!chunk) return;
    if (/^\s+$/.test(chunk)) {
      fragment.appendChild(document.createTextNode(' '));
      return;
    }

    const word = document.createElement('span');
    word.className = 'contact-sand-word';
    word.setAttribute('aria-hidden', 'true');

    Array.from(chunk).forEach((character) => {
      const char = document.createElement('span');
      char.className = 'contact-sand-char';
      char.textContent = character;
      word.appendChild(char);
    });

    fragment.appendChild(word);
  });

  element.replaceChildren(fragment);
};

const animateContact = (gsap: any, section: HTMLElement) => {
  if (section.dataset.contactAnimated === 'true') return;
  section.dataset.contactAnimated = 'true';

  const eyebrow = section.querySelector<HTMLElement>('.eyebrow');
  const title = section.querySelector<HTMLElement>('h2');
  const copy = section.querySelector<HTMLElement>('p');
  const button = section.querySelector<HTMLElement>('.button--primary');
  const particleWrap = section.querySelector<HTMLElement>('.contact-particles');
  const particles = Array.from(section.querySelectorAll<HTMLElement>('.contact-particles span'));

  if (!title || !particleWrap) return;

  splitContactTitle(title);
  const chars = Array.from(title.querySelectorAll<HTMLElement>('.contact-sand-char'));

  const positions = particles.map((_, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / Math.max(particles.length, 1)) * index;
    const ring = index % 3;
    const radius = 54 + ring * 26 + (index % 2) * 7;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotation: (angle * 180) / Math.PI + 90,
    };
  });

  gsap.set(chars, {
    opacity: 0,
    x: () => gsap.utils.random(-26, 26),
    y: () => gsap.utils.random(26, 92),
    rotation: () => gsap.utils.random(-11, 11),
    scale: () => gsap.utils.random(.76, 1.08),
    filter: 'blur(7px)',
  });

  gsap.set(particles, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0,
    rotation: () => gsap.utils.random(-55, 55),
    filter: 'blur(5px)',
  });

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline
    .fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .44 }, 0)
    .to(chars, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.05,
      ease: 'expo.out',
      stagger: { each: .012, from: 'random' },
    }, .12)
    .fromTo(copy, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .48 }, '-=.48')
    .fromTo(button, { opacity: 0, y: 24, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .58, ease: 'expo.out' }, '-=.34')
    .fromTo(particleWrap, { opacity: 0, scale: .72 }, { opacity: 1, scale: 1, duration: .52, ease: 'expo.out' }, '-=.42')
    .to(particles, {
      opacity: 1,
      x: (index: number) => positions[index].x,
      y: (index: number) => positions[index].y,
      rotation: (index: number) => positions[index].rotation,
      scale: 1,
      filter: 'blur(0px)',
      duration: .82,
      ease: 'expo.out',
      stagger: .03,
    }, '-=.24');

  timeline.call(() => {
    gsap.to(particleWrap, {
      rotation: 360,
      duration: 36,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });

    particles.forEach((particle, index) => {
      gsap.to(particle, {
        scale: index % 3 === 0 ? 1.2 : .86,
        opacity: index % 2 === 0 ? .92 : .5,
        duration: 1.8 + (index % 5) * .25,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    if (button) {
      button.addEventListener('pointerenter', () => {
        gsap.to(button, { y: -3, scale: 1.015, duration: .22, ease: 'power2.out' });
      });
      button.addEventListener('pointerleave', () => {
        gsap.to(button, { y: 0, scale: 1, duration: .28, ease: 'power2.out' });
      });
    }
  });
};

const waitForContact = (attempt = 0) => {
  const section = document.querySelector<HTMLElement>('.contact');
  const gsap = (window as any).gsap;

  if (!section || !gsap) {
    if (attempt < 120) requestAnimationFrame(() => waitForContact(attempt + 1));
    return;
  }

  if (section.dataset.contactGsapReady === 'true') return;
  section.dataset.contactGsapReady = 'true';
  section.classList.add('contact--motion');

  section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateContact(gsap, section);
        observer.unobserve(entry.target);
      });
    },
    { threshold: .24 },
  );

  observer.observe(section);
};

export const initContactMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForContact(), { once: true });
    return;
  }

  requestAnimationFrame(() => waitForContact());
};
