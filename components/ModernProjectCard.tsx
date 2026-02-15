import React, { useState, useRef } from 'react';
import { ArrowUpRight, ExternalLink, Github, Eye } from 'lucide-react';

interface ModernProjectCardProps {
    title: string;
    category: string;
    description: string;
    image: string;
    link?: string;
    featured?: boolean;
    tags?: string[];
}

/**
 * Cutting-edge shadcn-style project card
 * Features: Parallax hover, magnetic button, glassmorphism overlay
 */
const ModernProjectCard: React.FC<ModernProjectCardProps> = ({
    title,
    category,
    description,
    image,
    link,
    featured = false,
    tags = []
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const Component = link ? 'a' : 'div';
    const linkProps = link ? {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer"
    } : {};

    return (
        <Component
            {...linkProps}
            ref={cardRef}
            className={`group relative block bg-surface rounded-[2rem] overflow-hidden border border-borderColor hover:border-primary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer ${featured ? 'md:col-span-2' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Image container with parallax */}
            <div className={`relative w-full ${featured ? 'h-72 md:h-96' : 'h-72'} overflow-hidden bg-surfaceElevated`}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    style={{
                        transform: isHovered
                            ? `translate(${(mousePosition.x - 250) / 50}px, ${(mousePosition.y - 200) / 50}px) scale(1.1)`
                            : 'translate(0, 0) scale(1)'
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Glassmorphism info overlay */}
                <div className={`absolute inset-0 flex items-end transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-full p-6 backdrop-blur-xl bg-black/30 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye size={16} className="text-white/80" />
                            <span className="text-white/80 text-xs font-medium">Interactive Preview Available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex justify-between items-end gap-4">
                    <div className="flex-1">
                        {/* Category badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 text-primary border border-primary/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {category}
                        </div>

                        {/* Title */}
                        <h4 className="text-2xl md:text-3xl font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300">
                            {title}
                        </h4>

                        {/* Description */}
                        <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 max-w-md mb-3">
                            {description}
                        </p>

                        {/* Tags (shown on hover) */}
                        {tags.length > 0 && (
                            <div className={`flex flex-wrap gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                {tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md text-xs text-white/80 border border-white/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA Button with magnetic effect */}
                    <div
                        className="relative"
                        style={{
                            transform: isHovered
                                ? `translate(${(mousePosition.x - 600) / 30}px, ${(mousePosition.y - 250) / 30}px)`
                                : 'translate(0, 0)'
                        }}
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-black group-hover:bg-primary transition-all duration-300 shadow-2xl transform group-hover:rotate-6 group-hover:scale-110">
                            <ArrowUpRight size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Corner accent (decorative) */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Component>
    );
};

export default ModernProjectCard;
