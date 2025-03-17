
import { useEffect, useState } from 'react';

// Animation utility to add class after element is in viewport
export const useInView = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
};

// Staggered animation for lists
export const staggeredAnimationDelay = (index: number, baseDelay = 100) => {
  return {
    animationDelay: `${index * baseDelay}ms`,
  };
};

// Animation variants for framer-motion style animations with CSS
export const fadeInVariants = {
  hidden: 'opacity-0',
  visible: 'opacity-100 transition-opacity duration-500',
};

export const slideUpVariants = {
  hidden: 'opacity-0 translate-y-10',
  visible: 'opacity-100 translate-y-0 transition-all duration-500',
};

export const slideInRightVariants = {
  hidden: 'opacity-0 translate-x-10',
  visible: 'opacity-100 translate-x-0 transition-all duration-500',
};

// Utility to add and remove animation classes
export const animateElement = (
  element: HTMLElement,
  animationClass: string,
  duration = 500
) => {
  if (!element) return;
  
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};
