import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Matt Domingo about engineering roles, ambitious teams, and interesting software problems.",
};
export default function ContactPage() {
  return (
    <div className="page-shell contact-page">
      <p className="eyebrow">GOOD THINGS START WITH A CONVERSATION</p>
      <h1 className="page-heading">
        What are
        <br />
        <em>you building?</em>
      </h1>
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="page-intro">
            An early team finding its direction. An established one solving a
            hard problem. I’d like to hear about it.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={21} />
          </a>
          <div className="contact-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={18} />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={18} />
            </a>
            <a href={profile.instagram} target="_blank" rel="noreferrer">
              Instagram <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="contact-resume">
            <span className="mono">THE BACKGROUND, AT A GLANCE</span>
            <div className="inline-links">
              <Link className="text-link" href="/resume">
                View résumé <ArrowUpRight size={16} />
              </Link>
              <a
                className="text-link"
                href="/documents/resume.pdf"
                download="Matthew_Domingo_Resume.pdf"
              >
                Download PDF <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <span className="mono contact-location">
            BASED IN DENVER, COLORADO
          </span>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
