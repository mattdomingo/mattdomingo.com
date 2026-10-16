import type { Metadata } from "next";
import { ResumeViewer } from "@/components/resume-viewer";
export const metadata: Metadata = {
  title: "Résumé",
  description:
    "View or download Matthew Domingo’s current Full Stack and Applied AI résumés.",
};
export default function ResumePage() {
  return (
    <div className="page-shell resume-page">
      <p className="eyebrow">EXPERIENCE / IN ONE PAGE</p>
      <h1 className="page-heading">The résumé.</h1>
      <p className="page-intro">
        Two perspectives on the same work: full-stack engineering and applied
        AI.
      </p>
      <ResumeViewer />
    </div>
  );
}
