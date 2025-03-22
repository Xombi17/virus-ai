'use client';

import { Parallax, Background } from 'react-parallax';

interface ParallaxSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  strength?: number;
  children?: React.ReactNode;
}

const ParallaxSection = ({
  title,
  subtitle,
  backgroundImage,
  strength = 300,
  children
}: ParallaxSectionProps) => {
  return (
    <Parallax
      blur={{ min: -15, max: 15 }}
      bgImage={backgroundImage}
      bgImageAlt={title}
      strength={strength}
      className="w-full"
    >
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center text-white z-10 p-8 max-w-4xl mx-auto bg-black/50 backdrop-blur-sm rounded-xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-xl mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </Parallax>
  );
};

export default ParallaxSection; 