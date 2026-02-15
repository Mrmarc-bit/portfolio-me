import React, { useState, useEffect } from 'react';
import { Home, Layers, Briefcase, Mail, User, Hexagon, Sun, Moon, Map } from 'lucide-react';
import { SectionId } from '../types';

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change state if scrolled more than 20px
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'skills', icon: <Layers size={20} />, label: 'Skills' },
    { id: 'projects', icon: <Briefcase size={20} />, label: 'Projects' },
    { id: 'experience', icon: <User size={20} />, label: 'Experience' },
    { id: 'maps', icon: <Map size={20} />, label: 'Maps' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
  ];

  return (
    <nav
      className={`
        fixed z-[9999] flex items-center justify-between transition-all duration-500 ease-in-out px-4
        lg:static lg:h-[calc(100vh-40px)] lg:w-20 lg:rounded-3xl lg:my-5 lg:ml-5 lg:flex-col lg:bg-surface lg:border lg:border-borderColor lg:shadow-2xl lg:px-0 lg:py-8
        ${isScrolled
          ? 'bottom-4 left-4 right-4 h-16 bg-surface/80 backdrop-blur-xl border border-borderColor rounded-full shadow-2xl' // Mobile: Floating Bottom Glass Pill
          : 'bottom-4 left-4 right-4 h-16 bg-surface rounded-full border border-borderColor shadow-xl' // Mobile: Floating Bottom Pill
        }
      `}
    >

      {/* Logo Placeholder (Desktop only - Compact) */}
      <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-surfaceHighlight rounded-xl text-textMain mb-4">
        <Hexagon size={24} />
      </div>

      {/* Nav Items Container */}
      <div className="flex-1 w-full flex lg:flex-col items-center justify-around lg:justify-center overflow-visible lg:w-auto gap-1 lg:gap-4 px-1 lg:px-0 h-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              relative transition-all duration-300 group flex items-center justify-center shrink-0 w-10 h-10 rounded-full
              
              /* Desktop Styles Overrides */
              lg:w-auto lg:h-auto lg:p-3 lg:rounded-xl
              
              /* Active/Inactive States */
              ${activeSection === item.id
                ? 'bg-primary text-black shadow-lg scale-110 ring-2 ring-primary/20'
                : 'text-textMuted hover:bg-surfaceHighlight hover:text-textMain hover:scale-110'
              }
            `}
            aria-label={item.label}
          >
            {/* ICON Only - Visible on ALL screens (Centered) */}
            <span className="block">
              {item.icon}
            </span>

            {/* TEXT Hidden on ALL screens (Desktop uses tooltips) */}
            <span className="hidden">
              {item.label}
            </span>

            {/* Tooltip (Desktop Only) - Restored */}
            <span className="hidden lg:block absolute left-14 bg-surfaceHighlight text-textMain text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-borderColor z-50">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center text-textMuted hover:bg-surfaceHighlight hover:text-textMain transition-colors lg:mt-auto shrink-0 border border-transparent hover:border-borderColor ml-1 lg:ml-0"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

    </nav>
  );
};

export default Sidebar;