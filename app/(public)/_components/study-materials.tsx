import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Play, 
  FileText, 
  Download, 
  Clock, 
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Calendar,
  Bookmark,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

const studyMaterials = [
  {
    id: "video-lectures",
    title: "Video Lectures",
    description: "HD quality video lectures by top UPSC faculty covering complete syllabus",
    icon: Play,
    stats: { count: "2000+", label: "Hours of Content" },
    features: ["HD Quality", "Offline Download", "Speed Control", "Subtitles"],
    color: "blue",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "study-notes",
    title: "Comprehensive Notes",
    description: "Detailed study notes, mind maps, and chapter summaries for quick revision",
    icon: FileText,
    stats: { count: "500+", label: "Study Modules" },
    features: ["PDF Format", "Printable", "Mind Maps", "Quick Revision"],
    color: "green",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: "current-affairs",
    title: "Current Affairs",
    description: "Daily updates, monthly compilations, and yearly magazines with analysis",
    icon: Calendar,
    stats: { count: "365", label: "Days Coverage" },
    features: ["Daily Updates", "Monthly PDFs", "Yearly Compilation", "MCQ Practice"],
    color: "purple",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: "test-papers",
    title: "Previous Year Papers",
    description: "Solved question papers from last 20 years with detailed explanations",
    icon: BookOpen,
    stats: { count: "20", label: "Years Coverage" },
    features: ["Solved Papers", "Explanations", "Trend Analysis", "Topic-wise"],
    color: "orange",
    gradient: "from-orange-500 to-orange-600"
  }
]

const popularCourses = [
  {
    title: "UPSC Foundation Course",
    instructor: "Dr. Rajesh Kumar",
    rating: 4.9,
    students: "25,000+",
    duration: "12 months",
    price: "₹49,999",
    originalPrice: "₹79,999",
    image: "📚",
    features: ["Complete Syllabus", "Live Classes", "Doubt Clearing", "Mock Tests"]
  },
  {
    title: "Current Affairs Mastery",
    instructor: "Prof. Priya Sharma", 
    rating: 4.8,
    students: "18,000+",
    duration: "12 months",
    price: "₹19,999",
    originalPrice: "₹29,999",
    image: "📰",
    features: ["Daily Updates", "Monthly Tests", "Analysis", "Compilations"]
  },
  {
    title: "Answer Writing Course",
    instructor: "Dr. Amit Singh",
    rating: 4.9,
    students: "15,000+",
    duration: "6 months",
    price: "₹24,999",
    originalPrice: "₹39,999",
    image: "✍️",
    features: ["Expert Evaluation", "Personal Feedback", "Strategy Sessions", "Practice Tests"]
  }
]

export default function StudyMaterials() {
  return (
    <section className="py-20 bg-primary/10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            📚 Premium Study Resources
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            World-Class{" "}
            <span className="text-primary">
              Study Materials
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access our extensive library of curated study materials, video lectures, and practice resources 
            designed by UPSC experts and successful candidates.
          </p>
        </div>

        {/* Study Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {studyMaterials.map((material, index) => {
            const Icon = material.icon
            
            return (
              <div 
                key={material.id}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${material.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {material.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {material.description}
                </p>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-2xl font-bold text-gray-900">{material.stats.count}</div>
                  <div className="text-xs text-gray-500">{material.stats.label}</div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {material.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            )
          })}
        </div>

        {/* Resource Downloads */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Free Sample Materials Available
            </h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Download free sample notes, practice questions, and video lectures to experience 
              our quality before enrolling in any course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-white rounded-full">
                <Download className="mr-2 w-4 h-4" />
                Download Samples
              </Button>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/90 text-white border-0 rounded-full">
                <Bookmark className="mr-2 w-4 h-4" />
                Browse Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
