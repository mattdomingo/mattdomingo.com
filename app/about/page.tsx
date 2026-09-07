import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SkillsInventory from "@/components/skills-inventory";
import SpotifyMusic from "@/components/spotify-music";
import { leadership, profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Matt Domingo: Denver-based software engineer, Openfloor co-founder, UW–Madison graduate, and curious builder.",
};

export default function AboutPage() {
  return (
    <div className="page-shell about-page">
      <p className="eyebrow">THE PERSON / THE PRACTICE</p>
      <h1 className="page-heading">
        Engineer by trade.
        <br />
        <em>Builder by nature.</em>
      </h1>
      <div className="about-opening">
        <div className="about-photo">
          <Image
            src="/profile.png"
            alt="Matt Domingo"
            width={900}
            height={1000}
            sizes="(max-width: 800px) 90vw, 40vw"
            priority
          />
          <div className="mono">
            <span>MATT DOMINGO</span>
            <span>DENVER, CO</span>
          </div>
        </div>
        <div className="about-story">
          <p className="about-lead">
            I’m interested in what happens when you connect things that weren’t
            built to work together.
          </p>
          <p>
            People and AI agents. Spatial data and physics. A complex system and
            the person trying to understand it. That’s the thread through my
            work.
          </p>
          <p>
            I’m a software engineer on Visa’s Vital Signs team, working on
            VisaNet reliability and observability. I’m also the co-founder and
            CTO of Openfloor, where I take ideas from product direction through
            engineering, beta launch, and customer conversations.
          </p>
          <p>
            Before that, I built cloud tools at TruStage, AI-powered business
            intelligence at Pharus.ai, and worked on infrastructure and security
            at Magnet-Schultz of America.
          </p>
          <Link className="text-link" href="/#experience">
            Explore my experience <ArrowUpRight size={18} />
          </Link>
          <SpotifyMusic />
        </div>
      </div>
      <section className="education-section">
        <div>
          <p className="eyebrow">01 / FOUNDATION</p>
          <h2>
            Wisconsin roots.
            <br />
            <em>A broader lens.</em>
          </h2>
        </div>
        <div>
          <h3>University of Wisconsin–Madison</h3>
          <p>Bachelor of Science in Computer Science · {profile.graduated}</p>
          <p className="muted">Minors in {profile.minors.join(", ")}.</p>
          <div className="education-detail">
            <span className="mono">SELECTED COURSEWORK</span>
            <p>{profile.coursework.join(" · ")}</p>
          </div>
          <div className="education-detail">
            <span className="mono">CERTIFICATIONS</span>
            <p>
              AWS Certified Cloud Practitioner
              <br />
              Microsoft Power Automate Essentials
            </p>
          </div>
          <div className="education-detail">
            <span className="mono">LEADERSHIP</span>
            <ul>
              {leadership.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <SkillsInventory />
      <section className="beyond-section">
        <p className="eyebrow">03 / OFFLINE, TOO</p>
        <h2>
          A little less screen time.
          <br />
          <em>A little more altitude.</em>
        </h2>
        <div className="interest-grid">
          <div>
            <span className="mono">01 / OUTSIDE</span>
            <h3>Find a different view.</h3>
            <p>
              Running and hiking around Colorado. Learning the rhythm of life in
              Denver. Still trying to figure out my golf swing.
            </p>
          </div>
          <div>
            <span className="mono">02 / CREATIVE</span>
            <h3>Make something move.</h3>
            <p>
              Making videos, DJing, and finding music worth sharing. I like
              building experiences outside the browser, too.
            </p>
          </div>
        </div>
        <a
          href={profile.instagram}
          className="text-link"
          target="_blank"
          rel="noreferrer"
        >
          A glimpse outside the work <ArrowUpRight size={18} />
        </a>
      </section>
    </div>
  );
}
