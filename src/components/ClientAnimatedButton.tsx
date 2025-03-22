'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic import for AnimatedButton
const AnimatedButton = dynamic(
  () => import('@/components/AnimatedButton'),
  { ssr: false }
);

interface ClientAnimatedButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ClientAnimatedButton = ({
  href,
  children,
  variant,
  size,
  className
}: ClientAnimatedButtonProps) => {
  return (
    <AnimatedButton
      href={href}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </AnimatedButton>
  );
};

export default ClientAnimatedButton; 