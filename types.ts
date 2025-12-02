import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  icon?: React.ReactNode;
  level: number; // 0-100
  category: 'technical' | 'tool' | 'general';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export type SectionId = 'home' | 'skills' | 'projects' | 'experience' | 'maps' | 'contact';