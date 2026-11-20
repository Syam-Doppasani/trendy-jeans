import React, { ButtonHTMLAttributes, useState } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, onClick, ...props }, ref) => {
    const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'primary') {
        const rect = e.currentTarget.getBoundingClientRect();
        setRipple({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setTimeout(() => setRipple(null), 400);
      }
      onClick?.(e);
    };

    let baseClasses =
      'relative overflow-hidden inline-flex items-center justify-center min-h-[52px] min-w-[44px] px-6 rounded-btn font-medium text-[15px] transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    if (variant === 'primary') {
      baseClasses += ' bg-ink text-surface hover:bg-black';
    } else if (variant === 'secondary') {
      baseClasses += ' bg-transparent text-ink border border-ink hover:bg-ink/5';
    } else if (variant === 'gold') {
      baseClasses += ' bg-gold text-ink font-semibold hover:brightness-105 shadow-soft';
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {ripple && (
          <span
            className="absolute rounded-full pointer-events-none animate-ping"
            style={{
              left: ripple.x - 12,
              top: ripple.y - 12,
              width: 24,
              height: 24,
              backgroundColor: 'rgba(200, 169, 106, 0.45)',
            }}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
