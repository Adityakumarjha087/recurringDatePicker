import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animationKey: string; // Made required to prevent empty keys
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  animationKey 
}) => {
  if (!animationKey) {
    console.error('AnimatedSection: animationKey is required and cannot be empty');
    return null;
  }
  
  return (
  <motion.div
    key={animationKey}
    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
    animate={{ 
      opacity: 1, 
      height: 'auto',
      transitionEnd: { overflow: 'visible' }
    }}
    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
    transition={{ 
      opacity: { duration: 0.2 },
      height: { duration: 0.3, ease: 'easeInOut' }
    }}
    className="overflow-hidden"
  >
    {children}
    </motion.div>
  );
}
