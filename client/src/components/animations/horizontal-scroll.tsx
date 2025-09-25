import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function HorizontalScroll({ 
  children, 
  className,
  speed = 1 
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Convert vertical scroll to horizontal for desktop
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY * speed;
      }
    };

    // Add smooth scrolling behavior
    scrollContainer.style.scrollBehavior = 'smooth';

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [speed]);

  return (
    <div 
      ref={scrollRef}
      className={cn(
        "overflow-x-auto horizontal-scroll scrollbar-hide",
        "scroll-smooth",
        className
      )}
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .horizontal-scroll-item {
          scroll-snap-align: start;
          flex-shrink: 0;
        }
      `}</style>
      {children}
    </div>
  );
}
