const PHONE_E164 = '+251962459693';
const PHONE_DISPLAY = '+251 962 459 693';

let installed = false;
let observer: MutationObserver | null = null;

const applyContactDetails = () => {
  const section = document.querySelector<HTMLElement>('.contact');
  if (!section) return false;

  const callButton = section.querySelector<HTMLAnchorElement>('.contact-call');
  if (!callButton) return false;

  const targetHref = `tel:${PHONE_E164}`;
  const targetAria = `Call Hyaw at ${PHONE_DISPLAY}`;
  const targetLabel = `Call ${PHONE_DISPLAY}`;

  if (callButton.getAttribute('href') !== targetHref) {
    callButton.setAttribute('href', targetHref);
  }

  if (callButton.getAttribute('aria-label') !== targetAria) {
    callButton.setAttribute('aria-label', targetAria);
  }

  const label = callButton.querySelector<HTMLElement>('span:first-child');
  if (label && label.textContent !== targetLabel) {
    label.textContent = targetLabel;
  }

  section.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((anchor) => {
    if (anchor.getAttribute('href') !== targetHref) {
      anchor.setAttribute('href', targetHref);
    }

    if (!anchor.classList.contains('contact-call') && anchor.textContent !== PHONE_DISPLAY) {
      anchor.textContent = PHONE_DISPLAY;
    }
  });

  return true;
};

export const initContactDetails = () => {
  if (installed) return;
  installed = true;

  if (applyContactDetails()) return;

  observer = new MutationObserver(() => {
    if (!applyContactDetails()) return;

    // The contact UI has been created and normalized. Stop observing so we do
    // not keep reacting to unrelated React/GSAP DOM mutations.
    observer?.disconnect();
    observer = null;
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};
