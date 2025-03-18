
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-gray-700/60 py-2 px-4 rounded-lg flex items-center space-x-1">
        <motion.div 
          className="w-2 h-2 bg-white/70 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0 }}
        />
        <motion.div 
          className="w-2 h-2 bg-white/70 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.15 }}
        />
        <motion.div 
          className="w-2 h-2 bg-white/70 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
