
import React, { useState, useEffect, useRef } from 'react';
import { SERVICES, PROJECTS, TEAM } from './constants';
import { Message } from './types';
import { getGeminiAmbassador } from './services/geminiService';

// --- Shared Utilities ---

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 90; // Precise offset for the glass navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    window.history.pushState(null, '', `#${id}`);
  }
};

// --- Sub-components ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-4 md:px-8 py-3 shadow-2xl relative">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            window.scrollTo({top: 0, behavior: 'smooth'});
            setIsMenuOpen(false);
            window.history.pushState(null, '', '/');
          }}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-emerald-500 via-yellow-400 to-red-500 rounded-lg flex items-center justify-center font-bold text-black text-lg md:text-xl">
            H
          </div>
          <span className="text-base md:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            HIYAW
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors">About</a>
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-white transition-colors">Services</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-white transition-colors">Portfolio</a>
          <a href="#team" onClick={(e) => handleNavClick(e, 'team')} className="hover:text-white transition-colors">Team</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="px-5 py-2.5 bg-white text-black rounded-xl hover:bg-emerald-400 transition-all font-bold">Contact Us</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 md:hidden scale-in-center">
            <div className="glass rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-center">
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-lg font-bold text-white py-2">About</a>
              <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="text-lg font-bold text-white py-2">Services</a>
              <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-lg font-bold text-white py-2">Portfolio</a>
              <a href="#team" onClick={(e) => handleNavClick(e, 'team')} className="text-lg font-bold text-white py-2">Team</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="bg-emerald-500 text-black py-4 rounded-xl font-bold text-lg">Contact Us</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Hero = () => {
  const handleButtonClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 md:pt-20 overflow-hidden">
      <div className="absolute inset-0 habesha-pattern pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-500/10 blur-[60px] md:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-white/10 mb-6 md:mb-8 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Powered by Ethiopia</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] tracking-tight">
          Digital Innovation <br className="hidden sm:block" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-yellow-200 to-red-400 animate-gradient">
            Born in Addis.
          </span>
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          We are Hiyaw Technology's. An elite collective of Ethiopian engineers building the future of African tech infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={(e) => handleButtonClick(e, 'projects')}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all text-base md:text-lg"
          >
            View Our Work
          </button>
          <button 
            onClick={(e) => handleButtonClick(e, 'about')}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 glass border border-white/10 font-bold rounded-2xl hover:bg-white/5 transition-all text-base md:text-lg text-white"
          >
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-12 md:mb-16">
    <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-gray-400 text-base md:text-lg max-w-2xl">{subtitle}</p>
  </div>
);

const ChatAmbassador = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Salām! I'm the Hiyaw AI Ambassador. How can I assist you with our Ethiopian-powered solutions today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getGeminiAmbassador(input, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Apologies, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] ${isOpen ? 'w-[calc(100%-2rem)] md:w-[380px]' : 'w-auto'}`}>
      {isOpen ? (
        <div className="h-[500px] md:h-[550px] glass rounded-3xl flex flex-col shadow-2xl border border-white/10 overflow-hidden mb-4 scale-in-center">
          <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between bg-white/5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">HI</div>
              <div>
                <p className="text-sm font-bold">Hiyaw Ambassador</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'glass border border-white/10 text-gray-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass px-4 py-3 rounded-2xl text-sm text-gray-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 md:p-4 bg-white/5">
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Hiyaw..." 
                className="bg-transparent border-none outline-none text-sm flex-1 p-2 text-white"
              />
              <button 
                onClick={handleSend}
                className="bg-emerald-500 text-black p-2 rounded-lg hover:bg-emerald-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-emerald-500/20 shadow-xl hover:scale-110 transition-transform group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black"></div>
          <svg className="w-7 h-7 md:w-8 md:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main>
        <Hero />

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 px-6 relative overflow-hidden scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <SectionTitle 
              title="Expertise Rooted in Engineering Excellence" 
              subtitle="We leverage cutting-edge technology to solve complex problems within the African landscape and beyond."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {SERVICES.map((service) => (
                <div key={service.id} className="glass p-6 md:p-8 rounded-3xl hover:bg-white/5 transition-all group md:hover:-translate-y-2">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="projects" className="py-16 md:py-24 px-6 bg-white/[0.02] scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <SectionTitle 
              title="Transformative Projects" 
              subtitle="From local fintech heroes to national agritech platforms, explore our diverse portfolio of impact-driven work."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {PROJECTS.map((project) => (
                <div key={project.id} className="group relative rounded-3xl overflow-hidden glass border-none h-[300px] md:h-[400px]">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
                    <span className="text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-2">{project.category}</span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm max-w-md">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Heritage Section */}
        <section id="about" className="py-20 md:py-32 px-6 scroll-mt-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px] md:text-xs mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">Empowering Ethiopia Through Code.</h2>
              <div className="space-y-6 text-gray-400 text-base md:text-lg leading-relaxed">
                <p>
                  Hiyaw Technology's was founded on the belief that the next global tech giant shouldn't just serve Ethiopia—it should be built by Ethiopians. 
                  "Hiyaw" means "Living" in Amharic, reflecting our vibrant culture.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-white">50+</p>
                    <p className="text-xs md:text-sm">Engineers</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-white">12M+</p>
                    <p className="text-xs md:text-sm">End Users Impacted</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-3xl overflow-hidden glass p-2 md:p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                   <img src="https://picsum.photos/seed/ethiopia-tech/800/800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Hiyaw Office" />
                   <div className="absolute inset-0 bg-emerald-500/20 mix-blend-multiply"></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 glass p-4 md:p-8 rounded-2xl md:rounded-3xl text-white">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 text-emerald-400">HQ Location</p>
                <p className="text-lg md:text-xl font-bold italic">Bole Road, Addis Ababa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-16 md:py-24 px-6 bg-black scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The Minds Behind Hiyaw</h2>
              <p className="text-gray-400 text-base md:text-lg">World-class talent, homegrown passion.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
              {TEAM.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden mx-auto glass p-2 md:group-hover:rotate-6 transition-all duration-500">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4">{member.role}</p>
                  <p className="text-gray-400 text-xs md:text-sm max-w-xs mx-auto px-4">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 px-4 md:px-6 scroll-mt-24">
          <div className="max-w-7xl mx-auto glass rounded-[2rem] md:rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 md:p-20 bg-emerald-500 text-black">
              <h2 className="text-4xl md:text-5xl font-black mb-6 md:mb-8">Ready to Build Amazing?</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="font-bold text-lg md:text-xl">hello@hiyaw.tech</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-20 bg-black/40">
              <form className="space-y-5 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 focus:border-emerald-500 outline-none text-sm text-white" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 focus:border-emerald-500 outline-none text-sm text-white" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Message</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 focus:border-emerald-500 outline-none text-sm text-white" placeholder="Tell us about your project..."></textarea>
                </div>
                <button className="w-full py-4 md:py-5 bg-white text-black font-black rounded-xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-sm">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 md:py-20 px-6 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-7 h-7 bg-emerald-500 rounded flex items-center justify-center font-bold text-black">H</div>
             <span className="font-black tracking-tight text-lg">HIYAW</span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm text-center">
            © {new Date().getFullYear()} Hiyaw Technology's. Powered by Ethiopian Excellence.
          </p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest font-bold">LinkedIn</a>
            <a href="#" className="hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest font-bold">Twitter</a>
          </div>
        </div>
      </footer>

      <ChatAmbassador />
    </div>
  );
}
