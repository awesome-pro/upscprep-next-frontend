"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    category: "General",
    questions: [
      {
        id: 1,
        question: "What makes your UPSC preparation platform different from others?",
        answer: "Our platform combines the best of traditional coaching with modern technology. We offer personalized learning paths, AI-powered analytics, expert faculty from top coaching institutes, and a proven track record with 500+ successful selections. Our comprehensive approach covers all three stages of UPSC with specialized courses for different services."
      },
      {
        id: 2,
        question: "Do you provide coaching for all UPSC services?",
        answer: "Yes, we provide specialized preparation for all major UPSC services including IAS, IPS, IFS, IRS, and other Group A services. Each service has its own customized curriculum, study materials, and expert guidance tailored to specific requirements."
      },
      {
        id: 3,
        question: "Is this suitable for beginners who are new to UPSC preparation?",
        answer: "Absolutely! Our Foundation course is specifically designed for beginners. We start with UPSC basics, exam pattern understanding, syllabus breakdown, and gradually build up your knowledge. Our mentors provide step-by-step guidance throughout your journey."
      }
    ]
  },
  {
    category: "Courses & Content",
    questions: [
      {
        id: 4,
        question: "How often is the content updated, especially current affairs?",
        answer: "Current affairs are updated daily with comprehensive analysis. Monthly magazines are released with important events compilation. All study materials are reviewed and updated annually to match the latest UPSC syllabus and pattern changes. Video lectures are refreshed based on recent exam trends."
      },
      {
        id: 5,
        question: "Can I access the courses offline?",
        answer: "Yes, our mobile app allows you to download video lectures, PDFs, and study materials for offline access. This is perfect for students in areas with limited internet connectivity or those who prefer studying on the go."
      },
      {
        id: 6,
        question: "What is included in the answer writing course?",
        answer: "Our answer writing course includes expert evaluation of your answers, detailed feedback, model answers, writing strategy sessions, time management techniques, and personalized improvement plans. You'll get evaluation from successful UPSC candidates and experienced faculty."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        id: 7,
        question: "Do you offer EMI options for course payments?",
        answer: "Yes, we offer flexible EMI options starting from ₹1,999/month. You can choose from 3, 6, 9, or 12-month EMI plans. We also provide special discounts for upfront payments and student-friendly pricing options."
      },
      {
        id: 8,
        question: "Is there a money-back guarantee?",
        answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our courses. Additionally, we have a success guarantee program where we provide extended support if you don't clear the exam in your first attempt with us."
      },
      {
        id: 9,
        question: "Are there any hidden charges or additional fees?",
        answer: "No, there are no hidden charges. The price you see is what you pay. All mentioned features, study materials, mock tests, and support are included in the course fee. Additional services like one-on-one mentorship may have separate charges which are clearly mentioned."
      }
    ]
  },
  {
    category: "Support & Mentorship",
    questions: [
      {
        id: 10,
        question: "How does the mentorship program work?",
        answer: "Our mentorship program pairs you with successful UPSC candidates or experienced faculty members. You get weekly one-on-one sessions, personalized study plans, doubt resolution, motivation support, and strategic guidance throughout your preparation journey."
      },
      {
        id: 11,
        question: "What kind of doubt resolution support do you provide?",
        answer: "We offer multiple doubt resolution channels: live doubt clearing sessions, WhatsApp support, community forums, email support, and direct faculty access (in premium plans). Most doubts are resolved within 24 hours."
      },
      {
        id: 12,
        question: "Do you provide interview guidance and mock interviews?",
        answer: "Yes, our Complete and Mentorship plans include comprehensive interview preparation with mock interviews conducted by former UPSC officers, personality development sessions, current affairs discussions, and stress management techniques."
      }
    ]
  },
  {
    category: "Technical & Access",
    questions: [
      {
        id: 13,
        question: "What devices can I use to access the platform?",
        answer: "Our platform is accessible on all devices - computers, laptops, tablets, and smartphones. We have dedicated mobile apps for Android and iOS with offline download capabilities. The web platform works on all modern browsers."
      },
      {
        id: 14,
        question: "What if I face technical issues or need help navigating the platform?",
        answer: "We have a dedicated technical support team available 24/7. You can reach out via chat, email, or phone. We also provide platform orientation sessions for new users and detailed video guides for all features."
      },
      {
        id: 15,
        question: "Can I access my course after the subscription expires?",
        answer: "You get lifetime access to downloaded materials and notes. However, live features like doubt resolution, new content updates, and mock tests require an active subscription. We offer renewal discounts for existing students."
      }
    ]
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState("General")

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))
  const activeFAQs = faqs.find(faq => faq.category === activeCategory)?.questions || []

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            ❓ Frequently Asked Questions
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Got{" "}
            <span className="text-primary">
              Questions?
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about our UPSC preparation platform, 
            courses, and services. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {activeFAQs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-8 pb-6">
                    <div className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions Section */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our support team is here to help you with any questions about our platform, 
                courses, or your UPSC preparation journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Live Chat */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Chat with our support team instantly
                </p>
                <Button className="w-full bg-primary hover:bg-primary/80 text-white rounded-full">
                  Start Chat
                </Button>
              </div>

              {/* Phone Support */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Call us for immediate assistance
                </p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full">
                  +91-8800-123-456
                </Button>
              </div>

              {/* Email Support */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Send us your detailed questions
                </p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full">
                  Send Email
                </Button>
              </div>
            </div>

            {/* Help Center Link */}
            <div className="text-center">
              <Link href="/help" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <HelpCircle className="w-5 h-5 mr-2" />
                Visit our comprehensive Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
