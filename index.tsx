import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import './hero-animation.css';
import './collaboration-animation.css';
import './project-layout-fixes.css';
import './work-services-animation.css';
import './manifesto-process.css';
import './about-animation.css';
import './founder-showcase.css';
import './contact-animation.css';
import './selected-work-redesign.css';
import './nav-scrollspy.css';
import './mobile-responsive-fixes.css';
import './viewport-scenes.css';
import App from './App';
import { initHeroMotion } from './heroMotion';
import { initCollaborationMotion } from './collaborationMotion';
import { initMobileProjectMotion } from './mobileProjectMotion';
import { initWorkServicesMotion } from './workServicesMotion';
import { initManifestoProcessMotion } from './manifestoProcessMotion';
import { initAboutMotion } from './aboutMotion';
import { initFounderShowcase } from './founderShowcase';
import { initContactMotion } from './contactMotion';
import { initSelectedWorkMotion } from './selectedWorkMotion';
import { initNavScrollSpy } from './navScrollSpy';
import { initMotionCatchUp } from './motionCatchUp';
import { initHabeshaCollageSwap } from './habeshaCollageSwap';
import { initContactDetails } from './contactDetails';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Install this before React mounts the collage. The MutationObserver swaps the
// legacy image sources during the same DOM commit, so cached old photos cannot
// flash back onto the page while React is rendering.
initHabeshaCollageSwap();

// Keep the public contact information authoritative even though the richer
// contact UI is assembled dynamically after React mounts.
initContactDetails();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Install the observer isolation before any section-specific motion module.
// Each viewport scene now owns its own trigger, while fast scrolling only
// speeds up the animation that is already playing.
initMotionCatchUp();

initHeroMotion();
initCollaborationMotion();
initMobileProjectMotion();
initWorkServicesMotion();
initManifestoProcessMotion();
initFounderShowcase();
initAboutMotion();
initContactMotion();
initSelectedWorkMotion();
initNavScrollSpy();
