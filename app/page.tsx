import PortfolioFolders from "@/components/portfolio-folders";
import HalftoneFlow from "@/components/ui/halftone-flow";

export default function HomePage() {
  return (
    <main className="folder-home" aria-label="Matt Domingo's portfolio">
      <HalftoneFlow className="folder-background" />
      <PortfolioFolders />
    </main>
  );
}
