// Utilidades de animación optimizadas y reutilizables

import { Variants } from 'framer-motion';

// Easing functions estándar
export const easings = {
  easeOut: [0.22, 1, 0.36, 1],
  easeIn: [0.4, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Transiciones de página estándar
export const pageTransitions = {
  slideLeft: {
    initial: { opacity: 0, x: '-100%' },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0, 
      x: '-100%',
      transition: { duration: 0.6, ease: easings.easeIn }
    }
  },
  
  slideRight: {
    initial: { opacity: 0, x: '100%' },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: { duration: 0.6, ease: easings.easeIn }
    }
  },
  
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, ease: easings.easeIn }
    }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: easings.easeOut }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.5, ease: easings.easeIn }
    }
  }
} as const;

// Animaciones de elementos
export const elementAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3, ease: easings.easeOut }
    }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: easings.easeOut }
    }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: easings.easeOut }
    }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: easings.easeOut }
    }
  },
  
  rotateIn: {
    initial: { opacity: 0, rotate: -180, scale: 0.8 },
    animate: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: easings.bounce }
    }
  }
} as const;

// Animaciones de lista
export const listAnimations = {
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: easings.easeOut }
    }
  }
} as const;

// Animaciones de hover
export const hoverAnimations = {
  scale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: easings.easeOut }
  },
  
  lift: {
    whileHover: { 
      y: -5,
      transition: { duration: 0.2, ease: easings.easeOut }
    }
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      transition: { duration: 0.2, ease: easings.easeOut }
    }
  }
} as const;

// Función helper para crear animaciones personalizadas
export function createAnimation(
  type: keyof typeof elementAnimations,
  delay: number = 0,
  duration: number = 0.4
): Variants {
  const baseAnimation = elementAnimations[type];
  return {
    ...baseAnimation,
    animate: {
      ...baseAnimation.animate,
      transition: {
        ...baseAnimation.animate?.transition,
        delay,
        duration
      }
    }
  };
}

// Función para animaciones de entrada escalonadas
export function createStaggeredAnimation(
  baseAnimation: Variants,
  staggerDelay: number = 0.1
): Variants {
  return {
    ...baseAnimation,
    animate: {
      ...baseAnimation.animate,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };
} 