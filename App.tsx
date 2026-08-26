import React, { useEffect, useMemo, useState } from 'react';
import { TEAM } from './constants';

type ProcessStage = {
  number: string;
  name: string;
  short: string;
  detail: string;
};

const collaborationNodes = [
  { label: 'Founders', className: 'node-founders' },
  { label: 'Product Teams', className: 'node-product' },
  { label: 'Enterprise', className: 'node-enterprise' },
  { label: 'Operations', className: 'node-operations' },
  { label: 'Startups', className: 'node-startups' },
  { label: 'Engineering Teams', className: 'node-engineering' },
];

const services = [
  ['01', 'Product & Strategy', 'Product definition, technical planning, system requirements, architecture.'],
  ['02', 'Product Design', 'UX research, interface systems, design systems, and prototyping.'],
  ['03', 'Software Engineering', 'Web apps, mobile apps, backend systems, APIs, and realtime products.'],
  ['04', 'Business Systems', 'ERP, internal platforms, workflow automation, and operations software.'],
  ['05', 'AI & Automation', 'AI-powered features, intelligent workflows, automation, and applied data.'],
  ['06', 'Cloud & Infrastructure', 'Deployment, containers, CI/CD, monitoring, and scalable infrastructure.'],
] as const;

const principles = [
  {
    number: '01',
    title: 'WE THINK\nIN SYSTEMS.',
    text: 'We consider the interface, business rules, data, infrastructure and future scale together.',
  },
  {
    number: '02',
    title: 'WE BUILD,\nNOT JUST PRESENT.',
    text: 'Ideas become valuable when they survive implementation and work in the real world.',
  },
  {
    number: '03',
    title: 'WE STAY CLOSE\nTO THE PROBLEM.',
    text: 'Understanding what is actually broken comes before choosing technology.',
  },
  {
    number: '04',
    title: 'WE CARE ABOUT\nTHE LAST 10%.',
    text: 'Performance, edge cases, interactions, and operational detail separate products from demos.',
  },
];

const processStages: ProcessStage[] = [
  {
    number: '01',
    name: 'Understand',
    short: 'Get close to the problem.',
    detail: 'We gather context, users, constraints, goals and the real operational problem before choosing a solution.',
  },
  {
    number: '02',
    name: 'Define',
    short: 'Turn ambiguity into structure.',
    detail: 'We shape scope, architecture, requirements and the boundaries of the system.',
  },
  {
    number: '03',
    name: 'Design',
    short: 'Make the system visible.',
    detail: 'Flows, interfaces and states take form while technical decisions stay connected to the experience.',
  },
  {
    number: '04',
    name: 'Build',
    short: 'Turn decisions into working software.',
    detail: 'We assemble the interface, logic, services, data and infrastructure into one working product.',
  },
  {
    number: '05',
    name: 'Validate',
    short: 'Stress the product before users do.',
    detail: 'We test edge cases, performance, failure states and the assumptions behind the product.',
  },
  {
    number: '06',
    name: 'Launch',
    short: 'Move a real product into the real world.',
    detail: 'We ship with deployment, observability and the operational confidence needed for production.',
  },
  {
    number: '07',
    name: 'Improve',
    short: 'Keep evolving the system.',
    detail: 'Feedback returns to the product so the next version starts from reality, not theory.',
  },
];

