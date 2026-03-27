
import React from 'react';
import { motion } from 'framer-motion';

export type RobotState = 'default' | 'hiding' | 'submitting';

interface RobotProps {
  state: RobotState;
}

const Robot: React.FC<RobotProps> = ({ state }) => {
  const eyeVariants = {
    default: { height: 12, opacity: 1, scaleY: 1 },
    hiding: { height: 2, opacity: 0.5, scaleY: 0.2 },
    submitting: { height: 14, opacity: 1, scaleY: 1.1 },
  };

  const armVariants = {
    default: { rotate: 0 },
    hiding: { rotate: 0 },
    submitting: { 
      rotate: [0, -40, 0, -40, 0],
      transition: { duration: 1, repeat: 1 }
    },
  };

  return (
    <div className="flex flex-col items-center justify-center mb-12 relative pt-10">
      {/* Arms */}
      <div className="absolute top-1/2 -translate-y-1/2 w-48 flex justify-between px-2 z-0">
        {/* Left Arm */}
        <motion.div 
          className="w-4 h-12 bg-slate-300 rounded-full origin-top"
          animate={state === 'submitting' ? { rotate: [0, 20, 0] } : { rotate: 0 }}
        />
        {/* Right Arm (Waving Arm) */}
        <motion.div 
          className="w-4 h-12 bg-slate-300 rounded-full origin-top"
          animate={armVariants[state]}
        />
      </div>

      {/* Main Body (Head/Torso combined in this design) */}
      <motion.div
        className="relative w-32 h-32 bg-slate-200 rounded-[2.5rem] border-4 border-slate-300 shadow-inner flex flex-col items-center justify-center overflow-hidden z-10"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Antenna */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-4 bg-slate-400">
          <motion.div 
            className="w-3 h-3 bg-blue-500 rounded-full -translate-x-1/3 -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>

        {/* Face Display */}
        <div className="w-24 h-16 bg-slate-800 rounded-2xl flex items-center justify-around px-4 relative">
          {/* Left Eye */}
          <motion.div
            className="w-4 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"
            animate={eyeVariants[state]}
            transition={{ duration: 0.25 }}
          />
          {/* Right Eye */}
          <motion.div
            className="w-4 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"
            animate={eyeVariants[state]}
            transition={{ duration: 0.25 }}
          />
          
          {/* Mouth */}
          <motion.div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full opacity-50"
            animate={{ 
              scaleX: state === 'submitting' ? 1.5 : 1,
              opacity: state === 'submitting' ? 0.8 : 0.4
            }}
          />
        </div>

        {/* Body details */}
        <div className="mt-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <div className="w-2 h-2 rounded-full bg-slate-400" />
        </div>
      </motion.div>

      {/* Legs */}
      <div className="flex gap-8 -mt-2 z-0">
        <div className="w-4 h-8 bg-slate-300 rounded-b-lg relative">
          {/* Sneaker Left */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-8 h-4 bg-slate-800 rounded-t-lg rounded-b-sm border-b-2 border-slate-600" />
        </div>
        <div className="w-4 h-8 bg-slate-300 rounded-b-lg relative">
          {/* Sneaker Right */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-8 h-4 bg-slate-800 rounded-t-lg rounded-b-sm border-b-2 border-slate-600" />
        </div>
      </div>
      
      {/* Robot Shadow */}
      <motion.div 
        className="w-32 h-2 bg-slate-200 rounded-full blur-md mt-6"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Robot;
