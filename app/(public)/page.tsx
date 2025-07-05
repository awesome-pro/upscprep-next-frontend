import React from 'react'
import Hero from './_components/hero'
import Features from './_components/features'
import StudyMaterials from './_components/study-materials'
import Pricing from './_components/pricing'
import Testimonials from './_components/testimonials'
import FAQ from './_components/faq'
import CTA from './_components/cta'

export default function MainPage() {
  return (
      <>
        <Hero />
        <Features />
        <StudyMaterials />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </>
  )
}
