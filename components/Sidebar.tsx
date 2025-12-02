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
        fixed z-50 flex items-center justify-between transition-all duration-500 ease-in-out px-4
        lg:static lg:h-[calc(100vh-40px)] lg:w-20 lg:rounded-3xl lg:justify-start lg:gap-8 lg:my-5 lg:ml-5 lg:flex-col lg:bg-surface lg:border lg:border-borderColor lg:shadow-2xl lg:px-0 lg:py-8
        ${isScrolled 
          ? 'top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-borderColor rounded-none shadow-lg' // Scrolled: Full width Glass
          : 'top-4 left-4 right-4 h-16 bg-surface rounded-full border border-borderColor shadow-xl' // Top: Floating Pill
        }
      `}
    >
      
      {/* Logo Placeholder (Desktop only) */}
      <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-surfaceHighlight rounded-xl text-textMain mb-4">
        <Hexagon size={24} />
      </div>

      {/* Nav Items Container - Updated for scrollability */}
      {/* Replaced 'scrollbar-hide' with 'scrollbar-thin' to show subtle scroll indicator on mobile */}
      {/* Added 'pb-1' to ensure scrollbar doesn't overlap content */}
      <div className="flex-1 min-w-0 flex lg:flex-col items-center justify-start lg:justify-center overflow-x-auto scrollbar-thin lg:overflow-visible lg:w-auto gap-3 lg:gap-4 px-2 lg:px-0 h-full pb-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              relative transition-all duration-300 group flex items-center justify-center shrink-0
              /* Mobile Styles */
              ${item.id === 'home' 
                ? 'w-10 h-10 rounded-full p-0 flex items-center justify-center'  // Circle for Home, centered content
                : 'h-10 px-5 rounded-full'      // Pill for others
              }
              
              /* Desktop Styles Overrides */
              lg:w-auto lg:h-auto lg:p-3 lg:rounded-xl
              
              /* Active/Inactive States */
              ${activeSection === item.id 
                ? 'bg-textMain text-background shadow-md scale-105' 
                : 'text-textMuted hover:bg-surfaceHighlight hover:text-textMain hover:scale-105'
              }
            `}
            aria-label={item.label}
          >
            {/* 
              ICON LOGIC:
              - Home: Visible on ALL screens (block)
              - Others: Hidden on Mobile, Visible on Desktop (hidden lg:block)
            */}
            <span className={`${item.id === 'home' ? 'block' : 'hidden lg:block'}`}>
              {item.icon}
            </span>

            {/* 
              TEXT LOGIC:
              - Home: Hidden on Mobile (hidden) - Icon is used instead
              - Others: Visible on Mobile, Hidden on Desktop (block lg:hidden)
            */}
            <span className={`${item.id === 'home' ? 'hidden' : 'block lg:hidden'} text-sm font-medium whitespace-nowrap`}>
              {item.label}
            </span>
            
            {/* Tooltip (Desktop Only - Logic remains same) */}
            <span className="hidden lg:block absolute left-14 bg-surfaceHighlight text-textMain text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-borderColor z-50">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Theme Toggle Button */}
      {/* Added shrink-0 to prevent button from being squashed */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center text-textMuted hover:bg-surfaceHighlight hover:text-textMain transition-colors lg:mt-auto shrink-0 border border-transparent hover:border-borderColor ml-2 lg:ml-0"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

    </nav>
  );
};

export default Sidebar;