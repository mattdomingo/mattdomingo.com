import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <span className="mono">NEXT / WHAT WE COULD BUILD</span>
        <Link href="/contact" className="footer-invitation">
          Let’s make
          <br />
          something matter.
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-bottom">
        <Link href="/" className="mono">
          © {new Date().getFullYear()} MATT DOMINGO
        </Link>
        <span className="mono">DENVER, COLORADO</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={13} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={13} />
          </a>
          <a href={`mailto:${profile.email}`}>
            Email <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
