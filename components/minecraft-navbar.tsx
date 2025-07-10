'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function MinecraftNavbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'HOME', icon: '🏠' },
    { href: '/about', label: 'ABOUT', icon: '👤' },
    { href: '/projects', label: 'PROJECTS', icon: '🛠️' },
    { href: '/resume', label: 'RESUME', icon: '📄' },
    { href: '/contact', label: 'CONTACT', icon: '📧' }
  ]

  return (
    <nav className="minecraft-navbar">
      <div className="minecraft-navbar-container">
        <div className="minecraft-navbar-brand">
          <Link href="/" className="minecraft-navbar-logo">
            <span className="navbar-logo-icon">⛏️</span>
            <span className="navbar-logo-text">MATT DOMINGO</span>
          </Link>
        </div>
        
        <div className="minecraft-navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`minecraft-navbar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="navbar-item-icon">{item.icon}</span>
              <span className="navbar-item-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 