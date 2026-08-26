const PHONE_E164 = '+251962459693';
const PHONE_DISPLAY = '+251 962 459 693';

let installed = false;
let observer: MutationObserver | null = null;

const applyContactDetails = () => {
  const section = document.querySelector<HTMLElement>('.contact');
  if (!section) return false;

  const callButton = section.querySelector<HTMLAnchorElement>('.contact-call');
  if (callButton) {
    callButton.href = `tel:${PHONE_E164}`;
    callButton.setAttribute('aria-label', `Call Hyaw at ${PHONE_DISPLAY}`);

    const label = callButton.querySelector<HTMLElement>('span:first-child');
    if (label) label.textContent = `Call ${PHONE_DISPLAY}`;
  }

  section.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((anchor) => {
    anchor.href = `tel:${PHONE_E164}`;

    if (!anchor.classList.contains('contact-call')) {
      anchor.textContent = PHONE_DISPLAY;
    }
  });

  return Boolean(callButton);
};

export const initContactDetails = () => {
  if (installed) return;
  installed = true;

  applyContactDetails();

  observer = new MutationObserver(() => {
    applyContactDetails();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};
