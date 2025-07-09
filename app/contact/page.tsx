export default function ContactPage() {
  return (
    <div className="landing-page">
      <h1 className="minecraft-text title">CONTACT</h1>
      
      <div className="minecraft-chat-box">
        <p>Ready to start a new adventure together?</p>
        <br />
        <p>📧 Email: matt@example.com<br />
        💼 LinkedIn: linkedin.com/in/mattdomingo<br />
        🐙 GitHub: github.com/mattdomingo<br />
        🐦 Twitter: @mattdomingo</p>
        <br />
        <p>Let's craft something amazing!</p>
      </div>

      <div className="button-container">
        <a href="/" className="minecraft-button">HOME</a>
        <a href="/about" className="minecraft-button">ABOUT ME</a>
        <a href="/projects" className="minecraft-button">MY PROJECTS</a>
      </div>
    </div>
  )
}
