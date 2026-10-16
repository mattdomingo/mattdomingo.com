import GlassFolder from "@/components/ui/glass-folder-cards";
import HalftoneFlow from "@/components/ui/halftone-flow";

export default function HomePage() {
  return (
    <main className="folder-home" aria-label="Matt Domingo's portfolio">
      <HalftoneFlow className="folder-background" />
      <GlassFolder
        label="Matt Domingo"
        art="aurora"
        seed={3}
        action="none"
        files={[
          { name: "Résumé.pdf", meta: "PDF", href: "/documents/resume.pdf" },
          { name: "GitHub", meta: "Projects", art: "ember", href: "https://github.com/mattdomingo" },
          { name: "LinkedIn", meta: "Connect", art: "glacier", href: "https://linkedin.com/in/matthewgdomingo" },
          { name: "Email", meta: "Say hello", href: "mailto:matthew.domingo2022@gmail.com" },
        ]}
      />
    </main>
  );
}
