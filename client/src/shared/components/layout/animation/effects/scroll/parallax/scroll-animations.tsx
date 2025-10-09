import { useEffect, useRef } from "react";

interface ScrollAnimationsProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function ScrollAnimations({ 
  children, 
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}: ScrollAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll('.fade-in-up');
            
            animatedElements.forEach((element, index) => {
              const htmlElement = element as HTMLElement;
              
              // Get stagger value from CSS custom property
              const staggerValue = htmlElement.style.getPropertyValue('--stagger') || 
                                  htmlElement.getAttribute('data-stagger') || '0';
              const delay = parseInt(staggerValue) * 100;
              
              setTimeout(() => {
                htmlElement.classList.add('visible');
              }, delay);
            });
            
            // Handle text reveal animations
            const textRevealElements = entry.target.querySelectorAll('.text-reveal');
            textRevealElements.forEach((element, index) => {
              const htmlElement = element as HTMLElement;
              setTimeout(() => {
                htmlElement.style.animationPlayState = 'running';
              }, index * 200);
            });
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
