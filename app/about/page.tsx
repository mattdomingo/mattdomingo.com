export default function AboutPage() {
  return (
    <div className="character-stats-page">
      <div className="character-stats-container">
        <h1 className="minecraft-text character-stats-title">CHARACTER STATS</h1>
        
        <div className="character-layout">
          {/* Left side - Profile */}
          <div className="character-profile">
            <div className="profile-frame">
              <div className="profile-image-border">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                  alt="Profile picture"
                  className="profile-image"
                />
              </div>
            </div>
            <div className="profile-info">
              <h2 className="minecraft-text profile-name">MATT DOMINGO</h2>
              <p className="minecraft-text profile-level">LVL 30 DEVELOPER</p>
            </div>
          </div>

          {/* Right side - Description and Achievements */}
          <div className="character-details">
            <div className="character-description">
              <p>I'm a passionate full-stack developer with a love for creating interactive web experiences. Just like in Minecraft, I enjoy building things block by block, turning ideas into reality.</p>
              <br />
              <p>When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or actually playing Minecraft!</p>
            </div>

            <div className="achievements">
              <div className="achievement-box">
                <h4 className="achievement-title">ACHIEVEMENT UNLOCKED</h4>
                <p className="achievement-text">Bachelor's in Computer Science</p>
              </div>
              <div className="achievement-box">
                <h4 className="achievement-title">ACHIEVEMENT UNLOCKED</h4>
                <p className="achievement-text">5+ Years Professional Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="button-container">
          <a href="/" className="minecraft-button">HOME</a>
          <a href="/projects" className="minecraft-button">MY PROJECTS</a>
          <a href="/contact" className="minecraft-button">CONTACT</a>
        </div>
      </div>
    </div>
  )
}