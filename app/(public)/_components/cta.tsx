import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Award, Clock, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 ">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main CTA Content */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              🚀 Limited Time Offer - 20% OFF
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Your UPSC Success
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Starts Today
              </span>
            </h2>
            
            <p className="text-md text-white mb-8 leading-relaxed max-w-3xl mx-auto">
              Join 50,000+ aspirants who chose us and achieved their UPSC dreams. 
              Don't let another year pass by - start your success journey now!
            </p>
          </div>


          {/* CTA Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link href="/auth/sign-up">
               <Button
               className="w-full rounded-full text-black"
               variant={'outline'}
               >
                Start Free Trial Now
                <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/dashboard/courses">
                <Button
                  className="w-full rounded-full text-white"
                  variant={'link'}
                  >Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
