import React from 'react'
import Hero from './_components/hero'
import Features from './_components/features'
import ExamCategories from './_components/exam-categories'
import StudyMaterials from './_components/study-materials'
import Testimonials from './_components/testimonials'
import Pricing from './_components/pricing'
import FAQ from './_components/faq'
import CTA from './_components/cta'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Exam Categories Section */}
      <ExamCategories />
      
      {/* Study Materials Section */}
      <StudyMaterials />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* Final CTA Section */}
      <CTA />
    </main>
  )
}
