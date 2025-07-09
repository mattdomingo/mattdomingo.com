"use client"

import { useState } from "react"
import MinecraftButton from "./minecraft-button"

export default function ContactTrading() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Your message has been sent successfully!",
    })

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    })

    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: "",
      })
    }, 5000)
  }

  return (
    <div className="minecraft-trading-post bg-[#8B4513] border-8 border-t-[#A86A3D] border-l-[#A86A3D] border-r-[#6A320E] border-b-[#6A320E] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="minecraft-villager-side">
          <div className="minecraft-frame p-4 bg-[#7D7D7D] border-4 border-t-[#A5A5A5] border-l-[#A5A5A5] border-r-[#555555] border-b-[#555555] mb-6">
            <h3 className="minecraft-text text-xl mb-4">TRADE WITH ME</h3>
            <p className="mb-4">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <p>Fill out the form with your message, and I'll get back to you as soon as possible!</p>
          </div>

          <div className="minecraft-frame p-4 bg-[#7D7D7D] border-4 border-t-[#A5A5A5] border-l-[#A5A5A5] border-r-[#555555] border-b-[#555555]">
            <h3 className="minecraft-text text-xl mb-4">DOWNLOAD RESUME</h3>
            <MinecraftButton
              href="/resume.pdf"
              variant="wood"
              className="w-full flex justify-center items-center gap-2"
            >
              📄 Resume.pdf
            </MinecraftButton>
          </div>
        </div>

        <div className="minecraft-player-side">
          <form onSubmit={handleSubmit} className="minecraft-form">
            <div className="mb-4">
              <label htmlFor="name" className="block minecraft-text mb-2">
                YOUR NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-[#C6C6C6] border-4 border-t-[#555555] border-l-[#555555] border-r-[#A5A5A5] border-b-[#A5A5A5] focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block minecraft-text mb-2">
                YOUR EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 bg-[#C6C6C6] border-4 border-t-[#555555] border-l-[#555555] border-r-[#A5A5A5] border-b-[#A5A5A5] focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block minecraft-text mb-2">
                YOUR MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-2 bg-[#C6C6C6] border-4 border-t-[#555555] border-l-[#555555] border-r-[#A5A5A5] border-b-[#A5A5A5] focus:outline-none resize-none"
              ></textarea>
            </div>

            <MinecraftButton variant="diamond" className="w-full flex justify-center">
              SEND MESSAGE
            </MinecraftButton>

            {formStatus.submitted && (
              <div className={`mt-4 p-3 text-center ${formStatus.success ? "bg-green-700" : "bg-red-700"} text-white`}>
                {formStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
