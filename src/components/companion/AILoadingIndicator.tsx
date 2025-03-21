
import React from 'react';
import { motion } from 'framer-motion';
import { CircleDashed } from 'lucide-react';

const AILoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-island-light rounded-2xl rounded-tl-none px-4 py-3">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mr-2 text-gray-400"
          >
            <CircleDashed size={18} />
          </motion.div>
          
          <div className="flex space-x-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-400"
                initial={{ y: 0 }}
                animate={{ 
                  y: [0, -6, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  delay: i * 0.1,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AILoadingIndicator;
