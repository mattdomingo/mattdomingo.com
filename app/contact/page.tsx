import MinecraftNavbar from "@/components/minecraft-navbar"

export default function ContactPage() {
  return (
    <>
      <MinecraftNavbar />
      <div className="landing-page page-with-navbar">
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
      </div>
    </>
  )
}
