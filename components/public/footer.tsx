import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Users,
  BookOpen,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const footerSections = [
  {
    title: "Courses",
    links: [
      { name: "UPSC Foundation", href: "/dashboard/courses/foundation" },
      { name: "Prelims Preparation", href: "/dashboard/courses/prelims" },
      { name: "Mains Preparation", href: "/dashboard/courses/mains" },
      { name: "Interview Guidance", href: "/dashboard/courses/interview" },
      { name: "Optional Subjects", href: "/dashboard/courses/optional" },
      { name: "Current Affairs", href: "/dashboard/courses/current-affairs" },
    ]
  },
  {
    title: "Services",
    links: [
      { name: "IAS Preparation", href: "/services/ias" },
      { name: "IPS Preparation", href: "/services/ips" },
      { name: "IFS Preparation", href: "/services/ifs" },
      { name: "Test Series", href: "/dashboard/test-series" },
      { name: "Answer Writing", href: "/services/answer-writing" },
      { name: "Mock Interviews", href: "/services/mock-interviews" },
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Study Materials", href: "/dashboard/study-materials" },
      { name: "Previous Papers", href: "/resources/previous-papers" },
      { name: "Success Stories", href: "/#testimonials" },
      { name: "Free Downloads", href: "/resources/downloads" },
      { name: "UPSC Updates", href: "/resources/updates" },
      { name: "Blog", href: "/blog" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/#faq" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Refund Policy", href: "/policies/refund" },
      { name: "Terms of Service", href: "/policies/terms" },
    ]
  }
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/upscprep", color: "hover:text-blue-600" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/upscprep", color: "hover:text-blue-400" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/upscprep", color: "hover:text-pink-600" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/upscprep", color: "hover:text-red-600" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/upscprep", color: "hover:text-blue-700" },
]

const achievements = [
  { icon: Users, count: "50,000+", label: "Students" },
  { icon: Award, count: "500+", label: "Selections" },
  { icon: BookOpen, count: "1000+", label: "Hours Content" },
  { icon: Star, count: "4.9/5", label: "Rating" },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/">
                <h1 className="text-2xl font-bold font-serif font-stretch-50% text-primary hover:text-primary/80 transition-all duration-300">UPSCprep</h1>
              </Link>
              <p className="text-gray-300 mt-4 mb-6 leading-relaxed">
                India's premier UPSC preparation platform trusted by 50,000+ aspirants. 
                We provide comprehensive courses, expert guidance, and proven strategies 
                to help you achieve your civil services dream.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91-8800-123-456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>support@upscprep.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>New Delhi, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <Link 
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300 ${social.color}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-5 h-5" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-300 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Achievement Stats */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {achievement.count}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {achievement.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm text-center lg:text-left">
              © 2024 UPSC Prep Platform. All rights reserved. Made with ❤️ for UPSC Aspirants.
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/policies/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/policies/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/policies/refund" className="text-gray-400 hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-2 lg:space-y-0 lg:space-x-8 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>SSL Secured Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>UPSC Verified Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Trusted by 50,000+ Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}