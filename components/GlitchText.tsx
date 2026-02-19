import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-blue opacity-70 animate-glitch translate-x-[2px] hidden group-hover:block">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-alert opacity-70 animate-glitch translate-x-[-2px] animation-delay-75 hidden group-hover:block">
        {text}
      </span>
    </Component>
  );
};

export default GlitchText;
