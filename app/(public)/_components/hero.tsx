"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Hero() {
  // Carousel state and data
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Your image data - replace with your actual image paths
  const carouselImages = [
    {
      src: "/hero.jpeg",
      alt: "UPSC Success Stories",
      title: "Success Stories"
    },
    {
      src: "/hero-2.webp", // Replace with your actual image paths
      alt: "Toppers",
      title: "Meet Our Toppers"
    },
    {
      src: "/hero-3.png",
      alt: "Youtube Lecture",
      title: "Your confidence will be skyrocketed"
    },
    {
      src: "/hero-4.png",
      alt: "Study Material",
      title: "Your Course in Progress"
    },
  ]

  // Auto-advance carousel
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
      }, 2500) // Change slide every 4 seconds

      return () => clearInterval(interval)
    }
  }, [isPaused, carouselImages.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <section className="pb-16 pt-10"> 
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🎯 India's Premier UPSC Preparation Platform
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master the{" "}
                <span className="text-primary">
                  UPSC Preparation
                </span>{" "}
                with Expert Guidance
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of successful aspirants who've cleared UPSC with our comprehensive 
                courses, mock tests, personalized mentorship, and cutting-edge preparation tools.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="rounded-full w-full">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="rounded-full w-full">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Expert Faculty
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Updated Syllabus
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                24/7 Support
              </div>
            </div>
          </div>

          {/* Right Content - Premium Carousel */}
          <div className="relative group z-40 shadow-2xl">
              {/* Carousel Wrapper */}
              <div className="relative w-full h-[300px] lg:h-[320px] overflow-hidden rounded-xl bg-white">
                {/* Images */}
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselImages.map((image, index) => (
                    <div key={index} className="min-w-full h-full relative">
                      <Image 
                        src={image.src} 
                        alt={image.alt} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {/* Image title overlay */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                          <p className="text-sm font-semibold text-gray-900">{image.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <Button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Previous image"
                  size={'icon'}
                >
                  <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
                </Button>
                
                <Button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Next image"
                  size={'icon'}
                >
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </Button>
              </div>

              {/* Dot Indicators */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-primary w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${((currentSlide + 1) / carouselImages.length) * 100}%` }}
                />
              </div>
            </div>

            
          </div>
        </div>
      {/* </div> */}
    </section>
  )
}