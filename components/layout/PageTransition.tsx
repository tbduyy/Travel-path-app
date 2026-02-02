"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

export default function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
