import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Activity } from 'lucide-react';

interface AnimatedStatsCardProps {
    value: number;
    label: string;
    icon?: React.ReactNode;
    delay?: number;
}

/**
 * Modern shadcn-style animated stats card with glassmorphism
 * Features: Count-up animation, hover effects, and sparkle indicators
 */
const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({
    value,
    label,
    icon = <Activity size={20} />,
    delay = 0
}) => {
    const [count, setCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let startTime: number | null = null;
            let animationFrameId: number;
            const duration = 2000;

            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const progress = currentTime - startTime;
                const percentage = Math.min(progress / duration, 1);
                const easeOut = 1 - Math.pow(1 - percentage, 4);

                setCount(Math.floor(easeOut * value));

                if (progress < duration) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrameId);
        }, delay);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Card */}
            <div className="relative bg-surfaceHighlight/80 backdrop-blur-sm p-6 rounded-2xl border border-borderColor/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Top icon */}
                <div className="flex items-center justify-between mb-3">
                    <div className={`text-textMuted group-hover:text-primary transition-colors duration-300 ${isHovered ? 'animate-pulse' : ''}`}>
                        {icon}
                    </div>
                    {isHovered && (
                        <Sparkles size={16} className="text-googleYellow animate-spin" />
                    )}
                </div>

                {/* Value */}
                <div className="text-4xl font-bold text-textMain mb-1 font-mono">
                    {count}+
                </div>

                {/* Label */}
                <div className="text-sm text-textMuted uppercase tracking-wider font-medium">
                    {label}
                </div>

                {/* Trend indicator (decorative) */}
                <div className={`absolute bottom-2 right-2 flex items-center gap-1 text-googleGreen text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <TrendingUp size={12} />
                    <span>+12%</span>
                </div>
            </div>
        </div>
    );
};

export default AnimatedStatsCard;
