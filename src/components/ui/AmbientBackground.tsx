'use client';

import { motion } from 'framer-motion';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <motion.div
        className="absolute h-[40%] w-[40%] rounded-full bg-blue-600/20 blur-[120px]"
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-20%', '30%', '-20%'],
        }}
        transition={{
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
      <motion.div
        className="absolute h-[40%] w-[40%] rounded-full bg-purple-600/20 blur-[120px]"
        animate={{
          x: ['80%', '50%', '80%'],
          y: ['60%', '20%', '60%'],
        }}
        transition={{
          duration: 25,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 5,
        }}
      />
    </div>
  );
}
