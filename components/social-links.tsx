import { Github, Linkedin, Twitter, Mail } from "lucide-react"

const socialLinks = [
  {
    name: "GitHub",
    icon: <Github className="w-6 h-6" />,
    url: "https://github.com/username",
    color: "bg-gray-800",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-6 h-6" />,
    url: "https://linkedin.com/in/username",
    color: "bg-blue-700",
  },
  {
    name: "Twitter",
    icon: <Twitter className="w-6 h-6" />,
    url: "https://twitter.com/username",
    color: "bg-sky-500",
  },
  {
    name: "Email",
    icon: <Mail className="w-6 h-6" />,
    url: "mailto:email@example.com",
    color: "bg-red-600",
  },
]

export default function SocialLinks() {
  return (
    <div className="minecraft-social-links">
      <h3 className="minecraft-text text-xl mb-6 text-center">FIND ME ONLINE</h3>

      <div className="flex justify-center gap-4 flex-wrap">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`minecraft-social-link ${link.color} text-white p-3 border-4 border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 hover:translate-y-1 transition-transform`}
            aria-label={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  )
}
