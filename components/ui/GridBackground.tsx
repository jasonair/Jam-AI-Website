import { ReactNode } from 'react';

interface GridBackgroundProps {
  children: ReactNode;
  className?: string;
  opacity?: 'subtle' | 'normal' | 'strong';
  variant?: 'grid' | 'dots';
  fadeEdges?: boolean;
}

export default function GridBackground({ 
  children, 
  className = '',
  opacity = 'normal',
  variant = 'grid',
  fadeEdges = false
}: GridBackgroundProps) {
  const opacityClasses = {
    subtle: 'opacity-30',
    normal: 'opacity-50',
    strong: 'opacity-70'
  };

  return (
    <div className={`relative ${className}`}>
      {variant === 'grid' ? (
        <>
          {/* Grid background - Light mode */}
          <div 
            className={`absolute inset-0 pointer-events-none dark:hidden ${opacityClasses[opacity]}`}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(209 213 219) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(209 213 219) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              maskImage: fadeEdges ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' : undefined,
              WebkitMaskImage: fadeEdges ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' : undefined,
            }}
          />
          
          {/* Grid background - Dark mode */}
          <div 
            className={`absolute inset-0 pointer-events-none hidden dark:block ${opacityClasses[opacity]}`}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(55 65 81) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(55 65 81) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              maskImage: fadeEdges ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' : undefined,
              WebkitMaskImage: fadeEdges ? 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' : undefined,
            }}
          />
        </>
      ) : (
        <>
          {/* Dots background - Light mode */}
          <div 
            className={`absolute inset-0 pointer-events-none dark:hidden ${opacityClasses[opacity]}`}
            style={{
              backgroundImage: `radial-gradient(circle, rgb(209 213 219) 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Dots background - Dark mode */}
          <div 
            className={`absolute inset-0 pointer-events-none hidden dark:block ${opacityClasses[opacity]}`}
            style={{
              backgroundImage: `radial-gradient(circle, rgb(75 85 99) 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
