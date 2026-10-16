import PortfolioFolders from "@/components/portfolio-folders";
import HalftoneFlow from "@/components/ui/halftone-flow";
import Timeline from "@/components/ui/timeline";

export default function HomePage() {
  return (
    <main className="portfolio-page" aria-label="Matt Domingo's portfolio">
      <section id="top" className="folder-home" aria-label="Portfolio folders">
        <HalftoneFlow className="folder-background" />
        <PortfolioFolders />
        <a href="#journey" className="journey-scroll-hint">A little more about me <span aria-hidden="true">↓</span></a>
      </section>
      <Timeline />
    </main>
  );
}