const insights = [
  ['Product engineering', 'Why product architecture should start before the framework choice.'],
  ['System design', 'How to build an internal platform that teams actually want to use.'],
  ['Engineering craft', 'Shipping the last 10%: edge cases, performance and product feel.'],
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrandMark = () => (
  <a href="#top" className="brand" aria-label="Hyaw home">
    <img src="/branding/hyaw-mark.png" alt="" />
    <span>Hyaw</span>
  </a>
);

const InterfacePreview = ({ compact = false }: { compact?: boolean }) => (
  <div className={`interface-preview ${compact ? 'interface-preview--compact' : ''}`}>
    <div className="interface-toolbar">
      <span />
      <span />
      <span />
      <b>OPERATIONS</b>
    </div>
    <div className="interface-body">
      <div className="interface-sidebar">
        <i className="active" />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="interface-content">
        <div className="ui-heading" />
        <div className="ui-line ui-line--strong" />
        <div className="ui-line" />
        <div className="ui-line ui-line--short" />
        <div className="ui-grid">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="interface-chart">
        <span style={{ height: '35%' }} />
        <span style={{ height: '55%' }} />
        <span style={{ height: '44%' }} />
        <span style={{ height: '78%' }} />
        <span style={{ height: '62%' }} />
      </div>
    </div>
  </div>
);

const Phone = ({ variant = 0 }: { variant?: number }) => (
  <div className={`phone phone--${variant}`}>
    <div className="phone-speaker" />
    <div className="phone-head" />
    <div className="phone-line phone-line--accent" />
    <div className="phone-line" />
    <div className="phone-line phone-line--short" />
    <div className="phone-stack">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const ArchitectureGraphic = () => (
  <div className="architecture-graphic" aria-hidden="true">
    <div className="arch-label arch-label--1">EXPERIENCE</div>
    <div className="arch-plane arch-plane--1">UI</div>
    <div className="arch-label arch-label--2">APPLICATION</div>
    <div className="arch-plane arch-plane--2">LOGIC</div>
    <div className="arch-label arch-label--3">SERVICES</div>
    <div className="arch-plane arch-plane--3">API</div>
    <div className="arch-label arch-label--4">DATA</div>
    <div className="arch-plane arch-plane--4">DATA</div>
    <div className="arch-label arch-label--5">INFRASTRUCTURE</div>
  </div>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(3);

  const mikeyasImage = useMemo(
    () => TEAM.find((member) => member.name === 'Mikeyas Derje')?.image,
    [],
  );

  useEffect(() => {
    const revealables = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 },
    );

    revealables.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const currentStage = processStages[activeStage];

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#insights">Insights</a>
        </nav>
        <a className="header-cta" href="#contact">
          Start a project <Arrow />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#insights" onClick={() => setMenuOpen(false)}>Insights</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Start a project</a>
        </div>
      </header>

      <main>
        <section className="hero section-pad" aria-labelledby="hero-heading">
          <div className="hero-grid hero-background-mark">
            <div className="hero-copy" data-reveal>
              <div className="eyebrow">Design · Product · Engineering</div>
              <h1 id="hero-heading">We build technology that moves businesses forward.</h1>
              <p>
                Hyaw Technologies designs and engineers digital products, platforms and systems — from the first idea to production and scale.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#contact">Start a project <Arrow /></a>
                <a className="button button--quiet" href="#work">Explore our work <Arrow /></a>
              </div>
            </div>

            <div className="hero-art" data-reveal>
              <div className="hero-code">
                <span>architecture.ts</span>
                <code>product()</code>
                <code>  .connect(data)</code>
                <code>  .ship(production)</code>
              </div>
              <div className="hero-window">
                <InterfacePreview compact />
              </div>
              <Phone variant={0} />
              <div className="hero-mini-card">
                <small>PRODUCT HEALTH</small>
                <strong>98.7%</strong>
                <div className="mini-bars"><i /><i /><i /><i /><i /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="collaboration section-pad" aria-labelledby="collaboration-heading">
          <div className="collab-intro" data-reveal>
            <div className="eyebrow">Collaboration network</div>
            <h2 id="collaboration-heading">We plug into ambitious teams.</h2>
            <p>From two-person startups to complex operating businesses.</p>
          </div>
          <div className="collaboration-field" data-reveal>
            <svg className="collaboration-lines" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
              <path d="M500 220 C390 110, 270 80, 180 110" />
              <path d="M500 220 C610 120, 760 85, 865 115" />
              <path d="M500 220 C300 235, 210 260, 115 310" />
              <path d="M500 220 C705 225, 800 250, 900 300" />
              <path d="M500 220 C410 340, 330 350, 250 370" />
              <path d="M500 220 C610 330, 700 350, 780 375" />
            </svg>
            <div className="collab-center">
              <img src="/branding/hyaw-mark.png" alt="" />
              <span>HYAW</span>
              <small>product partner</small>
            </div>
            {collaborationNodes.map((node) => (
              <div className={`collab-node ${node.className}`} key={node.label}>{node.label}</div>
            ))}
          </div>
          <div className="collab-footer" data-reveal>
            <strong>Different stage. Different problem.<br />Same job: make it work.</strong>
            <div className="tiny-tags"><span>product</span><span>design</span><span>engineering</span><span>systems</span></div>
          </div>
        </section>

        <section className="work section-pad" id="work" aria-labelledby="work-heading">
          <div className="section-head" data-reveal>
            <div>
              <div className="eyebrow">Selected work</div>
              <h2 id="work-heading">Selected work</h2>
            </div>
            <p>Systems we’ve designed, engineered and brought into the real world.</p>
          </div>

          <article className="project project--enterprise" data-reveal>
            <div className="project-copy">
              <span className="project-index">01</span>
              <h3>Enterprise<br />Operations Platform</h3>
              <p>A unified operations system designed to replace fragmented internal workflows with one connected platform.</p>
              <div className="project-meta">Business systems · Product design · Engineering</div>
              <a href="#contact">View case study <Arrow /></a>
            </div>
            <div className="project-visual project-visual--desktop"><InterfacePreview /></div>
          </article>

          <article className="project project--mobile" data-reveal>
            <div className="project-wordmark">FIELD<br />SERVICE</div>
            <div className="phones-cluster">
              <Phone variant={1} />
              <Phone variant={2} />
              <Phone variant={3} />
            </div>
            <div className="project-copy project-copy--mobile">
              <span className="project-index">02</span>
              <h3>Mobile Field<br />Service System</h3>
              <p>A realtime mobile workflow for teams working away from a desk — from assignment to completion.</p>
              <div className="project-meta">Mobile · Operations · Realtime</div>
              <a href="#contact">View case study <Arrow /></a>
            </div>
          </article>

          <article className="project project--architecture" data-reveal>
            <div className="project-copy">
              <span className="project-index">03</span>
              <h3>Architecture<br />Modernization</h3>
              <p>Turning a difficult legacy system into infrastructure that can evolve without slowing the business down.</p>
              <div className="project-meta">Architecture · APIs · Infrastructure</div>
              <a href="#contact">View case study <Arrow /></a>
            </div>
            <ArchitectureGraphic />
          </article>
        </section>

        <section className="services section-pad" id="services" aria-labelledby="services-heading">
          <div className="services-grid">
            <div className="services-intro" data-reveal>
              <div className="eyebrow">Capabilities</div>
              <h2 id="services-heading">From idea<br />to infrastructure.</h2>
              <p>We work across the complete digital product lifecycle — from defining the problem to keeping the system healthy in production.</p>
            </div>
            <div className="services-list" data-reveal>
              {services.map(([number, title, description]) => (
                <div className="service-row" key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <div className="services-orbit" data-reveal aria-hidden="true">
              <div className="orbit-card orbit-card--top">IDEA</div>
              <div className="orbit-card orbit-card--mid">PRODUCT</div>
              <div className="orbit-card orbit-card--low">SYSTEM</div>
              <div className="orbit-card orbit-card--base">INFRA</div>
            </div>
          </div>
        </section>

        <section className="surface-system section-pad" aria-labelledby="surface-heading">
          <div className="surface-grid">
            <div className="surface-title" data-reveal>
              <div className="eyebrow">Inside the product</div>
              <h2 id="surface-heading">Beautiful interfaces are only half the product.</h2>
            </div>
            <p className="surface-note" data-reveal>What users see is the finished surface. What keeps it useful is everything engineered underneath.</p>
            <div className="surface-stack" data-reveal>
              <div className="surface-layer surface-layer--back"><span>INFRA</span></div>
              <div className="surface-layer surface-layer--data"><span>DATA</span></div>
              <div className="surface-layer surface-layer--logic"><span>LOGIC</span></div>
              <div className="surface-ui"><InterfacePreview compact /></div>
            </div>
            <div className="surface-closing" data-reveal>
              We design what users see —<br />and engineer everything they don’t.
            </div>
          </div>
        </section>

        <section className="why section-pad" aria-label="Why Hyaw">
          <div className="eyebrow why-label">Why Hyaw</div>
          <div className="principles">
            {principles.map((principle, index) => (
              <article className={`principle principle--${index + 1}`} key={principle.number} data-reveal>
                <span>{principle.number}</span>
                <h3>{principle.title.split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process section-pad" aria-labelledby="process-heading">
          <div className="process-head" data-reveal>
            <div>
              <div className="eyebrow">How we work</div>
              <h2 id="process-heading">A process that moves with the system.</h2>
            </div>
            <p>The path is structured, but not rigid. We move backward or forward whenever the product requires it.</p>
          </div>

          <div className="process-nav" role="tablist" aria-label="Product process" data-reveal>
            {processStages.map((stage, index) => (
              <button
                key={stage.number}
                type="button"
                className={index === activeStage ? 'active' : ''}
                onClick={() => setActiveStage(index)}
                role="tab"
                aria-selected={index === activeStage}
              >
                <span>{stage.number}</span>
                <strong>{stage.name}</strong>
              </button>
            ))}
          </div>

          <div className="process-stage" data-reveal>
            <div className="process-copy">
              <span>{currentStage.number} / 07</span>
              <h3>{currentStage.name}</h3>
              <strong>{currentStage.short}</strong>
              <p>{currentStage.detail}</p>
            </div>
            <div className={`process-product process-product--${activeStage}`}>
              <div className="process-backplate">INFRA</div>
              <div className="process-data">DATA</div>
              <div className="process-logic">LOGIC</div>
              <div className="process-interface"><InterfacePreview compact /></div>
            </div>
          </div>
        </section>

        <section className="about section-pad" id="about" aria-labelledby="about-heading">
          <div className="habesha-collage" data-reveal>
            <div className="habesha-word">HABESHA</div>
            <div className="habesha-word habesha-word--second">BUILDERS.</div>
            <div className="habesha-caption">
              <div className="eyebrow">Addis Ababa · Ethiopia</div>
              <h2 id="about-heading">Working close<br />to the problem.</h2>
              <p>Built from context, not assumptions.</p>
            </div>
            <img className="collage-img collage-img--1" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=82" alt="Team collaborating around a table" />
            <img className="collage-img collage-img--2" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=82" alt="Product team in discussion" />
            <img className="collage-img collage-img--3" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82" alt="People working together" />
          </div>

          <div className="founders" data-reveal>
            <div className="founders-title">
              <div className="eyebrow">Built by builders</div>
              <h2>SMALL TEAM.</h2>
              <p>Hyaw is product-focused, close to the work, and serious about what ships.</p>
            </div>

            <article className="founder founder--biruk">
              <img src="/team/biruk-birhanu.jpg" alt="Biruk Birhanu" />
              <div className="founder-meta">
                <span>01</span>
                <strong>Biruk Birhanu</strong>
                <small>Co-founder · Business & Growth</small>
              </div>
            </article>

            <article className="founder founder--mikeyas">
              {mikeyasImage ? <img src={mikeyasImage} alt="Mikeyas Derje" /> : <div className="founder-placeholder">MD</div>}
              <div className="founder-meta">
                <span>02</span>
                <strong>Mikeyas Derje</strong>
                <small>Co-founder · Product & Engineering</small>
              </div>
            </article>

            <blockquote>“Understand the system behind the problem before choosing the solution.”</blockquote>
            <div className="serious-type">SERIOUS<br />ENGINEERING.</div>
          </div>
        </section>

        <section className="insights section-pad" id="insights" aria-labelledby="insights-heading">
          <div className="section-head" data-reveal>
            <div>
              <div className="eyebrow">Notes from the work</div>
              <h2 id="insights-heading">Thinking out loud.</h2>
            </div>
            <p>What we learn while designing, building and operating products.</p>
          </div>
          <div className="insight-grid">
            {insights.map(([category, title], index) => (
              <article key={category} data-reveal>
                <span>0{index + 1}</span>
                <small>{category}</small>
                <h3>{title}</h3>
                <a href="#contact">Read note <Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section-pad" id="contact" aria-labelledby="contact-heading">
          <div className="contact-grid">
            <div data-reveal>
              <div className="eyebrow">Start a conversation</div>
              <h2 id="contact-heading">Have something ambitious in mind?</h2>
              <p>Tell us what you’re trying to build, fix or rethink.</p>
              <a className="button button--primary" href="mailto:hello@hyaw.tech">Start a conversation <Arrow /></a>
            </div>
            <div className="contact-particles" aria-hidden="true" data-reveal>
              {Array.from({ length: 24 }).map((_, index) => <span key={index} style={{ '--i': index } as React.CSSProperties} />)}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <BrandMark />
        <div className="footer-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#insights">Insights</a>
          <a href="#contact">Contact</a>
        </div>
        <p>Designed & engineered by Hyaw.</p>
      </footer>
    </div>
  );
}

export default App;
