"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Mic, Brain, TrendingUp } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import LogoImage from '@/assets/logo.jpg';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <DemoSection />
    </div>
  );
}

function Navigation() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.95)']
  );
  const borderColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(40, 40, 40, 0)', 'rgba(40, 40, 40, 1)']
  );

  return (
    <motion.nav
      style={{ backgroundColor, borderColor }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image
            src={LogoImage}
            alt="FinSense logo"
            width={40}
            height={40}
            className="object-contain rounded-lg"
          />
          <span className="text-2xl font-bold">FinSense</span>
        </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-secondary transition-colors hover:text-primary"
          >
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

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

function ProblemSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    {
      icon: '📝',
      title: 'Too Much Typing',
      description:
        'Manually entering every expense is tedious. You forget half of them anyway.',
    },
    {
      icon: '😵',
      title: 'Complicated Apps',
      description:
        'Spreadsheets and complex budgeting tools make finance tracking feel like homework.',
    },
    {
      icon: '🤷',
      title: 'No Real Insights',
      description:
        "You see the data, but what does it mean? Where's the 'so what?'",
    },
  ];

  return (
    <section ref={ref} className="relative px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl font-bold md:text-6xl">
            Finance Tracking
            <br />
            <span className="text-secondary">Shouldn't Feel Like Work</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemCard key={problem.title} problem={problem} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="my-20 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-semibold text-blue-400">There's a better way ↓</p>
        </motion.div>
      </div>
    </section>
  );
}

type Problem = {
  icon: string;
  title: string;
  description: string;
};

function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="card transform p-8 transition-transform duration-300 hover:scale-105"
    >
      <div className="mb-6 text-6xl">{problem.icon}</div>
      <h3 className="mb-4 text-2xl font-bold">{problem.title}</h3>
      <p className="leading-relaxed text-secondary">{problem.description}</p>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            Three Features.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Zero Hassle.
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-16">
          <FeatureCard
            icon={Mic}
            title="Voice Input That Actually Works"
            description="Say 'I spent $20 on coffee at Starbucks' and you're done. No typing, no forms, no friction. Just speak naturally and AI handles the rest."
            gradient="from-blue-500 to-cyan-500"
          />

          <FeatureCard
            icon={Brain}
            title="AI Insights You'll Actually Read"
            description="Forget boring charts. Get personalized, conversational insights about your spending. 'You spend 3x more on weekends' is way more useful than a pie chart."
            gradient="from-purple-500 to-blue-500"
            reverse
          />

          <FeatureCard
            icon={TrendingUp}
            title="See Your Money at a Glance"
            description="Beautiful dashboard that makes sense in 3 seconds. Calendar heatmap shows spending patterns. Charts that don't need explanation. Finance, simplified."
            gradient="from-blue-500 to-indigo-500"
          />
        </div>
      </div>

      <motion.div
        style={{ y }}
        className="pointer-events-none absolute right-0 top-1/2 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
      />
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  reverse = false,
}: {
  icon: IconType;
  title: string;
  description: string;
  gradient: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerClasses = [
    'flex flex-col md:flex-row items-center gap-8',
    reverse ? 'md:flex-row-reverse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: reverse ? 60 : -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={containerClasses}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={`${reverse ? 'md:order-2' : ''} w-full md:w-2/5`}
      >
        <div className={`aspect-square w-20 rounded-2xl bg-gradient-to-br ${gradient} p-1`}>
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-secondary))]">
            <Icon className="h-10 w-10 text-blue-400" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      <div className={`${reverse ? 'md:order-1' : ''} w-full md:w-3/5`}>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-3 text-2xl font-bold md:text-3xl"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base leading-relaxed text-secondary md:text-lg"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

function DemoSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-5xl font-bold md:text-6xl">See It In Action</h2>
          <p className="text-xl text-secondary">
            Watch how FinSense makes expense tracking effortless
          </p>
        </motion.div>

        <motion.div style={{ scale, opacity }} className="relative mx-auto max-w-5xl">
          <div className="card bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-2">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-[rgb(var(--color-bg-primary))]">
              <div className="z-10 text-center">
                <Mic className="mx-auto mb-6 h-24 w-24 text-blue-400 animate-pulse" />
                <p className="mb-2 text-2xl font-semibold">Demo Video</p>
                <p className="text-secondary">"I spent twenty bucks on lunch at Chipotle"</p>
              </div>

              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-blue-500 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-32 w-32 animate-pulse rounded-full bg-blue-600 blur-3xl [animation-delay:1s]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-semibold transition-transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
          >
            Start Tracking for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
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
