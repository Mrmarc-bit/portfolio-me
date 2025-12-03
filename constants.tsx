import React from 'react';
import { Project, Skill, Experience, Education } from './types';
import { 
  Code2, Database, Layout, Terminal, Figma, GitBranch, 
  Cpu, Globe, Cloud, Palette, ShieldCheck, Smartphone 
} from 'lucide-react';

export const PROFILE = {
  name: "Ma'ruf Muchlisin",
  role: "Web Developer & Designer UI/UX",
  subRole: "UI/UX Specialist",
  location: "Banyumas, Indonesia",
  bio: "Crafting digital experiences that merge art with technology. Specialized in building scalable frontend architectures and immersive user interfaces.",
  stats: {
    projects: 96,
    years: 8,
    awards: 12
  },
  social: {
    github: "https://github.com/Mrmarc-bit",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:muchlisinmaruf@gmail.com"
  }
};

export const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 95, category: "technical", icon: <Code2 className="text-blue-400" /> },
  { name: "TypeScript", level: 90, category: "technical", icon: <Terminal className="text-blue-500" /> },
  { name: "Tailwind CSS", level: 98, category: "technical", icon: <Layout className="text-teal-400" /> },
  { name: "Node.js", level: 85, category: "technical", icon: <Database className="text-green-500" /> },
  { name: "AWS Cloud", level: 80, category: "tool", icon: <Cloud className="text-orange-400" /> },
  { name: "Figma", level: 92, category: "tool", icon: <Figma className="text-pink-500" /> },
  { name: "Git & CI/CD", level: 88, category: "tool", icon: <GitBranch className="text-red-400" /> },
  { name: "System Design", level: 85, category: "general", icon: <Cpu className="text-purple-400" /> },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "The App Market",
    category: "Mobile Design",
    image: "https://picsum.photos/seed/app1/600/400",
    description: "A revolutionary marketplace for decentralized applications.",
    featured: true,
    link: "https://github.com"
  },
  {
    id: "2",
    title: "Image Caption Gen",
    category: "AI & ML",
    image: "https://picsum.photos/seed/ai2/600/400",
    description: "Using Gemini API to generate context-aware captions for abstract art.",
    featured: true,
    link: "https://github.com/Mrmarc-bit"
  },
  {
    id: "3",
    title: "Tech Nexts",
    category: "Branding",
    image: "https://picsum.photos/seed/brand3/600/400",
    description: "Complete brand identity overhaul for a fintech startup.",
    featured: false,
    link: "https://dribbble.com"
  },
  {
    id: "4",
    title: "Analytics Dashboard",
    category: "SaaS",
    image: "https://picsum.photos/seed/dash4/600/400",
    description: "Real-time data visualization platform for enterprise clients.",
    featured: false,
    link: "https://dribbble.com"
  },
  {
    id: "5",
    title: "Automation Sys",
    category: "DevOps",
    image: "https://picsum.photos/seed/auto5/600/400",
    description: "Pipeline automation tools reducing deployment time by 40%.",
    featured: false,
    link: "https://github.com/Mrmarc-bit"
  },
];

export const WORK_EXPERIENCE: Experience[] = [
  {
    id: "exp1",
    role: "Senior Frontend Engineer",
    company: "Google (Contract)",
    period: "2021 - Present",
    description: "Leading the development of internal tools using Angular and React. Improved performance by 30%."
  },
  {
    id: "exp2",
    role: "UI/UX Designer",
    company: "Tokopedia",
    period: "2019 - 2021",
    description: "Redesigned the checkout flow, resulting in a 15% increase in conversion rates."
  },
  {
    id: "exp3",
    role: "Web Developer",
    company: "Creative Agency XYZ",
    period: "2017 - 2019",
    description: "Developed responsive landing pages and e-commerce sites for various international clients."
  }
];

export const EDUCATION: Education[] = [
  {
    id: "edu1",
    degree: "Bachelor of Computer Science",
    institution: "University of Indonesia",
    period: "2013 - 2017",
    description: "Specialized in Software Engineering and Human-Computer Interaction. Graduated Cum Laude."
  },
  {
    id: "edu2",
    degree: "Google UX Design Certificate",
    institution: "Coursera",
    period: "2020",
    description: "Professional certification covering foundations of UX design, including empathizing with users, defining pain points, ideating solutions, creating wireframes and prototypes."
  }
];