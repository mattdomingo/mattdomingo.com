"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Pause, Play, Sun, X } from "lucide-react";
import { useExperience } from "./experience-provider";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, reducedMotion, toggleTheme, toggleMotion } = useExperience();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Matt Domingo home">
        <span className="brand-symbol" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>
          MATT DOMINGO<span className="wordmark-period">.</span>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname.startsWith(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/resume"
          className="resume-nav"
          aria-current={pathname === "/resume" ? "page" : undefined}
        >
          Résumé <ArrowUpRight size={14} />
        </Link>
      </nav>
      <div className="header-controls">
        <button
          className="icon-button motion-toggle"
          onClick={toggleMotion}
          aria-label={
            reducedMotion
              ? "Enable motion (respects system preference)"
              : "Pause motion"
          }
          title={
            reducedMotion
              ? "Motion paused; respects system preference"
              : "Pause motion"
          }
          aria-pressed={reducedMotion}
        >
          {reducedMotion ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button
          className="icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          ref={menuRef}
          className="icon-button menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[...links, { href: "/resume", label: "Résumé" }].map(
            (link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={
                  pathname.startsWith(link.href) ? "page" : undefined
                }
              >
                <span className="mono">0{index + 1}</span>
                {link.label}
                <ArrowUpRight />
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
