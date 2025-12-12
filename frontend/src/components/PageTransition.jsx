import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ y: 40 }}
      animate={{ 
        y: 0,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }}
      exit={{ 
        y: -40,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

