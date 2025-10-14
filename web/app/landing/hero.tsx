import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function HeroSection() {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <FloatingParticles />
  
        <div className="absolute top-1/4 -left-48 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl [animation-delay:1s]" />
  
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="mb-6 text-6xl font-bold md:text-8xl">
              <span className="animate-gradient bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Track Money
              </span>
              <br />
              <span className="animate-gradient-reverse bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 bg-clip-text text-transparent">
                Like Magic
              </span>
            </h1>
          </motion.div>
  
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-secondary md:text-2xl"
          >
            Just speak. AI understands. Your finances, finally simple.
          </motion.p>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <button className="rounded-xl border-2 border-blue-500/30 px-8 py-4 text-lg font-semibold transition-all hover:border-blue-500 hover:bg-blue-500/10">
              Watch Demo
            </button>
          </motion.div>
  
        </div>
      </section>
    );
  }

  function FloatingParticles() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }
  
      const updateDimensions = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
  
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
  
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }, []);
  
    const particles = useMemo(() => {
      if (!dimensions.width || !dimensions.height) {
        return [] as Array<{
          startX: number;
          startY: number;
          endX: number;
          endY: number;
          duration: number;
          delay: number;
        }>;
      }
  
      return Array.from({ length: 20 }, () => ({
        startX: Math.random() * dimensions.width,
        startY: Math.random() * dimensions.height,
        endX: Math.random() * dimensions.width,
        endY: Math.random() * dimensions.height,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 2,
      }));
    }, [dimensions.height, dimensions.width]);
  
    if (!particles.length) {
      return null;
    }
  
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={`particle-${index}`}
            className="absolute h-1 w-1 rounded-full bg-blue-400/30"
            initial={{ x: particle.startX, y: particle.startY, opacity: 0.6 }}
            animate={{
              x: [particle.startX, particle.endX],
              y: [particle.startY, particle.endY],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
}