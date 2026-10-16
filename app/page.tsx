import PortfolioFolders from "@/components/portfolio-folders";
import { GridPulse } from "@/components/ui/grid-pulse";

export default function HomePage() {
  return (
    <main className="folder-home" aria-label="Matt Domingo's portfolio">
      <GridPulse className="folder-background" />
      <PortfolioFolders />
    </main>
  );
}
