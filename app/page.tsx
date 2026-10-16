import PortfolioFolders from "@/components/portfolio-folders";
import HalftoneFlow from "@/components/ui/halftone-flow";
import Timeline from "@/components/ui/timeline";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

export default function HomePage() {
  return (
    <>
      <main className="portfolio-page" aria-label="Matt Domingo's portfolio">
        <section id="top" className="folder-home" aria-label="Portfolio folders">
          <HalftoneFlow className="folder-background" />
          <PortfolioFolders />
          <a href="#journey" className="journey-scroll-hint">A little more about me <span aria-hidden="true">↓</span></a>
        </section>
        <Timeline />
      </main>
      <HalftoneWordmarkFooter
        wordmark="domingo"
        label="Matt Domingo"
        meta="Chicago · Madison · Denver"
        height="clamp(500px, 44vw, 620px)"
        columns={[
          { title: "Work", links: [
            { label: "GitHub", href: "https://github.com/mattdomingo" },
            { label: "openfloor", href: "https://opnflr.com" },
          ] },
          { title: "Connect", links: [
            { label: "LinkedIn", href: "https://linkedin.com/in/matthewgdomingo" },
            { label: "Email", href: "mailto:matthew.domingo2022@gmail.com" },
          ] },
          { title: "Elsewhere", links: [
            { label: "Instagram", href: "https://www.instagram.com/matt_domingo/" },
            { label: "X", href: "https://x.com/opnflr_cto" },
          ] },
        ]}
      />
    </>
  );
}
