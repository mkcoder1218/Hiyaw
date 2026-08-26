type GsapInstance = {
  timeline: (vars?: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => any;
  to: (targets: any, vars: Record<string, unknown>) => any;
  fromTo: (targets: any, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => any;
};

declare global {
  interface Window {
    gsap?: GsapInstance;
  }
}

type Point = { x: number; y: number };

const getCenterPoint = (element: Element, containerRect: DOMRect): Point => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
};

const buildWirePath = (start: Point, end: Point) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // The curve always starts at HYAW and terminates at the exact center of the target node.
  // The controls are derived from the real DOM positions, so the wire cannot visually drift
  // away from a node when the viewport changes size.
  const c1 = {
    x: start.x + dx * 0.34,
    y: start.y + dy * 0.08,
  };
  const c2 = {
    x: start.x + dx * 0.73,
    y: end.y - dy * 0.11,
  };

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

const initSection = (section: HTMLElement, gsap: GsapInstance) => {
  const field = section.querySelector<HTMLElement>('.collaboration-field');
  const svg = section.querySelector<SVGSVGElement>('.collaboration-lines');
  const center = section.querySelector<HTMLElement>('.collab-center');
  const nodes = Array.from(section.querySelectorAll<HTMLElement>('.collab-node'));
  const wires = Array.from(section.querySelectorAll<SVGPathElement>('.collaboration-lines path'));
  const eyebrow = section.querySelector<HTMLElement>('.collab-intro .eyebrow');
  const heading = section.querySelector<HTMLElement>('.collab-intro h2');
  const introCopy = section.querySelector<HTMLElement>('.collab-intro p');
  const footer = section.querySelector<HTMLElement>('.collab-footer');

  if (!field || !svg || !center || nodes.length === 0 || wires.length === 0) return;

  section.classList.add('collaboration--gsap');

  let hasPlayed = false;
  let resizeFrame = 0;

  const layoutWires = () => {
    const fieldRect = field.getBoundingClientRect();
    const width = Math.max(1, field.clientWidth);
    const height = Math.max(1, field.clientHeight);

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    const start = getCenterPoint(center, fieldRect);

    wires.forEach((wire, index) => {
      const node = nodes[index];
      if (!node) return;

      const end = getCenterPoint(node, fieldRect);
      wire.setAttribute('d', buildWirePath(start, end));

      const length = wire.getTotalLength();
      if (hasPlayed) {
        wire.style.strokeDasharray = 'none';
        wire.style.strokeDashoffset = '0';
      } else {
        wire.style.strokeDasharray = `${length}`;
        wire.style.strokeDashoffset = `${length}`;
      }
    });
  };

  const onResize = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(layoutWires);
  };

  // Let layout settle before measuring absolute node positions.
  window.requestAnimationFrame(() => {
    layoutWires();
    window.requestAnimationFrame(layoutWires);
  });

  window.addEventListener('resize', onResize, { passive: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    hasPlayed = true;
    layoutWires();
    return;
  }

  gsap.set([eyebrow, heading, introCopy, footer], { opacity: 0, y: 22 });
  gsap.set(center, { opacity: 0, scale: 0.82, transformOrigin: '50% 50%' });
  gsap.set(nodes, { opacity: 0, scale: 0.88, transformOrigin: '50% 50%' });
  gsap.set(wires, { opacity: 0.72 });

  const play = () => {
    if (hasPlayed) return;

    // Re-measure right before playback so every wire is anchored to the live node geometry.
    layoutWires();

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.45 })
      .to(heading, { opacity: 1, y: 0, duration: 0.72 }, '-=0.2')
      .to(introCopy, { opacity: 1, y: 0, duration: 0.55 }, '-=0.38')
      .to(center, { opacity: 1, scale: 1, duration: 0.62, ease: 'back.out(1.45)' }, '-=0.12');

    wires.forEach((wire, index) => {
      timeline
        .to(
          wire,
          {
            strokeDashoffset: 0,
            duration: 0.78,
            ease: 'power2.inOut',
          },
          index === 0 ? '>-0.05' : '>-0.5',
        )
        .to(
          nodes[index],
          {
            opacity: 1,
            scale: 1,
            duration: 0.48,
            ease: 'back.out(1.35)',
          },
          '<0.42',
        );
    });

    timeline
      .to(footer, { opacity: 1, y: 0, duration: 0.62 }, '>-0.22')
      .call(() => {
        hasPlayed = true;
        wires.forEach((wire) => {
          wire.style.strokeDasharray = 'none';
          wire.style.strokeDashoffset = '0';
        });
      });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    },
    { threshold: 0.28 },
  );

  observer.observe(section);

  nodes.forEach((node, index) => {
    const wire = wires[index];
    if (!wire) return;

    node.addEventListener('mouseenter', () => {
      gsap.to(node, { scale: 1.035, duration: 0.22, ease: 'power2.out' });
      gsap.to(wire, { opacity: 1, strokeWidth: 2.15, duration: 0.22 });
    });

    node.addEventListener('mouseleave', () => {
      gsap.to(node, { scale: 1, duration: 0.22, ease: 'power2.out' });
      gsap.to(wire, { opacity: 0.72, strokeWidth: 1.4, duration: 0.22 });
    });
  });
};

const waitForCollaboration = (attempt = 0) => {
  const section = document.querySelector<HTMLElement>('.collaboration');
  const gsap = window.gsap;

  if (!section || !gsap) {
    if (attempt < 120) window.requestAnimationFrame(() => waitForCollaboration(attempt + 1));
    return;
  }

  if (section.dataset.collaborationGsapReady === 'true') return;
  section.dataset.collaborationGsapReady = 'true';
  initSection(section, gsap);
};

export const initCollaborationMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForCollaboration(), { once: true });
    return;
  }

  window.requestAnimationFrame(() => waitForCollaboration());
};

export {};
