import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <p className="eyebrow">404 / UNCHARTED TERRITORY</p>
      <h1 className="page-heading">
        Nothing here.
        <br />
        <em>Plenty ahead.</em>
      </h1>
      <p className="page-intro">
        This page doesn’t exist. You can find the work in the project archive.
      </p>
      <Link href="/projects" className="button button-accent">
        Explore projects <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
