import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  return <>
    <section className="hero section-grid" aria-labelledby="hero-title">
      <div className="hero-topline mono"><span><i className="status-dot" /> SOFTWARE ENGINEER & CO-FOUNDER</span><span>DENVER, CO / 2026</span></div>
      <div className="spatial-fallback" aria-hidden="true"><div /><div /><div /></div>
      <div className="hero-copy"><p className="eyebrow">IDEAS → SYSTEMS → IMPACT</p><h1 id="hero-title">Complexity.<br /><span className="outline-type">Meet clarity.</span></h1><div className="hero-summary"><p>I’m Matt. I build software that connects ambitious ideas to the real world.</p><Link className="button button-accent" href="#work">Explore my work <ArrowDown size={17} /></Link></div></div>
      <div className="hero-bottom mono"><span>ENGINEERING AT VISA<br />BUILDING OPENFLOOR</span><span className="hero-scroll"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} /></span><span className="hero-coordinate">01 — AN INTRODUCTION</span></div>
    </section>
    <section id="work" className="section-pad foundation-work"><p className="eyebrow">01 / SELECTED WORK</p><div className="section-heading"><h2>Built to do<br /><em>something real.</em></h2><p>From reliable payment systems to shared workspaces for AI agents and tools for physical AI.</p></div><div className="foundation-links"><Link href="/projects/17"><span className="mono">01 / CO-FOUNDER & CTO</span><h3>Openfloor</h3><p>A shared workspace for people and AI coding agents.</p><ArrowUpRight /></Link><Link href="/projects/15"><span className="mono">02 / PHYSICAL AI</span><h3>Holos</h3><p>From spatial captures to simulation and understanding.</p><ArrowUpRight /></Link></div></section>
  </>
}
