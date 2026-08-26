type GsapLike = {
  to: (targets: any, vars: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => any;
};

declare global {
  interface Window {
    gsap?: GsapLike;
  }
}

const sectionIds = ['work', 'services', 'about', 'insights', 'contact'] as const;

const ensureContactNav = () => {
  const desktop = document.querySelector<HTMLElement>('.desktop-nav');
  const mobile = document.querySelector<HTMLElement>('.mobile-menu');

  if (desktop && !desktop.querySelector('a[href="#contact"]')) {
    const link = document.createElement('a');
    link.href = '#contact';
    link.textContent = 'Contact';
    desktop.appendChild(link);
  }

  if (mobile && !mobile.querySelector('a[href="#contact"]')) {
    const link = document.createElement('a');
    link.href = '#contact';
    link.textContent = 'Contact';
    mobile.appendChild(link);
  }
};

const getActiveSection = () => {
  const viewportProbe = window.innerHeight * 0.34;
  let active: string | null = null;

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportProbe && rect.bottom > viewportProbe) active = id;
  });

  return active;
};

const updatePill = (gsap: GsapLike | undefined, activeLink: HTMLAnchorElement | null) => {
  const nav = document.querySelector<HTMLElement>('.desktop-nav');
  const pill = nav?.querySelector<HTMLElement>('.nav-active-pill');
  if (!nav || !pill) return;

  if (!activeLink) {
    if (gsap) gsap.to(pill, { width: 0, opacity: 0, duration: .22, ease: 'power2.out' });
    else {
      pill.style.width = '0px';
      pill.style.opacity = '0';
    }
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const x = linkRect.left - navRect.left;
  const width = linkRect.width;

  if (gsap) {
    gsap.to(pill, { x, width, opacity: 1, duration: .38, ease: 'power3.out' });
  } else {
    pill.style.transform = `translateX(${x}px)`;
    pill.style.width = `${width}px`;
    pill.style.opacity = '1';
  }
};

const activate = (id: string | null) => {
  const gsap = window.gsap;
  const desktopLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a[href^="#"]'));
  const mobileLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.mobile-menu a[href^="#"]'));

  let activeDesktop: HTMLAnchorElement | null = null;

  [...desktopLinks, ...mobileLinks].forEach((link) => {
    const isActive = id ? link.getAttribute('href') === `#${id}` : false;
    link.classList.toggle('is-active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
    if (isActive && desktopLinks.includes(link)) activeDesktop = link;
  });

  updatePill(gsap, activeDesktop);
};

const waitForNav = (attempt = 0) => {
  const nav = document.querySelector<HTMLElement>('.desktop-nav');
  if (!nav) {
    if (attempt < 120) requestAnimationFrame(() => waitForNav(attempt + 1));
    return;
  }

  ensureContactNav();

  if (!nav.querySelector('.nav-active-pill')) {
    const pill = document.createElement('span');
    pill.className = 'nav-active-pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.appendChild(pill);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      activate(getActiveSection());
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
};

export const initNavScrollSpy = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForNav(), { once: true });
    return;
  }
  requestAnimationFrame(() => waitForNav());
};

export {};
