import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">
              RasPREP
            </h3>
            <p className="text-muted-foreground mb-4">
              Empowering aspirants to achieve their dreams in civil services and
              government jobs.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-600">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Study Materials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-blue-600">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              Contact
            </h3>
            <p className="text-muted-foreground mb-2">1234 Exam Prep Street</p>
            <p className="text-muted-foreground mb-2">New Delhi, 110001</p>
            <p className="text-muted-foreground mb-2">India</p>
            <p className="text-muted-foreground mb-2">Phone: +91 98765 43210</p>
            <p className="text-muted-foreground mb-2">Email: info@rasprep.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RasPREP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
