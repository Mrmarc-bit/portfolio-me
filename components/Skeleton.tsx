import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

/**
 * Modern shadcn-inspired skeleton loader
 * Features: Shimmer animation, multiple variants
 */
const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular'
}) => {
    const baseStyles = 'bg-surfaceElevated relative overflow-hidden';

    const variantStyles = {
        text: 'h-4 w-full rounded',
        circular: 'rounded-full',
        rectangular: 'w-full h-48',
        rounded: 'rounded-2xl'
    };

    return (
        <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surfaceHighlight to-transparent" />
        </div>
    );
};

export default Skeleton;
