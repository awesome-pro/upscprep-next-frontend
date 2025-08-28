"use client"

import { Button } from "@/components/ui/button";
import { NavItems } from "./nav-Items";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Mail, Star } from "lucide-react";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Top bar with contact info - hidden on mobile */}
            <div className="hidden lg:block bg-primary text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>+91-8800-123-456</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>support@upscprep.com</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-300 fill-current" />
                                ))}
                                <span className="ml-1">4.9/5 from 50,000+ students</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/60 backdrop-blur-md border-b shadow-lg' 
                    : 'bg-white border-b'
            }`}>
                <div className="mx-auto px-4">
                    <div className="flex h-10 lg:h-20 items-center justify-between">
                        {/* Logo and Navigation */}
                        <div className="flex items-center space-x-8">
                             <Link href="/">
                                <h1 className="text-2xl font-bold font-serif font-stretch-50% text-primary hover:text-primary/80 transition-all duration-300">UPSCprep</h1>
                             </Link>
                            <NavItems className="hidden lg:flex items-center space-x-8" />
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">
                            {/* Desktop CTA buttons */}
                            <div className="hidden md:flex items-center space-x-3">
                                <Link href="/auth/sign-in">
                                    <Button 
                                        variant="ghost" 
                                        className="text-gray-600 hover:text-primary font-medium rounded-full"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/sign-up">
                                    <Button 
                                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Start Free Trial
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile navigation */}
                            <MobileNav />
                        </div>
                    </div>
                </div>

                {/* Mobile CTA bar - shown only on mobile */}
                <div className="md:hidden bg-primary/5 border-t px-4 py-3">
                    <div className="flex space-x-2">
                        <Link href="/auth/sign-in" className="flex-1">
                            <Button 
                                variant="outline" 
                                className="w-full border-primary text-primary hover:bg-primary/10 rounded-full"
                                size="sm"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/auth/sign-up" className="flex-1">
                            <Button 
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                                size="sm"
                            >
                                Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
}