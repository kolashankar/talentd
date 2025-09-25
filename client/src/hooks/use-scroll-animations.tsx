import { useEffect, useRef, useState } from "react";

interface ScrollAnimationsConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  staggerDelay?: number;
}

interface ScrollAnimationsReturn {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasTriggered: boolean;
}

export function useScrollAnimations(config: ScrollAnimationsConfig = {}): ScrollAnimationsReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    staggerDelay = 100
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
            setIsVisible(true);
            setHasTriggered(true);

            // Handle fade-in-up animations
            const animatedElements = entry.target.querySelectorAll('.fade-in-up');
            animatedElements.forEach((element, index) => {
              const htmlElement = element as HTMLElement;
              
              // Get stagger value from CSS custom property or data attribute
              const staggerValue = htmlElement.style.getPropertyValue('--stagger') || 
                                  htmlElement.getAttribute('data-stagger') || '0';
              const delay = parseInt(staggerValue) * staggerDelay;
              
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

            // Handle stacked card animations
            const stackedCards = entry.target.querySelectorAll('.card-stack');
            stackedCards.forEach((card, index) => {
              const element = card as HTMLElement;
              setTimeout(() => {
                element.style.transform = 'translateY(0px)';
                element.style.opacity = '1';
              }, index * staggerDelay);
            });

            // Handle slide animations
            const slideElements = entry.target.querySelectorAll('.slide-up, .slide-left, .slide-right');
            slideElements.forEach((element, index) => {
              const htmlElement = element as HTMLElement;
              setTimeout(() => {
                htmlElement.classList.add('visible');
              }, index * staggerDelay);
            });

          } else if (!entry.isIntersecting && !triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, staggerDelay]);

  return { ref, isVisible, hasTriggered };
}

export function useParallaxScroll(speed: number = 0.5) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY * speed;
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      
      setScrollProgress(scrolled * 100);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return scrollProgress;
}

export function useElementInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isInView };
}

export function useStaggeredAnimations(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger staggered animations
            for (let i = 0; i < itemCount; i++) {
              setTimeout(() => {
                setVisibleItems(prev => {
                  const newState = [...prev];
                  newState[i] = true;
                  return newState;
                });
              }, i * delay);
            }
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
  }, [itemCount, delay]);

  return { containerRef, visibleItems };
}

export function useTextMaskReveal(text: string, delay: number = 50) {
  const [revealedText, setRevealedText] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);

  const startReveal = () => {
    if (isRevealing) return;
    
    setIsRevealing(true);
    let index = 0;
    
    const revealInterval = setInterval(() => {
      if (index <= text.length) {
        setRevealedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(revealInterval);
        setIsRevealing(false);
      }
    }, delay);
  };

  const resetReveal = () => {
    setRevealedText('');
    setIsRevealing(false);
  };

  return { revealedText, startReveal, resetReveal, isRevealing };
}

export function usePinnedScroll() {
  const [isPinned, setIsPinned] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current || !containerRef.current) return;

      const elementRect = elementRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Pin when element reaches top of viewport and container is still visible
      const shouldPin = containerRect.top <= 0 && containerRect.bottom > elementRect.height;
      setIsPinned(shouldPin);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { elementRef, containerRef, isPinned };
}
