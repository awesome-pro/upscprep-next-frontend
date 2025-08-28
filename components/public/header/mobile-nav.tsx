"use client";

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavItems } from "./nav-Items";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSheetStore } from "@/stores/use-sheet-store";
import { Logo } from "@/components/logo";

export function MobileNav() {
  const { isOpen, toggle, close } = useSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "open" : "closed"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 border-b">
          <Logo />
        </SheetHeader>
        <div className="p-4">
          <NavItems className="flex flex-col gap-3" isMobile />
          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full rounded-full border-primary text-primary" onClick={close}>
              <Link href="/auth/sign-in" className="rounded-full">Sign In</Link>
            </Button>
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-full" asChild onClick={close}>
              <Link href="/auth/sign-up" className="rounded-full">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}