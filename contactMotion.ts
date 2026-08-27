const splitContactTitle = (element: HTMLElement) => {
  if (element.dataset.contactSandSplit === 'true') return;

  const accessibleText = element.innerText.replace(/\s+/g, ' ').trim();
  if (!accessibleText) return;

  element.dataset.contactSandSplit = 'true';
  element.setAttribute('aria-label', accessibleText);

  const fragment = document.createDocumentFragment();
  accessibleText.split(/(\s+)/).forEach((chunk) => {
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

const setButtonText = (button: HTMLAnchorElement, label: string) => {
  const textNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.textContent = `${label} `;
  else button.prepend(document.createTextNode(`${label} `));
};

const enhanceContact = (section: HTMLElement) => {
  if (section.dataset.contactEnhanced === 'true') return;
  section.dataset.contactEnhanced = 'true';

  const grid = section.querySelector<HTMLElement>('.contact-grid');
  const copy = grid?.firstElementChild as HTMLElement | null;
  const particles = section.querySelector<HTMLElement>('.contact-particles');
  if (!grid || !copy || !particles) return;

  copy.classList.add('contact-copy');

  const paragraph = copy.querySelector('p');
  const button = copy.querySelector<HTMLAnchorElement>('.button--primary');

  const status = document.createElement('div');
  status.className = 'contact-status';
  status.textContent = 'Open for selected projects · Addis Ababa / Remote';
  paragraph?.insertAdjacentElement('afterend', status);

  const options = document.createElement('div');
  options.className = 'contact-options';
  options.setAttribute('aria-label', 'Project type');

  ['New product', 'Existing system', 'Partnership'].forEach((label, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `contact-option${index === 0 ? ' is-selected' : ''}`;
    option.textContent = label;
    option.addEventListener('click', () => {
      options.querySelectorAll('.contact-option').forEach((node) => node.classList.remove('is-selected'));
      option.classList.add('is-selected');
      if (button) {
        const subject = encodeURIComponent(`Hyaw inquiry · ${label}`);
        button.href = `mailto:hello@hyaw.tech?subject=${subject}`;
      }
    });
    options.appendChild(option);
  });

  if (button) copy.insertBefore(options, button);
  else copy.appendChild(options);

  const actions = document.createElement('div');
  actions.className = 'contact-actions';

  if (button) {
    button.classList.add('contact-email');
    button.href = 'mailto:hello@hyaw.tech?subject=Hyaw%20inquiry%20%C2%B7%20New%20product';
    button.setAttribute('aria-label', 'Email Hyaw');
    setButtonText(button, 'Email us');
    button.parentNode?.insertBefore(actions, button);
    actions.appendChild(button);
  }

  const call = document.createElement('a');
  call.className = 'button button--quiet contact-call';
  call.href = 'tel:+251962459693';
  call.setAttribute('aria-label', 'Call Hyaw at +251 962 459 693');
  call.innerHTML = '<span>Call +251 962 459 693</span><span aria-hidden="true">↗</span>';
  actions.appendChild(call);

  if (!actions.parentElement) copy.appendChild(actions);

  const direct = document.createElement('div');
  direct.className = 'contact-direct';
  direct.innerHTML = `
    <div><small>Email</small><a href="mailto:hello@hyaw.tech">hello@hyaw.tech</a></div>
    <div><small>Call</small><a href="tel:+251962459693">+251 962 459 693</a></div>
    <div><small>Base</small><strong>Addis Ababa, Ethiopia</strong></div>
    <div><small>Best fit</small><strong>Products · Systems · Platforms</strong></div>
  `;
  copy.appendChild(direct);

  const core = document.createElement('div');
  core.className = 'contact-signal-core';
  core.innerHTML = '<span>HYAW</span><small>OPEN CHANNEL</small>';

  const orbitLabels = ['Product', 'Systems', 'Engineering', 'Growth'].map((label, index) => {
    const item = document.createElement('span');
    item.className = `contact-orbit-label contact-orbit-label--${index + 1}`;
    item.textContent = label;
    return item;
  });

  const caption = document.createElement('div');
  caption.className = 'contact-signal-caption';
  caption.textContent = 'Signal in · shape the problem · build the system';

  particles.append(core, ...orbitLabels, caption);
};

const prepareContact = (gsap: any, section: HTMLElement) => {
  if (section.dataset.contactPrepared === 'true') return;
  section.dataset.contactPrepared = 'true';

  const eyebrow = section.querySelector<HTMLElement>('.eyebrow');
  const title = section.querySelector<HTMLElement>('h2');
  const copyText = section.querySelector<HTMLElement>('.contact-copy > p');
  const status = section.querySelector<HTMLElement>('.contact-status');
  const options = Array.from(section.querySelectorAll<HTMLElement>('.contact-option'));
  const actionButtons = Array.from(section.querySelectorAll<HTMLElement>('.contact-actions a'));
  const directItems = Array.from(section.querySelectorAll<HTMLElement>('.contact-direct > div'));
  const particleWrap = section.querySelector<HTMLElement>('.contact-particles');
  const particles = Array.from(section.querySelectorAll<HTMLElement>('.contact-particles > span:not(.contact-orbit-label)'));
  const core = section.querySelector<HTMLElement>('.contact-signal-core');
  const orbitLabels = Array.from(section.querySelectorAll<HTMLElement>('.contact-orbit-label'));
  const signalCaption = section.querySelector<HTMLElement>('.contact-signal-caption');

  if (!title || !particleWrap) return;

  splitContactTitle(title);
  const chars = Array.from(title.querySelectorAll<HTMLElement>('.contact-sand-char'));

  gsap.set(eyebrow, { opacity: 0, y: 16 });
  gsap.set(chars, {
    opacity: 0,
    x: () => gsap.utils.random(-28, 28),
    y: () => gsap.utils.random(28, 96),
    rotation: () => gsap.utils.random(-11, 11),
    scale: () => gsap.utils.random(.74, 1.1),
    filter: 'blur(7px)',
  });
  gsap.set(copyText, { opacity: 0, y: 18 });
  gsap.set(status, { opacity: 0, x: -14 });
  gsap.set(options, { opacity: 0, y: 18, scale: .94 });
  gsap.set(actionButtons, { opacity: 0, y: 24, scale: .94 });
  gsap.set(directItems, { opacity: 0, y: 16 });
  gsap.set(particleWrap, { opacity: 0, scale: .76, rotation: -7 });
  gsap.set(core, { opacity: 0, scale: .55, filter: 'blur(8px)' });
  gsap.set(orbitLabels, { opacity: 0, scale: .72, y: 12 });
  gsap.set(signalCaption, { opacity: 0, y: 12 });
  gsap.set(particles, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0,
    rotation: () => gsap.utils.random(-60, 60),
    filter: 'blur(5px)',
  });
};

const animateContact = (gsap: any, section: HTMLElement) => {
  if (section.dataset.contactAnimated === 'true') return;
  section.dataset.contactAnimated = 'true';
  prepareContact(gsap, section);

  const eyebrow = section.querySelector<HTMLElement>('.eyebrow');
  const title = section.querySelector<HTMLElement>('h2');
  const copyText = section.querySelector<HTMLElement>('.contact-copy > p');
  const status = section.querySelector<HTMLElement>('.contact-status');
  const options = Array.from(section.querySelectorAll<HTMLElement>('.contact-option'));
  const actionButtons = Array.from(section.querySelectorAll<HTMLElement>('.contact-actions a'));
  const directItems = Array.from(section.querySelectorAll<HTMLElement>('.contact-direct > div'));
  const particleWrap = section.querySelector<HTMLElement>('.contact-particles');
  const particles = Array.from(section.querySelectorAll<HTMLElement>('.contact-particles > span:not(.contact-orbit-label)'));
  const core = section.querySelector<HTMLElement>('.contact-signal-core');
  const orbitLabels = Array.from(section.querySelectorAll<HTMLElement>('.contact-orbit-label'));
  const signalCaption = section.querySelector<HTMLElement>('.contact-signal-caption');

  if (!title || !particleWrap) return;

  const chars = Array.from(title.querySelectorAll<HTMLElement>('.contact-sand-char'));
  const positions = particles.map((_, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / Math.max(particles.length, 1)) * index;
    const ring = index % 3;
    const radius = 82 + ring * 38 + (index % 2) * 9;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotation: (angle * 180) / Math.PI + 90,
    };
  });

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline
    .to(eyebrow, { opacity: 1, y: 0, duration: .44 }, 0)
    .to(chars, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.08,
      ease: 'expo.out',
      stagger: { each: .012, from: 'random' },
    }, .1)
    .to(copyText, { opacity: 1, y: 0, duration: .48 }, '-=.46')
    .to(status, { opacity: 1, x: 0, duration: .42 }, '-=.3')
    .to(options, { opacity: 1, y: 0, scale: 1, duration: .42, stagger: .07, ease: 'back.out(1.35)' }, '-=.24')
    .to(actionButtons, { opacity: 1, y: 0, scale: 1, duration: .52, stagger: .09, ease: 'expo.out' }, '-=.25')
    .to(directItems, { opacity: 1, y: 0, duration: .4, stagger: .08 }, '-=.22')
    .to(particleWrap, { opacity: 1, scale: 1, rotation: 0, duration: .58, ease: 'expo.out' }, '-=.52')
    .to(core, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .65, ease: 'back.out(1.4)' }, '-=.36')
    .to(particles, {
      opacity: 1,
      x: (index: number) => positions[index].x,
      y: (index: number) => positions[index].y,
      rotation: (index: number) => positions[index].rotation,
      scale: 1,
      filter: 'blur(0px)',
      duration: .9,
      ease: 'expo.out',
      stagger: .028,
    }, '-=.28')
    .to(orbitLabels, { opacity: 1, scale: 1, y: 0, duration: .42, stagger: .08, ease: 'back.out(1.3)' }, '-=.42')
    .to(signalCaption, { opacity: 1, y: 0, duration: .4 }, '-=.26');

  timeline.call(() => {
    gsap.to(particleWrap, {
      rotation: 360,
      duration: 44,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });

    particles.forEach((particle, index) => {
      gsap.to(particle, {
        scale: index % 3 === 0 ? 1.2 : .86,
        opacity: index % 2 === 0 ? .92 : .52,
        duration: 1.8 + (index % 5) * .25,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    if (core) {
      gsap.to(core, {
        scale: 1.045,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    orbitLabels.forEach((label, index) => {
      gsap.to(label, {
        y: index % 2 === 0 ? -5 : 5,
        x: index % 2 === 0 ? 3 : -3,
        duration: 3 + index * .35,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    actionButtons.forEach((action) => {
      action.addEventListener('pointerenter', () => {
        gsap.to(action, { y: -3, scale: 1.015, duration: .22, ease: 'power2.out' });
      });
      action.addEventListener('pointerleave', () => {
        gsap.to(action, { y: 0, scale: 1, duration: .28, ease: 'power2.out' });
      });
    });
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
  enhanceContact(section);

  section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Prepare before the section is observed so nothing is shown in its completed
  // state and then rewound after the user scrolls farther into the viewport.
  prepareContact(gsap, section);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateContact(gsap, section);
        observer.unobserve(entry.target);
      });
    },
    { threshold: .2, rootMargin: '0px 0px -8% 0px' },
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
