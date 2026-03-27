
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500); // Exibe por 3.5 segundos antes de fechar
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border-4 border-blue-500"
          >
            <div className="w-[300px] h-[300px] flex items-center justify-center overflow-hidden rounded-2xl">
              {/* @ts-expect-error - Custom element dotlottie-wc */}
              <dotlottie-wc 
                src="https://lottie.host/6d7ccec7-9daf-4279-8cc2-cd2cc47ef086/vF7OCHJ1er.lottie" 
                style={{ width: '300px', height: '300px' }} 
                autoplay 
                loop
              ></dotlottie-wc>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Chamado Enviado!</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Redirecionando para o início...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;
