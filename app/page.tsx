'use client'

import PageTransition from '@/components/page-transition'
import dynamic from 'next/dynamic'

const Hero3D = dynamic(() => import('@/components/hero3d'), { ssr: false })

export default function HomePage() {
  return (
    <PageTransition>
      <div className="landing-3d-container">
        <Hero3D />
      </div>
    </PageTransition>
  )
}
