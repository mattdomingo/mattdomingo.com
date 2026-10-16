import PortfolioFolders from "@/components/portfolio-folders";
import TopoField from "@/components/ui/topo-field";

export default function HomePage() {
  return (
    <main className="folder-home" aria-label="Matt Domingo's portfolio">
      <TopoField className="folder-background" />
      <PortfolioFolders />
    </main>
  );
}
