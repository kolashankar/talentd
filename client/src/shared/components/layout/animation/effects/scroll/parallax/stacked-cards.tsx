import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StackedCardsProps {
  children: React.ReactNode;
  className?: string;
  stackOffset?: number;
}

export function StackedCards({ 
  children, 
  className,
  stackOffset = 20 
}: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.card-stack');
            
            cards.forEach((card, index) => {
              const element = card as HTMLElement;
              
              // Add stagger delay based on index
              setTimeout(() => {
                element.style.transform = 'translateY(0px)';
                element.style.opacity = '1';
              }, index * 100);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
    >
      <style>{`
        .card-stack {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .card-stack:nth-child(1) { z-index: 10; }
        .card-stack:nth-child(2) { z-index: 9; }
        .card-stack:nth-child(3) { z-index: 8; }
        .card-stack:nth-child(4) { z-index: 7; }
        .card-stack:nth-child(5) { z-index: 6; }
        .card-stack:nth-child(6) { z-index: 5; }
      `}</style>
      {children}
    </div>
  );
}
