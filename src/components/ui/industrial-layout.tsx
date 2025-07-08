import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SkipToContent } from './industrial-accessibility';
import { useReducedMotion } from './industrial-accessibility';

interface IndustrialLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: 'grid' | 'steel' | 'gradient' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  responsive?: boolean;
  includeSkipLink?: boolean;
  mainContentId?: string;
}

const backgroundStyles = {
  grid: 'bg-metal-grid bg-gray-50',
  steel: 'bg-brushed-steel bg-gray-100',
  gradient: 'bg-industrial-gradient',
  none: '',
};

const paddingStyles = {
  none: '',
  sm: 'p-4 sm:p-6',
  md: 'p-3 sm:p-6 md:p-8',
  lg: 'p-6 sm:p-8 md:p-10 lg:p-12',
  xl: 'p-8 sm:p-10 md:p-12 lg:p-16',
};

const IndustrialLayout = React.forwardRef<
  HTMLDivElement,
  IndustrialLayoutProps
>(
  (
    {
      background = 'grid',
      padding = 'md',
      animated = false,
      responsive = true,
      includeSkipLink = true,
      mainContentId = 'main-content',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const baseStyles = cn(
      'min-h-screen font-industrial-body',
      'transition-all duration-300 ease-in-out',
      responsive && 'overflow-x-hidden', // Prevent horizontal scroll on mobile
      backgroundStyles[background],
      paddingStyles[padding],
      className
    );

    const layoutContent = (
      <>
        {includeSkipLink && <SkipToContent href={`#${mainContentId}`} />}
        <main id={mainContentId} className="focus:outline-none" tabIndex={-1}>
          {children}
        </main>
      </>
    );

    if (shouldAnimate) {
      return (
        <motion.div
          ref={ref}
          className={baseStyles}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {layoutContent}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseStyles} {...props}>
        {layoutContent}
      </div>
    );
  }
);

IndustrialLayout.displayName = 'IndustrialLayout';

// Industrial Container Component
interface IndustrialContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  responsive?: boolean;
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const IndustrialContainer = React.forwardRef<
  HTMLDivElement,
  IndustrialContainerProps
>(
  (
    { size = 'lg', center = true, responsive = true, className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        containerSizes[size],
        center && 'mx-auto',
        'w-full',
        responsive && 'px-2 xs:px-4 sm:px-6 lg:px-8', // Responsive horizontal padding
        className
      )}
      {...props}
    />
  )
);

IndustrialContainer.displayName = 'IndustrialContainer';

// Industrial Header Component
interface IndustrialHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  accent?: boolean;
}

const headerSizes = {
  1: 'text-industrial-4xl font-industrial-heading font-black text-industrial-gunmetal-900',
  2: 'text-industrial-3xl font-industrial-heading font-bold text-industrial-gunmetal-800',
  3: 'text-industrial-2xl font-industrial-heading font-bold text-industrial-gunmetal-800',
  4: 'text-industrial-xl font-industrial-heading font-semibold text-industrial-gunmetal-700',
  5: 'text-industrial-lg font-industrial-heading font-semibold text-industrial-gunmetal-700',
  6: 'text-industrial-base font-industrial-heading font-medium text-industrial-gunmetal-600',
};

const IndustrialHeader = React.forwardRef<
  HTMLHeadingElement,
  IndustrialHeaderProps
>(({ level = 2, accent = false, className, children, ...props }, ref) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return React.createElement(
    Tag,
    {
      ref,
      className: cn(
        headerSizes[level],
        'tracking-tight leading-tight',
        accent && 'border-l-4 border-industrial-safety-400 pl-4',
        className
      ),
      ...props,
    },
    children
  );
});

IndustrialHeader.displayName = 'IndustrialHeader';

export { IndustrialLayout, IndustrialContainer, IndustrialHeader };
