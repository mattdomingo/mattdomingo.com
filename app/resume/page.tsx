'use client'

import { useState, useEffect } from 'react'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

export default function ResumePage() {
  const [isLoading, setIsLoading] = useState(true)

  const handlePDFLoad = () => {
    setIsLoading(false)
  }

  // Auto-hide loading after 2 seconds regardless of iframe load event
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/documents/resume.pdf'
    link.download = 'Matt_Domingo_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div className="resume-viewer-page page-with-navbar">
        <div className="resume-viewer-container">
          <div className="resume-header">
            <h1 className="resume-title minecraft-text">RESUME VIEWER</h1>
            <div className="resume-controls">
              <button 
                onClick={handleDownload}
                className="minecraft-button resume-control-btn"
              >
                📄 DOWNLOAD PDF
              </button>
            </div>
          </div>

          <div className="resume-viewer-frame">
            {isLoading && (
              <div className="resume-loading">
                <div className="minecraft-text">Loading resume...</div>
              </div>
            )}
            
            <iframe
              src="/documents/resume.pdf"
              className="resume-pdf-viewer"
              title="Matt Domingo Resume"
              onLoad={handlePDFLoad}
            />
          </div>

          <div className="resume-fallback">
            <p className="minecraft-text">
              Can&apos;t view the PDF? 
              <button 
                onClick={handleDownload}
                className="download-fallback-btn minecraft-text"
              >
                Click here to download
              </button>
            </p>
          </div>
        </div>
        </div>
      </PageTransition>
    </>
  )
} 