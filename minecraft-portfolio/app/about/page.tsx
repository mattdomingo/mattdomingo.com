export default function AboutPage() {
  return (
    <div className="landing-page">
      <h1 className="minecraft-text title">ABOUT ME</h1>
      
      <div className="minecraft-chat-box">
        <p>I'm a passionate full-stack developer with a love for creating interactive web experiences. Just like in Minecraft, I enjoy building things block by block, turning ideas into reality.</p>
        <br />
        <p>When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or actually playing Minecraft!</p>
      </div>

      <div className="button-container">
        <a href="/" className="minecraft-button">HOME</a>
        <a href="/projects" className="minecraft-button">MY PROJECTS</a>
        <a href="/contact" className="minecraft-button">CONTACT</a>
      </div>
    </div>
  )
}
