type GsapLike = {
  timeline: (vars?: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => any;
  to: (targets: any, vars: Record<string, unknown>) => any;
  fromTo: (targets: any, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => any;
};

const enhanceEnterpriseMarkup = (work: HTMLElement) => {
  if (work.dataset.selectedEnhanced === 'true') return;
  work.dataset.selectedEnhanced = 'true';
  work.classList.add('work--selected-redesign');

  const enterprise = work.querySelector<HTMLElement>('.project--enterprise');
  if (!enterprise) return;
  enterprise.classList.add('enterprise--enhanced');

  const title = enterprise.querySelector<HTMLElement>('.project-copy h3');
  if (title && title.dataset.linesReady !== 'true') {
    title.dataset.linesReady = 'true';
    const lines = title.innerText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    title.setAttribute('aria-label', lines.join(' '));
    title.innerHTML = '';
    lines.forEach((line) => {
      const span = document.createElement('span');
      span.className = 'enterprise-title-line';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = line;
      title.appendChild(span);
    });
  }

  const visual = enterprise.querySelector<HTMLElement>('.project-visual--desktop');
  if (!visual || visual.dataset.layersReady === 'true') return;
  visual.dataset.layersReady = 'true';

  const backOne = document.createElement('div');
  backOne.className = 'enterprise-visual-back enterprise-visual-back--1';

  const backTwo = document.createElement('div');
  backTwo.className = 'enterprise-visual-back enterprise-visual-back--2';

  visual.prepend(backTwo);
  visual.prepend(backOne);

  const sync = document.createElement('div');
  sync.className = 'enterprise-mini enterprise-mini--sync';
  sync.innerHTML = `
    <small>System sync</small>
    <strong>LIVE</strong>
    <p>services · workers · queues</p>
  `;

  const health = document.createElement('div');
  health.className = 'enterprise-mini enterprise-mini--health';
  health.innerHTML = `
    <small>Product health</small>
    <strong>98.7%</strong>
    <div class="enterprise-mini-bars"><i></i><i></i><i></i><i></i><i></i></div>
  `;

  visual.append(sync, health);
};

const prepareIntro = (gsap: GsapLike, head: HTMLElement) => {
  if (head.dataset.gsapSelectedIntroPrepared === 'true') return;
  head.dataset.gsapSelectedIntroPrepared = 'true';
  head.classList.add('is-visible');

  const eyebrow = head.querySelector<HTMLElement>('.eyebrow');
  const title = head.querySelector<HTMLElement>('h2');
  const copy = head.querySelector<HTMLElement>('p');

  gsap.set(eyebrow, { opacity: 0, y: 14 });
  gsap.set(title, { opacity: 0, y: 44, filter: 'blur(8px)', clipPath: 'inset(0 0 100% 0)' });
  gsap.set(copy, { opacity: 0, y: 20 });
};

const prepareEnterprise = (gsap: GsapLike, enterprise: HTMLElement) => {
  if (enterprise.dataset.gsapEnterprisePrepared === 'true') return;
  enterprise.dataset.gsapEnterprisePrepared = 'true';
  enterprise.classList.add('is-visible');

  const index = enterprise.querySelector<HTMLElement>('.project-index');
  const titleLines = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-title-line'));
  const description = enterprise.querySelector<HTMLElement>('.project-copy > p');
  const meta = enterprise.querySelector<HTMLElement>('.project-meta');
  const link = enterprise.querySelector<HTMLElement>('.project-copy > a');
  const preview = enterprise.querySelector<HTMLElement>('.project-visual--desktop .interface-preview');
  const backs = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-visual-back'));
  const minis = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-mini'));
  const sidebar = Array.from(enterprise.querySelectorAll<HTMLElement>('.interface-sidebar i'));
  const lines = Array.from(enterprise.querySelectorAll<HTMLElement>('.ui-heading, .ui-line'));
  const cards = Array.from(enterprise.querySelectorAll<HTMLElement>('.ui-grid span'));
  const bars = Array.from(enterprise.querySelectorAll<HTMLElement>('.interface-chart span, .enterprise-mini-bars i'));

  gsap.set(index, { opacity: 0, y: 14 });
  gsap.set(titleLines, { opacity: 0, y: 52, rotationX: -15, filter: 'blur(5px)' });
  gsap.set([description, meta, link].filter(Boolean), { opacity: 0, y: 20 });
  gsap.set(backs, { opacity: 0, scale: 0.9, y: 24, filter: 'blur(8px)' });
  gsap.set(preview, { opacity: 0, x: 72, y: 18, scale: 0.94, rotationY: -5, filter: 'blur(8px)' });
  gsap.set(sidebar, { opacity: 0, x: -10, scaleX: 0.6 });
  gsap.set(lines, { opacity: 0, scaleX: 0.38, transformOrigin: '0% 50%' });
  gsap.set(cards, { opacity: 0, y: 12, scale: 0.9 });
  gsap.set(bars, { opacity: 0, scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set(minis, { opacity: 0, y: 22, scale: 0.86, filter: 'blur(7px)' });
};

const animateIntro = (gsap: GsapLike, head: HTMLElement) => {
  if (head.dataset.gsapSelectedIntro === 'true') return;
  head.dataset.gsapSelectedIntro = 'true';
  prepareIntro(gsap, head);

  const eyebrow = head.querySelector<HTMLElement>('.eyebrow');
  const title = head.querySelector<HTMLElement>('h2');
  const copy = head.querySelector<HTMLElement>('p');

  const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
  timeline
    .to(eyebrow, { opacity: 1, y: 0, duration: 0.42 })
    .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)', duration: 0.85 }, '-=0.12')
    .to(copy, { opacity: 1, y: 0, duration: 0.48 }, '-=0.4');
};

const animateEnterprise = (gsap: GsapLike, enterprise: HTMLElement) => {
  if (enterprise.dataset.gsapEnterprise === 'true') return;
  enterprise.dataset.gsapEnterprise = 'true';
  prepareEnterprise(gsap, enterprise);

  const index = enterprise.querySelector<HTMLElement>('.project-index');
  const titleLines = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-title-line'));
  const description = enterprise.querySelector<HTMLElement>('.project-copy > p');
  const meta = enterprise.querySelector<HTMLElement>('.project-meta');
  const link = enterprise.querySelector<HTMLElement>('.project-copy > a');
  const visual = enterprise.querySelector<HTMLElement>('.project-visual--desktop');
  const preview = visual?.querySelector<HTMLElement>('.interface-preview');
  const backs = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-visual-back'));
  const minis = Array.from(enterprise.querySelectorAll<HTMLElement>('.enterprise-mini'));
  const sidebar = Array.from(enterprise.querySelectorAll<HTMLElement>('.interface-sidebar i'));
  const lines = Array.from(enterprise.querySelectorAll<HTMLElement>('.ui-heading, .ui-line'));
  const cards = Array.from(enterprise.querySelectorAll<HTMLElement>('.ui-grid span'));
  const bars = Array.from(enterprise.querySelectorAll<HTMLElement>('.interface-chart span, .enterprise-mini-bars i'));

  if (!visual || !preview) return;

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.to(index, { opacity: 1, y: 0, duration: 0.4 });

  if (titleLines.length) {
    tl.to(titleLines, { opacity: 1, y: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.78, stagger: 0.085 }, '-=0.08');
  }

  tl.to([description, meta, link].filter(Boolean), { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.38')
    .to(backs, { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 }, '-=0.45')
    .to(preview, { opacity: 1, x: 0, y: 0, scale: 1, rotationY: 0, filter: 'blur(0px)', duration: 0.92 }, '-=0.42')
    .to(sidebar, { opacity: 1, x: 0, scaleX: 1, duration: 0.3, stagger: 0.035 }, '-=0.48')
    .to(lines, { opacity: 1, scaleX: 1, duration: 0.35, stagger: 0.045 }, '-=0.34')
    .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.055 }, '-=0.18')
    .to(bars, { opacity: 1, scaleY: 1, duration: 0.38, stagger: 0.04 }, '-=0.25')
    .to(minis, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'back.out(1.35)' }, '-=0.45')
    .call(() => {
      gsap.to(preview, { y: -7, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      backs.forEach((layer, layerIndex) => {
        gsap.to(layer, {
          x: layerIndex === 0 ? 9 : -9,
          y: layerIndex === 0 ? 5 : -5,
          duration: 4.1 + layerIndex * 0.45,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
      minis.forEach((mini, miniIndex) => {
        gsap.to(mini, {
          y: miniIndex === 0 ? -5 : 6,
          duration: 2.8 + miniIndex * 0.35,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    });
};

const waitForSelectedWork = (attempt = 0) => {
  const work = document.querySelector<HTMLElement>('.work');
  const gsap = (window as any).gsap as GsapLike | undefined;

  if (!work || !gsap) {
    if (attempt < 120) requestAnimationFrame(() => waitForSelectedWork(attempt + 1));
    return;
  }

  enhanceEnterpriseMarkup(work);

  const head = work.querySelector<HTMLElement>(':scope > .section-head');
  const enterprise = work.querySelector<HTMLElement>('.project--enterprise');
  if (!head || !enterprise) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    head.classList.add('is-visible');
    enterprise.classList.add('is-visible');
    return;
  }

  // Prepare before observing so the first visible frame is already the intended
  // animation start pose instead of the finished UI.
  prepareIntro(gsap, head);
  prepareEnterprise(gsap, enterprise);

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        if (target === head) animateIntro(gsap, head);
        if (target === enterprise) animateEnterprise(gsap, enterprise);
        instance.unobserve(target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );

  observer.observe(head);
  observer.observe(enterprise);
};

export const initSelectedWorkMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForSelectedWork(), { once: true });
    return;
  }
  requestAnimationFrame(() => waitForSelectedWork());
};

export {};
