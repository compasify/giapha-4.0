'use client';

import { useInView } from '@/hooks/use-in-view';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts. Default 0 */
  delay?: number;
}

/**
 * Wrapper that fades in children when scrolled into view.
 * Uses tw-animate-css classes for the actual animation.
 */
export function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
