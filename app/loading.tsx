import { LoaderIcon } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <section className='flex flex-col items-center justify-center h-screen w-screen'>
      <LoaderIcon className='animate-spin w-4 h-4 font-bold text-primary' />
      <p className='text-lg font-semibold mt-2 text-primary'>Loading...</p>
    </section>
  )
}
