import MinecraftNavbar from "@/components/minecraft-navbar"

export default function ProjectsPage() {
  return (
    <>
      <MinecraftNavbar />
      <div className="landing-page page-with-navbar">
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
      </div>
    </>
  )
}
