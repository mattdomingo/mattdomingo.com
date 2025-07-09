export default function ProjectsPage() {
  return (
    <div className="landing-page">
      <h1 className="minecraft-text title">MY PROJECTS</h1>
      
      <div className="minecraft-chat-box">
        <p>Here are some of the digital worlds I've crafted:</p>
        <br />
        <p>🏗️ Project 1: E-commerce Platform<br />
        Built with React and Node.js</p>
        <br />
        <p>🎮 Project 2: Game Development Tool<br />
        Created using Unity and C#</p>
        <br />
        <p>🌐 Project 3: Web Portfolio<br />
        Designed with Next.js and Tailwind CSS</p>
      </div>

      <div className="button-container">
        <a href="/" className="minecraft-button">HOME</a>
        <a href="/about" className="minecraft-button">ABOUT ME</a>
        <a href="/contact" className="minecraft-button">CONTACT</a>
      </div>
    </div>
  )
}
