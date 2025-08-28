import { Button } from "@/components/ui/button"
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Gift,
  ArrowRight,
  Users,
  Clock,
  BookOpen,
  Award,
  Video,
  FileText,
  MessageCircle,
  Target,
  Shield
} from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    id: "basic",
    name: "Foundation",
    subtitle: "Perfect for beginners",
    price: "₹19,999",
    originalPrice: "₹29,999",
    duration: "12 months",
    discount: "33% OFF",
    popular: false,
    icon: BookOpen,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    features: [
      "Complete UPSC syllabus coverage",
      "500+ video lectures",
      "Basic study materials (PDF)",
      "Monthly current affairs",
      "Basic mock tests (20)",
      "Community forum access",
      "Email support",
      "Mobile app access"
    ],
    notIncluded: [
      "Live classes",
      "Personal mentorship",
      "Answer writing evaluation",
      "Advanced analytics"
    ]
  },
  {
    id: "premium",
    name: "Complete",
    subtitle: "Most popular choice",
    price: "₹49,999",
    originalPrice: "₹79,999",
    duration: "18 months",
    discount: "37% OFF",
    popular: true,
    icon: Star,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    features: [
      "Everything in Foundation",
      "1000+ HD video lectures",
      "Premium study materials",
      "Daily current affairs",
      "Unlimited mock tests",
      "Live doubt clearing sessions",
      "Answer writing course",
      "Performance analytics",
      "Previous year papers (20 years)",
      "Monthly magazines",
      "WhatsApp support",
      "Interview guidance"
    ],
    notIncluded: [
      "1-on-1 mentorship",
      "Custom study plan"
    ]
  },
  {
    id: "ultimate",
    name: "Mentorship",
    subtitle: "Complete guidance",
    price: "₹99,999",
    originalPrice: "₹1,49,999",
    duration: "24 months",
    discount: "33% OFF",
    popular: false,
    icon: Crown,
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-100",
    features: [
      "Everything in Complete",
      "Personal mentor assignment",
      "Weekly 1-on-1 sessions",
      "Custom study plan",
      "Priority doubt resolution",
      "Direct faculty access",
      "Interview mock sessions",
      "Personality development",
      "Career counseling",
      "Success guarantee*",
      "24/7 phone support",
      "Exclusive masterclasses"
    ],
    notIncluded: []
  }
]

const addOns = [
  {
    name: "Test Series Pro",
    price: "₹9,999",
    description: "Advanced test series with AI analysis",
    icon: Target
  },
  {
    name: "Answer Writing Master",
    price: "₹14,999", 
    description: "Expert evaluation and feedback",
    icon: FileText
  },
  {
    name: "Interview Preparation",
    price: "₹19,999",
    description: "Mock interviews with former officers",
    icon: Users
  }
]

export default function Pricing() {
  return (
    <section className="py-20 bg-primary/10" id="pricing">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            💎 Flexible Pricing Plans
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="text-primary">
              Success Plan
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flexible pricing options designed for every stage of your UPSC journey. 
            All plans include our success guarantee and money-back promise.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            
            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:z-10 transition-all duration-300 ${
                  plan.popular 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.discount}
                  </div>
                </div>

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} text-white mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.subtitle}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <div className="text-left">
                        <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                        <div className="text-sm text-gray-600">for {plan.duration}</div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center">
                      <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">{plan.duration}</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">All Access</div>
                    </div>
                    <div className="text-center">
                      <Award className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600 text-center">Guarantee</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3 opacity-50">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-500 text-sm leading-relaxed line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href={`/auth/sign-up?plan=${plan.id}`}>
                  <Button 
                    className={`w-full py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-primary'
                        : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                {plan.popular && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Have questions about our pricing?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="#faq" className="text-primary hover:text-purple-700 hover:underline">
              Payment Options
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="#faq" className="text-purple-600 hover:text-purple-700 hover:underline">
              EMI Available
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="#faq" className="text-purple-600 hover:text-purple-700 hover:underline">
              Student Discounts
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 hover:underline">
              Custom Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
