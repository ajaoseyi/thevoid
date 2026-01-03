"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  cursor?: boolean;
  className?: string;
  start?: boolean;
}

export default function Typewriter({
  text,
  delay = 50,
  initialDelay = 0,
  cursor = true,
  className = "",
  start = true,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const previousTextRef = useRef(text);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentTextRef = useRef(text);
  const currentDelayRef = useRef(delay);
  const currentInitialDelayRef = useRef(initialDelay);

  // Update refs when props change
  useEffect(() => {
    currentTextRef.current = text;
    currentDelayRef.current = delay;
    currentInitialDelayRef.current = initialDelay;
  }, [text, delay, initialDelay]);

  // Reset when text prop changes and restart if already visible
  useEffect(() => {
    if (previousTextRef.current !== text) {
      setDisplayedText("");
      setIsTyping(false);
      hasStartedRef.current = false;
      previousTextRef.current = text;
      
      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
        initialTimeoutRef.current = null;
      }

      // If component is already visible and start is true, restart typing immediately
      if (start && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isVisible = 
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0;

        if (isVisible) {
          hasStartedRef.current = true;
          
          const startTyping = () => {
            setIsTyping(true);
            let currentIndex = 0;

            const typeChar = () => {
              if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
                timeoutRef.current = setTimeout(typeChar, delay);
              } else {
                setIsTyping(false);
              }
            };

            typeChar();
          };

          initialTimeoutRef.current = setTimeout(startTyping, initialDelay);
        }
      }
    }
  }, [text, start]);

  // Handle typing logic with Intersection Observer
  useEffect(() => {
    if (!start) {
      setDisplayedText("");
      setIsTyping(false);
      hasStartedRef.current = false;
      return;
    }

    // Use Intersection Observer to detect when component is in viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Only start typing if component is visible and hasn't started yet
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          
          const startTyping = () => {
            setIsTyping(true);
            let currentIndex = 0; // Always start from beginning

            const typeChar = () => {
              const textToType = currentTextRef.current;
              if (currentIndex < textToType.length) {
                setDisplayedText(textToType.slice(0, currentIndex + 1));
                currentIndex++;
                timeoutRef.current = setTimeout(typeChar, currentDelayRef.current);
              } else {
                setIsTyping(false);
              }
            };

            typeChar();
          };

          initialTimeoutRef.current = setTimeout(startTyping, currentInitialDelayRef.current);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    );

    if (containerRef.current && observerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
      }
    };
  }, [start]);

  return (
    <span ref={containerRef} className={`text-[108px]`}>
      {displayedText}
      {cursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
}
