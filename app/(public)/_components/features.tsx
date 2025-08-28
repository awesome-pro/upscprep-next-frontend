import { 
  BookOpen, 
  PenTool, 
  Users, 
  BarChart3, 
  Clock, 
  Award,
  Video,
  FileText,
  Target,
  Lightbulb,
  Calendar,
  MessageCircle
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Courses",
    description: "Complete UPSC syllabus coverage with structured modules, video lectures, and study materials prepared by top faculty.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: PenTool,
    title: "Mock Tests & Practice",
    description: "Unlimited mock tests, previous year papers, and practice questions with detailed explanations and performance analysis.",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Advanced analytics dashboard to track your progress, identify weak areas, and optimize your preparation strategy.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "One-on-one guidance from successful UPSC candidates and experienced faculty members for personalized support.",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Video,
    title: "Live Classes",
    description: "Interactive live sessions with doubt clearing, current affairs discussions, and exam strategy sessions.",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: FileText,
    title: "Study Materials",
    description: "Curated notes, mind maps, current affairs compilations, and downloadable resources for offline study.",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    icon: Target,
    title: "Answer Writing",
    description: "Dedicated answer writing practice with expert evaluation, feedback, and improvement suggestions.",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Built-in study planner, timetable creator, and time tracking tools to optimize your preparation schedule.",
    gradient: "from-pink-500 to-pink-600"
  },
  {
    icon: Award,
    title: "Test Series",
    description: "Comprehensive test series for Prelims and Mains with All India ranking and detailed performance reports.",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Lightbulb,
    title: "Smart Learning",
    description: "AI-powered recommendations for topics to focus on based on your performance and learning patterns.",
    gradient: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Calendar,
    title: "Current Affairs",
    description: "Daily current affairs updates, monthly magazines, and year-end compilations with MCQs and analysis.",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description: "Active community of aspirants for discussions, doubt sharing, and peer-to-peer learning support.",
    gradient: "from-violet-500 to-violet-600"
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-primary/10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            ✨ Complete UPSC Preparation Ecosystem
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{" "}
            <span className="text-primary">
              Crack UPSC
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform combines the best of traditional coaching with modern technology 
            to give you an edge in your UPSC preparation journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <div 
                key={index}
                className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Award className="w-4 h-4" />
            <span>Trusted by 50,000+ UPSC Aspirants</span>
          </div>
          
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">⭐</span>
            ))}
            <span className="ml-2 text-gray-600 font-medium">4.9/5 rating from our students</span>
          </div>
        </div>
      </div>
    </section>
  )
}
