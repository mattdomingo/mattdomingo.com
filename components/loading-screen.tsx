'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FUN_FACTS = [
  "I'm an incoming SWE @ Visa",
  "I'm an Eagle Scout!",
  "I love EDM and DJing!",
  "BEAR DOWN!",
  "I am a videographer @mattdomingomedia",
  "I love KBBQ + Soju",
  "I love pottery!",
  "I love to ski!",
  "I do hot yoga sculpt classes!",
  "Probably trying to fix my golf swing...",
  "Huge F1 fan, go Red Bull!",
  "My favorite food is sushi!"
]

interface LoadingScreenProps {
  readonly progress?: number
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  useEffect(() => {
    // Set initial random fact
    setCurrentFactIndex(Math.floor(Math.random() * FUN_FACTS.length))

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => {
        // Ensure we don't pick the same fact twice in a row
        let nextIndex
        do {
          nextIndex = Math.floor(Math.random() * FUN_FACTS.length)
        } while (nextIndex === prev)
        return nextIndex
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const isIndeterminate = progress === undefined

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="minecraft-text loading-title">Building Terrain...</h1>
        
        <div className="loading-bar-container">
          <div 
            className={`loading-bar-progress ${isIndeterminate ? 'indeterminate' : ''}`}
            style={isIndeterminate ? {} : { width: `${progress}%`, transform: 'none', animation: 'none' }}
          ></div>
        </div>
        {!isIndeterminate && (
          <div className="progress-text minecraft-text">{Math.round(progress || 0)}%</div>
        )}

        <div className="fact-container">
          <p className="minecraft-text fact-label">Did you know?</p>
          <div className="fact-text-wrapper">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="minecraft-text fact-text"
              >
                {FUN_FACTS[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: url('/textures/dirt.png') repeat;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: white;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          max-width: 600px;
          width: 90%;
          padding: 40px;
          background: rgba(0, 0, 0, 0.7);
          border: 4px solid;
          border-color: #555555 #a5a5a5 #a5a5a5 #555555;
          box-shadow: inset 2px 2px 0px rgba(255, 255, 255, 0.1), inset -2px -2px 0px rgba(0, 0, 0, 0.3);
        }

        .loading-title {
          font-size: 2.5rem;
          text-align: center;
          margin: 0;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.8);
        }

        .loading-bar-container {
          width: 100%;
          height: 24px;
          background: #333;
          border: 2px solid #fff;
          padding: 2px;
          position: relative;
        }

        .loading-bar-progress {
          height: 100%;
          background: #7cb342;
          width: 100%;
          transform-origin: left;
          transition: width 0.2s linear;
        }

        .loading-bar-progress.indeterminate {
          width: 100%;
          animation: progressFill 3s ease-in-out infinite;
        }

        .progress-text {
          color: #7cb342;
          margin-top: -30px;
          font-size: 1rem;
        }

        .fact-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-height: 80px;
          text-align: center;
        }

        .fact-label {
          color: #ffd700;
          font-size: 1.2rem;
          margin: 0;
        }

        .fact-text-wrapper {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fact-text {
          font-size: 1.1rem;
          margin: 0;
          color: #e0e0e0;
          line-height: 1.4;
        }

        @keyframes progressFill {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }

        @media (max-width: 768px) {
          .loading-title {
            font-size: 1.8rem;
          }
          
          .fact-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
