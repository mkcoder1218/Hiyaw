
import React from 'react';
import { Project, Service, TeamMember } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Developing localized AI models that understand Ethiopian languages and contexts, from Amharic NLP to agricultural predictive analytics.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "FinTech Solutions",
    description: "Revolutionizing payments in East Africa with secure, accessible, and scalable digital banking infrastructures.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Custom Software",
    description: "End-to-end web and mobile applications designed with the performance and reliability needed for the modern enterprise.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Cloud Infrastructure",
    description: "Modernizing legacy systems through robust cloud architecture and DevOps excellence, optimized for regional connectivity.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Zemen Pay",
    category: "FinTech",
    description: "A comprehensive digital payment gateway tailored for Ethiopian businesses.",
    image: "https://picsum.photos/seed/zemen/800/600"
  },
  {
    id: 2,
    title: "Gojo Smart City",
    category: "IoT / Infrastructure",
    description: "Integrated IoT solutions for urban management in Addis Ababa.",
    image: "https://picsum.photos/seed/gojo/800/600"
  },
  {
    id: 3,
    title: "Gebere Connect",
    category: "AgriTech",
    description: "Empowering 10,000+ farmers with real-time market data and logistics support.",
    image: "https://picsum.photos/seed/gebere/800/600"
  },
  {
    id: 4,
    title: "Lasta Health",
    category: "HealthTech",
    description: "Cloud-based telemedicine platform connecting rural clinics to specialist care.",
    image: "https://picsum.photos/seed/lasta/800/600"
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Dr. Selamawit Tadesse",
    role: "Chief Executive Officer",
    image: "https://picsum.photos/seed/selam/400/400",
    bio: "Visionary leader with 15+ years in global tech ecosystems, passionate about Ethiopian digital sovereignty."
  },
  {
    id: 2,
    name: "Elias Bekele",
    role: "Head of Engineering",
    image: "https://picsum.photos/seed/elias/400/400",
    bio: "Ex-Google architect returning home to build the next generation of African engineering talent."
  },
  {
    id: 3,
    name: "Hanna Girma",
    role: "Lead Product Designer",
    image: "https://picsum.photos/seed/hanna/400/400",
    bio: "Crafting digital experiences that blend traditional Ethiopian aesthetics with modern UX principles."
  }
];
