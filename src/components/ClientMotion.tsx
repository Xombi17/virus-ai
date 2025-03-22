'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileInView?: any;
  whileHover?: any;
  whileTap?: any;
  viewport?: any;
}

export const MotionDiv = ({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileInView,
  whileHover,
  whileTap,
  viewport
}: MotionProps) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileInView={whileInView}
      whileHover={whileHover}
      whileTap={whileTap}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
};

export const MotionH1 = ({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileInView,
  whileHover,
  whileTap,
  viewport
}: MotionProps) => {
  return (
    <motion.h1
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileInView={whileInView}
      whileHover={whileHover}
      whileTap={whileTap}
      viewport={viewport}
    >
      {children}
    </motion.h1>
  );
};

export const MotionP = ({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileInView,
  whileHover,
  whileTap,
  viewport
}: MotionProps) => {
  return (
    <motion.p
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileInView={whileInView}
      whileHover={whileHover}
      whileTap={whileTap}
      viewport={viewport}
    >
      {children}
    </motion.p>
  );
}; 