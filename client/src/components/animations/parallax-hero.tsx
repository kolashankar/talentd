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
  speed = 0.5,
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
      style={{
        backgroundImage: `linear-gradient(${overlay}, ${overlay}), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transform: `translateY(${scrollY * speed}px)`,
      }}
    >
      <div className="relative z-10 w-full">
        {children}
      </div>
      
      {/* Additional parallax layer for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: '120%',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * (speed * 0.3)}px) scale(1.1)`,
        }}
      />
    </section>
  );
}
