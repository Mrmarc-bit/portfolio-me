import React, { useRef, useEffect, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in';

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: AnimationType;
    delay?: number; // ms
    duration?: number; // ms
    threshold?: number; // 0-1 (visibility percentage to trigger)
    className?: string; // Additional classes for the wrapper
}

/**
 * A wrapper component that triggers animations when the element enters the viewport.
 */
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 800,
    threshold = 0.1,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element); // Animate only once
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before full view
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold]);

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up': return 'animate-fade-up';
            case 'fade-left': return 'animate-fade-left';
            case 'fade-right': return 'animate-fade-right';
            case 'zoom-in': return 'animate-zoom-in';
            case 'blur-in': return 'animate-blur-in';
            default: return 'animate-fade-up';
        }
    };

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? 'animate-on-scroll ' + getAnimationClass() : 'opacity-0'}`}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;
