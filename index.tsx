import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import './hero-animation.css';
import './collaboration-animation.css';
import App from './App';
import { initHeroMotion } from './heroMotion';
import { initCollaborationMotion } from './collaborationMotion';

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
