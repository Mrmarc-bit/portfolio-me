import React from 'react';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Modern shadcn-inspired button component
 * Features: Multiple variants, sizes, loading states, smooth animations
 */
const ModernButton: React.FC<ModernButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    href,
    type = 'button'
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const variantStyles = {
        primary: 'bg-textMain text-background hover:bg-textMain/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-textMain',
        secondary: 'bg-surfaceElevated text-textMain hover:bg-surfaceHighlight border border-borderColor hover:border-primary/30 focus-visible:ring-primary',
        outline: 'bg-transparent text-textMain border-2 border-textMain/20 hover:border-textMain hover:bg-textMain/5 focus-visible:ring-textMain',
        ghost: 'bg-transparent text-textMain hover:bg-surfaceHighlight focus-visible:ring-primary',
        gradient: 'bg-gradient-to-r from-primary to-secondary text-black hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5 focus-visible:ring-primary'
    };

    const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    const content = (
        <>
            {/* Shimmer effect on hover */}
            <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />

            {/* Loading spinner */}
            {loading && (
                <Loader2 size={16} className="animate-spin" />
            )}

            {/* Icon */}
            {!loading && icon && iconPosition === 'left' && (
                <span className="transition-transform group-hover:-translate-x-0.5">
                    {icon}
                </span>
            )}

            {/* Text */}
            <span className="relative z-10">{children}</span>

            {/* Icon (right) */}
            {!loading && icon && iconPosition === 'right' && (
                <span className="transition-transform group-hover:translate-x-0.5">
                    {icon}
                </span>
            )}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={`${combinedStyles} group`}
                onClick={onClick}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={`${combinedStyles} group`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {content}
        </button>
    );
};

export default ModernButton;
