import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Clock, BookOpen, Award, Target, Briefcase } from "lucide-react"
import Link from "next/link"

const examCategories = [
  {
    id: "ias",
    title: "IAS (Civil Services)",
    subtitle: "Administrative Services",
    description: "Complete preparation for India's most prestigious civil service examination with comprehensive coverage of all three stages.",
    icon: Briefcase,
    features: ["Prelims + Mains + Interview", "Current Affairs", "Essay Writing", "Optional Subjects"],
    students: "250+",
    duration: "12-18 months",
    successRate: "95%",
    gradient: "from-blue-600 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    popular: true
  },
  {
    id: "ips",
    title: "IPS (Police Services)",
    subtitle: "Police & Security",
    description: "Specialized preparation for Indian Police Service with focus on law, order, and security administration.",
    icon: Target,
    features: ["Law & Order", "Criminal Justice", "Security Management", "Leadership Skills"],
    students: "150+",
    duration: "10-15 months",
    successRate: "92%",
    gradient: "from-green-600 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: "ifs",
    title: "IFS (Foreign Services)",
    subtitle: "Diplomatic Services",
    description: "Comprehensive training for Indian Foreign Service focusing on international relations and diplomacy.",
    icon: Award,
    features: ["International Relations", "Diplomacy", "Foreign Policy", "Cultural Studies"],
    students: "80+",
    duration: "12-16 months",
    successRate: "90%",
    gradient: "from-purple-600 to-violet-600",
    bgGradient: "from-purple-50 to-violet-50"
  },
  {
    id: "group-a",
    title: "Group A Services",
    subtitle: "Central Services",
    description: "Preparation for various Group A central government services including IRS, IRAS, and other specialized services.",
    icon: BookOpen,
    features: ["Tax Administration", "Revenue Services", "Audit & Accounts", "Statistical Services"],
    students: "200+",
    duration: "8-12 months",
    successRate: "88%",
    gradient: "from-orange-600 to-red-600",
    bgGradient: "from-orange-50 to-red-50"
  }
]

export default function ExamCategories() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            🎯 Specialized Preparation Tracks
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="text-primary">
              UPSC Path
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our specialized preparation programs designed for different UPSC services. 
            Each track is crafted by experts with service-specific curriculum and strategies.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {examCategories.map((category, index) => {
            const Icon = category.icon
            
            return (
              <div 
                key={category.id}
                className={`relative bg-gradient-to-br ${category.bgGradient} border border-gray-200 rounded-3xl p-8`}
              >
  
               
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {category.subtitle}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/70 rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mb-1 mx-auto">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">{category.students}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mb-1 mx-auto">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">{category.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mb-1 mx-auto">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">{category.successRate}</div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                </div>

                {/* CTA */}
                <Link href={`/dashboard/courses?category=${category.id}`}>
                  <Button className={`w-full bg-gradient-to-r ${category.gradient} hover:shadow-lg text-white border-0 rounded-full`}>
                    Explore {category.title} Program
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Additional Services */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Can't Find Your Service? We've Got You Covered!
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We offer preparation for 25+ central and state services. Get personalized guidance 
            for your specific service requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/courses">
              <Button variant="outline" className="rounded-full text-black w-full">
                View All Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="rounded-full border-2 border-white w-full">
                Get Custom Guidance
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
