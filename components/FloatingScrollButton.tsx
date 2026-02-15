import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Modern floating action button for scroll to top
 * Features: Fade in/out based on scroll, smooth animation, shadcn-style design
 */
const FloatingScrollButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button when user scrolls down 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
        fixed bottom-8 right-8 z-50 lg:hidden
        w-14 h-14 rounded-full
        bg-gradient-to-br from-primary to-secondary
        text-black font-bold
        shadow-2xl shadow-primary/30
        hover:shadow-primary/50 hover:scale-110
        active:scale-95
        transition-all duration-300
        flex items-center justify-center
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} strokeWidth={2.5} />
        </button>
    );
};

export default FloatingScrollButton;
