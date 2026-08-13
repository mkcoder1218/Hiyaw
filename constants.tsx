import React from 'react';
import { Project, Service, TeamMember } from './types';

const MIKEYAS_IMAGE = "data:image/webp;base64,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";

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
    title: "RedSea Mart",
    category: "E-commerce",
    description: "A modern commerce experience designed to make discovering, ordering, and receiving products simple and fast.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Little Paris Restaurant",
    category: "Restaurant Website",
    description: "A polished restaurant website with menu discovery, gallery, reservations, and customer contact experiences.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Glam Nest",
    category: "Beauty & Lifestyle",
    description: "A modern digital presence for a hair salon, focused on services, branding, and a smooth customer experience.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Vita Food Complex",
    category: "Food & Manufacturing",
    description: "A corporate product website presenting Vita Food Complex, its product portfolio, and its growing food brands.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Vick Burger & Pizza",
    category: "Restaurant & Ordering",
    description: "A digital restaurant platform built around food discovery, ordering, and day-to-day business operations.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80"
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Biruk Birhanu",
    role: "Founding Team",
    image: "/team/biruk-birhanu.svg",
    bio: "Building Hyaw's products, direction, and long-term vision from Ethiopia."
  },
  {
    id: 2,
    name: "Mikeyas Derje",
    role: "Founding Team",
    image: MIKEYAS_IMAGE,
    bio: "Engineering and shipping Hyaw's digital products, platforms, and client solutions."
  }
];
