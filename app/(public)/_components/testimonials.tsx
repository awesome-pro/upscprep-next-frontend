import { Star, Quote, Award, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Priyash Kumar",
    rank: "AIR 231",
    service: "IAS",
    year: "2023",
    location: "Delhi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQnQHHu1nGLm_EMx_pplayi7WCcEkWKSbNEfW9X9ZE7me3qkTkQknCUyWsXeutt4pZhIE&usqp=CAU",
    rating: 5,
    quote: "The comprehensive study material and expert guidance helped me crack UPSC in my first attempt. The mock tests were exactly like the real exam pattern.",
    highlights: ["First Attempt", "Top 250 Rank", "Complete Preparation"]
  },
  {
    id: 2,
    name: "Rahul Kumar",
    rank: "AIR 459",
    service: "IPS",
    year: "2023",
    location: "Mumbai",
    image: "https://images.indianexpress.com/2019/04/kanishak759.jpg",
    rating: 5,
    quote: "The answer writing course was a game-changer for me. The personalized feedback and evaluation helped me improve significantly in the Mains exam.",
    highlights: ["Answer Writing Expert", "Mains Specialist", "IPS Selection"]
  },
  {
    id: 3,
    name: "Anjesh Patel",
    rank: "AIR 670",
    service: "IFS",
    year: "2023",
    location: "Bangalore",
    image: "https://sscportal.in/sites/default/files/ssc-cgl-preparation-strategy-by-topper-amit-jain-air-1.jpg",
    rating: 5,
    quote: "The current affairs coverage and international relations modules were exceptional. The faculty's expertise in foreign policy was remarkable.",
    highlights: ["IFS Success", "International Relations", "Current Affairs Master"]
  },
  {
    id: 4,
    name: "Vikash Singh",
    rank: "AIR 890",
    service: "IAS",
    year: "2022",
    location: "Patna",
    image: "https://static.india.com/wp-content/uploads/2024/04/Animesh.png?impolicy=Medium_Widthonly&w=400",
    rating: 5,
    quote: "Coming from a rural background, the online platform gave me access to the same quality education as metro students. Truly democratizing UPSC preparation.",
    highlights: ["Rural Background", "Online Success", "IAS Achievement"]
  },
]

const achievements = [
  {
    metric: "50+",
    label: "UPSC Selections",
    description: "Successfully cleared candidates",
    icon: "🏆"
  },
  {
    metric: "10+",
    label: "Top 100 Ranks",
    description: "Students in top 100",
    icon: "🥇"
  },
  {
    metric: "85%",
    label: "Success Rate",
    description: "Interview qualified students",
    icon: "📈"
  },
  {
    metric: "4.8/5",
    label: "Student Rating",
    description: "Average satisfaction score",
    icon: "⭐"
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            🎉 Success Stories
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Stories of{" "}
            <span className="text-primary">
              Success
            </span>
          </h2>
          
          <p className="text-md text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our successful students who achieved their UPSC dreams with our guidance. 
            Their success stories inspire thousands of aspirants every day.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{achievement.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {achievement.metric}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {achievement.label}
              </div>
              <div className="text-sm text-gray-600">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Image src={testimonial.image} alt={testimonial.name} width={100} height={100} className="rounded-full w-15 h-15" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-primary">{testimonial.rank}</span>
                      <span>•</span>
                      <span>{testimonial.service}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {testimonial.year}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-current" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {testimonial.highlights.map((highlight, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Trusted by aspirants from every corner of India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-sm">Verified Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-sm">Authentic Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">✓</span>
              </div>
              <span className="text-sm">UPSC Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
