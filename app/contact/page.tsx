'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MinecraftNavbar from "@/components/minecraft-navbar"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Message sent! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleResumeDownload = () => {
    const link = document.createElement('a')
    link.href = '/documents/resume.pdf'
    link.download = 'Matt_Domingo_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleResumeView = () => {
    router.push('/resume')
  }

  return (
    <>
      <MinecraftNavbar />
      <div className="trading-post-page page-with-navbar">
        <h1 className="trading-post-title minecraft-text">TRADING POST</h1>
        
        <div className="trading-post-container">
          <div className="trading-post-main">
            {/* Left Side - Trade Info */}
            <div className="trade-section">
              <div className="trade-with-me-box">
                <h2 className="trade-section-title minecraft-text">TRADE WITH ME</h2>
                <p className="trade-description minecraft-text">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                <p className="trade-description minecraft-text">
                  Fill out the form with your message, and I'll get back to you as soon as possible!
                </p>
              </div>
              
              <div className="resume-download-box">
                <h3 className="resume-section-title minecraft-text">RESUME</h3>
                <div className="resume-buttons">
                  <button 
                    onClick={handleResumeView}
                    className="resume-view-btn minecraft-text"
                  >
                    👁️ VIEW RESUME
                  </button>
                  <button 
                    onClick={handleResumeDownload}
                    className="resume-download-btn minecraft-text"
                  >
                    📄 DOWNLOAD
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="contact-form-section">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label minecraft-text">YOUR NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label minecraft-text">YOUR EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label minecraft-text">YOUR MESSAGE</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="send-message-btn minecraft-text">
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="find-me-section">
          <h3 className="find-me-title minecraft-text">FIND ME ONLINE</h3>
          <div className="social-links">
            <a href="https://github.com/mattdomingo" target="_blank" rel="noopener noreferrer" className="social-link github">
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/mattdomingo" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://twitter.com/mattdomingo" target="_blank" rel="noopener noreferrer" className="social-link twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="mailto:matt@mattdomingo.com" className="social-link email">
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819L12 8.773l6.545-4.952h3.819c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
