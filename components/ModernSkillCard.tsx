import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface ModernSkillCardProps {
    name: string;
    level: number;
    icon: React.ReactNode;
    category: string;
    index?: number;
}

/**
 * Ultra-modern shadcn-inspired skill card
 * Features: 3D hover effect, animated progress ring, glassmorphism
 */
const ModernSkillCard: React.FC<ModernSkillCardProps> = ({
    name,
    level,
    icon,
    category,
    index = 0
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [animatedLevel, setAnimatedLevel] = useState(0);
    const cardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Start animation when visible
                    const timer = setTimeout(() => {
                        setAnimatedLevel(level);
                    }, 100 + (index * 100));

                    // Optional: Stop observing once handled if we only want 'animate once'
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [level, index]);

    const circumference = 2 * Math.PI * 20; // radius = 20
    // Calculate strokeDashoffset based on animatedLevel
    const strokeDashoffset = circumference - (animatedLevel / 100) * circumference;

    return (
        <div
            ref={cardRef}
            className="group relative animate-slideInUp"
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient glow on hover */}
            <div className="absolute -inset-px bg-gradient-to-br from-primary/0 via-secondary/0 to-primary/0 group-hover:from-primary/40 group-hover:via-secondary/40 group-hover:to-primary/40 rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Main card */}
            <div className="relative bg-surface hover:bg-surfaceHighlight p-6 rounded-[2rem] border border-borderColor group-hover:border-primary/30 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-default group-hover:shadow-2xl group-hover:-translate-y-2">

                {/* Icon with circular progress */}
                <div className="relative w-20 h-20">
                    {/* Background circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className=""
                        />
                    </svg>

                    {/* Animated progress circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="20"
                            stroke="#C3EED1"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out text-primary"
                        />
                    </svg>

                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`transition-all duration-300 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}`}>
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="text-center w-full">
                    <h5 className="font-semibold text-sm text-textMain mb-2 truncate px-2">
                        {name}
                    </h5>

                    {/* Level indicator */}
                    <div className="flex flex-col gap-1 w-full px-4">
                        <div className="flex justify-between items-center text-xs text-textMuted mb-1">
                            <span>Proficiency</span>
                            <span className="font-bold tabular-nums">{Math.round(animatedLevel)}%</span>
                        </div>
                        <div className="h-2 w-full bg-surfaceElevated rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${animatedLevel}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Mastery badge on high-level skills */}
                {level >= 90 && (
                    <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}`}>
                        <div className="bg-googleYellow text-black rounded-full p-1 shadow-lg">
                            <Zap size={12} fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* Category tag (shown on hover) */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-surfaceElevated border border-borderColor px-3 py-1 rounded-full text-[10px] font-medium text-textMuted uppercase tracking-wider transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    {category}
                </div>
            </div>
        </div>
    );
};

export default ModernSkillCard;
