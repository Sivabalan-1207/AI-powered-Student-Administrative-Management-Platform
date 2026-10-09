import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'scale-fade' | 'slide-in-left';
  delayMs?: number;
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delayMs = 0,
  className = '',
  threshold = 0.1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Support prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  const initClass =
    variant === 'scale-fade'
      ? 'reveal-scale-init'
      : variant === 'slide-in-left'
      ? 'reveal-slide-left-init'
      : 'reveal-init';

  const visibleClass =
    variant === 'scale-fade'
      ? 'reveal-scale-visible'
      : variant === 'slide-in-left'
      ? 'reveal-slide-left-visible'
      : 'reveal-visible';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`${initClass} ${isVisible ? visibleClass : ''} ${className}`}
    >
      {children}
    </div>
  );
};
