const founderProfiles = [
  {
    selector: '.founder--biruk',
    story:
      'Leads the business side of Hyaw — shaping partnerships, growth, positioning, and the commercial direction around the products we build.',
    focus: ['Business strategy', 'Partnerships', 'Growth'],
  },
  {
    selector: '.founder--mikeyas',
    story:
      'Leads product and engineering — turning complex problems into clear systems, technical decisions, and software that can survive production.',
    focus: ['Product systems', 'Architecture', 'Engineering'],
  },
];

const enhanceFounder = (profile: (typeof founderProfiles)[number]) => {
  const founder = document.querySelector<HTMLElement>(profile.selector);
  if (!founder || founder.dataset.profileEnhanced === 'true') return;

  const meta = founder.querySelector<HTMLElement>('.founder-meta');
  if (!meta) return;

  founder.dataset.profileEnhanced = 'true';

  // Keep each founder represented by one primary portrait only.
  // The previous duplicated/magnified face capture has been removed.
  founder.querySelectorAll('.founder-face-lens').forEach((lens) => lens.remove());

  const story = document.createElement('p');
  story.className = 'founder-story';
  story.textContent = profile.story;

  const focus = document.createElement('div');
  focus.className = 'founder-focus';
  focus.setAttribute('aria-label', 'Primary areas of focus');

  profile.focus.forEach((item) => {
    const tag = document.createElement('span');
    tag.textContent = item;
    focus.appendChild(tag);
  });

  meta.append(story, focus);
};

export const initFounderShowcase = () => {
  const run = () => founderProfiles.forEach(enhanceFounder);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(run), { once: true });
    return;
  }

  requestAnimationFrame(run);
};
