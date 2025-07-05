import { IconExclamationMark } from '@tabler/icons-react';
import React from 'react'

export default function Error(
    { error }: { error: Error }
) {
    console.error(error);
  return (
    <section className="flex items-center justify-center h-screen">
        <IconExclamationMark className="h-12 w-12 text-red-500" />
        <h1 className="text-3xl font-bold">Error</h1>
        <p className="text-red-500">{error.message}</p>
    </section>
  )
}
