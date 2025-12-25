
'use client';

import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps, MotionProps {
  // You can add any other custom props here
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="w-full"
      >
        <Button
          ref={ref}
          className={cn(
            'w-full shadow-lg transition-shadow duration-300 hover:shadow-primary/40',
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
