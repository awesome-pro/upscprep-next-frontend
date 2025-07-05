import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { NavItems } from "./nav-Items";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";

export function Header() {

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-16 items-center mx-auto px-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Logo />
                        <NavItems className="hidden md:flex items-center space-x-6" />
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button className="hidden md:inline-flex" asChild>
                            <Link href="/auth/sign-up">Get Started</Link>
                        </Button>
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>
    );
}