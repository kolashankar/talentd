import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxHeroProps {
  children: React.ReactNode;
  backgroundImage: string;
  overlay?: string;
  className?: string;
  speed?: number;
}

export function ParallaxHero({
  children,
  backgroundImage,
  overlay = "rgba(0, 0, 0, 0.5)",
  className,
  speed = 0.1, // Reduced speed for smoother scrolling
}: ParallaxHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      className={cn("relative min-h-screen flex items-center overflow-hidden", className)}
    >
      {/* Fixed background layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(${overlay}, ${overlay}), url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: `translateY(${scrollY * speed}px)`,
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </section>
  );
}
