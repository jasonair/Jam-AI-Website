import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export default function Section({ 
  className, 
  spacing = 'lg', 
  children, 
  ...props 
}: SectionProps) {
  const spacings = {
    sm: 'py-12 sm:py-16',
    md: 'py-16 sm:py-20',
    lg: 'py-20 sm:py-28',
  };

  return (
    <section
      className={cn(spacings[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
