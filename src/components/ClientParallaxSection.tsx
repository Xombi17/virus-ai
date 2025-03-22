'use client';

import dynamic from 'next/dynamic';

// Dynamic import for ParallaxSection to ensure it loads properly
const ParallaxSection = dynamic(
  () => import('@/components/ParallaxSection'),
  { ssr: false }
);

interface ClientParallaxSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  strength?: number;
  children?: React.ReactNode;
}

const ClientParallaxSection = ({
  title,
  subtitle,
  backgroundImage,
  strength,
  children
}: ClientParallaxSectionProps) => {
  return (
    <ParallaxSection
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
      strength={strength}
    >
      {children}
    </ParallaxSection>
  );
};

export default ClientParallaxSection; 