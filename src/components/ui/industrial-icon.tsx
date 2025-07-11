import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Settings,
  Factory,
  Wrench,
  Cog,
  Hammer,
  HardHat,
  Zap,
  CircuitBoard,
} from 'lucide-react';

interface IndustrialIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon:
    | 'gear'
    | 'factory'
    | 'wrench'
    | 'cog'
    | 'hammer'
    | 'hardhat'
    | 'bolt'
    | 'circuit';
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  animated?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white';
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const iconColors = {
  primary: 'text-industrial-gunmetal-800',
  secondary: 'text-industrial-navy-800',
  accent: 'text-industrial-safety-500',
  muted: 'text-industrial-gunmetal-600',
  white: 'text-white',
};

const iconComponents = {
  gear: Settings,
  factory: Factory,
  wrench: Wrench,
  cog: Cog,
  hammer: Hammer,
  hardhat: HardHat,
  bolt: Zap,
  circuit: CircuitBoard,
};

const IndustrialIcon = React.forwardRef<HTMLDivElement, IndustrialIconProps>(
  (
    {
      icon,
      size = 'md',
      animated = false,
      color = 'primary',
      className,
      ...props
    },
    ref
  ) => {
    const IconComponent = iconComponents[icon];

    // Handle numeric sizes
    const sizeClass =
      typeof size === 'number' ? `h-${size} w-${size}` : iconSizes[size];

    const iconClass = cn(sizeClass, iconColors[color]);

    if (animated && (icon === 'gear' || icon === 'cog')) {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center justify-center', className)}
          {...props}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <IconComponent className={iconClass} />
          </motion.div>
        </div>
      );
    }

    if (animated) {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center justify-center', className)}
          {...props}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <IconComponent className={iconClass} />
          </motion.div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <IconComponent className={iconClass} />
      </div>
    );
  }
);

IndustrialIcon.displayName = 'IndustrialIcon';

export { IndustrialIcon };
