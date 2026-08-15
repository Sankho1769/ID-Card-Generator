import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export const Toast: React.FC = () => {
  const toastMessage = useBuilderStore((state) => state.toastMessage);
  const showToast = useBuilderStore((state) => state.showToast);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%]"
        >
          <div className="bg-[#FFFDF5] text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex items-center gap-3">
            <div className="p-2 bg-[#FEE101] rounded-lg border-2 border-black flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 text-xs md:text-sm font-bold leading-snug">
              {toastMessage}
            </div>
            <button
              onClick={() => showToast(null)}
              className="text-xs font-black uppercase underline hover:text-[#FF0080]"
            >
              DISMISS
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
