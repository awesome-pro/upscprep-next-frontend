"use client";

import { ROOT_LAYOUT_HEADER_NAV_ITEMS } from "@/data/root-layout-header-nav-items";
import { useSheetStore } from "@/stores/use-sheet-store";
import { motion, Variants, easeInOut } from "framer-motion";
import Link from "next/link";


interface NavItemsProps {
  className?: string;
  isMobile?: boolean;
}
const itemVariants: Variants = {
  closed: { opacity: 0, x: -8 },
  open: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.2, 
      ease: easeInOut, 
      // The delay will be calculated using the custom prop
      staggerChildren: 0.1 
    } 
  }
};

const childVariants: Variants = {
  closed: { opacity: 0, x: -8 },
  open: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.2, 
      ease: easeInOut 
    } 
  }
};

export function NavItems({ className, isMobile }: NavItemsProps) {
  const closeSheet = useSheetStore((state) => state.close);
  const handleClick = () => {
    if (isMobile) {
      closeSheet();
    }
  };

  return (
    <motion.div 
      className={className}
      variants={isMobile ? itemVariants : undefined}
      initial={isMobile ? "closed" : undefined}
      animate={isMobile ? "open" : undefined}
    >
      {ROOT_LAYOUT_HEADER_NAV_ITEMS.map((item, i) => (
        <motion.div
          key={item.name}
          custom={i}
          variants={isMobile ? childVariants : undefined}
          initial={isMobile ? "closed" : undefined}
          animate={isMobile ? "open" : undefined}
        >
          <Link
            href={item.href}
            className={`${isMobile
              ? "block w-full p-3 text-lg hover:bg-accent rounded-lg"
              : "text-sm font-medium transition-colors hover:text-primary"
              }`}
              onClick={handleClick}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}