export default function HomePage() {
  return (
    <div className="landing-page">
      <h1 className="minecraft-text title">MATT DOMINGO</h1>
      <h2 className="minecraft-text subtitle">SOFTWARE ENGINEER</h2>
      
      <div className="minecraft-chat-box">
        <p>Welcome to my world! I craft digital experiences with code.</p>
      </div>

      <div className="button-container">
        <a href="/about" className="minecraft-button">ABOUT ME</a>
        <a href="/projects" className="minecraft-button">MY PROJECTS</a>
        <a href="/contact" className="minecraft-button">CONTACT</a>
      </div>
    </div>
  )
}
