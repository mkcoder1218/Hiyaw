import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import './hero-animation.css';
import './collaboration-animation.css';
import './project-layout-fixes.css';
import './work-services-animation.css';
import './manifesto-process.css';
import './about-animation.css';
import App from './App';
import { initHeroMotion } from './heroMotion';
import { initCollaborationMotion } from './collaborationMotion';
import { initMobileProjectMotion } from './mobileProjectMotion';
import { initWorkServicesMotion } from './workServicesMotion';
import { initManifestoProcessMotion } from './manifestoProcessMotion';
import { initAboutMotion } from './aboutMotion';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

initHeroMotion();
initCollaborationMotion();
initMobileProjectMotion();
initWorkServicesMotion();
initManifestoProcessMotion();
initAboutMotion();
