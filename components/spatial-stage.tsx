'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const SpatialCanvas = dynamic(() => import('./spatial-canvas'), { ssr: false, loading: () => null })

export function SpatialStage() {
  const [ready, setReady] = useState(false)
  return <div className={`spatial-stage ${ready ? 'is-ready' : ''}`} aria-hidden="true">
    <div className="spatial-fallback"><div /><div /><div /></div>
    <SpatialCanvas onReady={setReady} />
    <div className="scene-vignette" />
    <div className="scene-caption mono"><span>FIG. 01 / EMERGENT STRUCTURE</span><span>ORDER FROM COMPLEXITY</span></div>
  </div>
}
