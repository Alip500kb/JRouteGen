/**
 * Framer Motion Animation Variants
 * Centralized animation variants for consistent animations across components
 */

import { Variants } from 'framer-motion';

// Fade variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Scale variants
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleInUp: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Slide variants
export const slideInUp: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const slideInDown: Variants = {
  hidden: { y: '-100%' },
  visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Stagger container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      staggerChildrenDelay: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      staggerChildrenDelay: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      staggerChildrenDelay: 0.2,
    },
  },
};

// Stagger children variants
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Hover/tap variants for interactive elements
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const hoverScaleUp: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.2, ease: 'easeOut' } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const hoverLift: Variants = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: { duration: 0.3, ease: 'easeOut' } },
};

export const hoverGlow: Variants = {
  initial: { boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
  hover: { boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)', transition: { duration: 0.3, ease: 'easeOut' } },
};

// Text animation variants
export const textReveal: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const textRevealStagger: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.03,
      staggerChildrenDelay: 0.05,
    },
  },
};

export const letterReveal: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const pageTransitionFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Loading/Spinner variants
export const spin: Variants = {
  animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: 'linear' } },
};

export const pulse: Variants = {
  animate: { opacity: [1, 0.5, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
};

export const bounce: Variants = {
  animate: { y: [0, -10, 0], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } },
};

// Scroll-triggered variants
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const scrollRevealRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Stagger for lists
export const listStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Focus variants for accessibility
export const focusRing: Variants = {
  initial: { boxShadow: 'none' },
  focus: { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)', transition: { duration: 0.1 } },
};

// Custom easing functions
export const easings = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  spring: { type: 'spring', stiffness: 260, damping: 20 },
  springSoft: { type: 'spring', stiffness: 120, damping: 14 },
  springHard: { type: 'spring', stiffness: 400, damping: 25 },
};

// Transition presets
export const transitions = {
  fast: { duration: 0.2, ease: easings.easeOut },
  normal: { duration: 0.3, ease: easings.easeOut },
  slow: { duration: 0.5, ease: easings.easeOut },
  spring: easings.spring,
  springSoft: easings.springSoft,
  springHard: easings.springHard,
};

// Viewport options for scroll animations
export const viewportOptions = {
  once: true,
  margin: '-100px',
};

export const viewportOptionsOnce = {
  once: true,
  margin: '0px',
};

export const viewportOptionsGenerous = {
  once: true,
  margin: '-200px',
};