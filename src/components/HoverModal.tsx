import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HoverModalProps {
  children: ReactNode;
  content: ReactNode;
}

export function HoverModal({ children, content }: HoverModalProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3 w-max max-w-[90vw] p-4 bg-white/80 backdrop-blur-md border border-slate-100 shadow-2xl rounded-2xl pointer-events-none"
          >
            {/* Pointer triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 transform rotate-45" />
            <div className="relative z-10 text-sm text-slate-600 font-sans">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
