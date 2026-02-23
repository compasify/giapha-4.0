'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Threshold at which the callback fires (0-1). Default 0.15 */
  threshold?: number;
  /** Once true, stop observing. Default true */
  once?: boolean;
  /** Root margin for earlier trigger. Default '0px 0px -40px 0px' */
  rootMargin?: string;
}

/**
 * Lightweight intersection observer hook for scroll-triggered animations.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.15, once = true, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isInView };
}
