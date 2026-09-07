import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/lib/projects";
import { OpenfloorDiagram } from "@/components/openfloor-diagram";
import { ProjectVideo } from "@/components/project-video";

type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).id);
  return project
    ? { title: project.title, description: project.description }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).id);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="page-shell project-detail">
      <Link href="/projects" className="text-link back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            PROJECT {String(project.id).padStart(2, "0")} /{" "}
            {project.technologies[0]}
          </p>
          <h1 className="page-heading">{project.title}</h1>
        </div>
        <span className="detail-mark" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="detail-overview">
        <p>{project.longDescription}</p>
        <div>
          <div className="tag-list">
            {project.technologies.map((tech) => (
              <span className="tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <div className="inline-links">
            {project.githubUrl && (
              <a
                className="button"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                View source <ArrowUpRight size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                className="button button-accent"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                Visit website <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
      {(project.image || project.id === 17) && (
        <div
          className={`detail-media ${project.id === 17 ? "detail-diagram" : ""}`}
        >
          {project.video ? (
            <ProjectVideo
              src={project.video}
              poster={project.image}
              title={`${project.title} demonstration`}
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} interface`}
              width={1600}
              height={1000}
              sizes="90vw"
              priority
            />
          ) : (
            <OpenfloorDiagram />
          )}
        </div>
      )}
      <div className="detail-sections">
        <section>
          <p className="eyebrow">01 / CAPABILITIES</p>
          <h2>What it does.</h2>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
        <section>
          <p className="eyebrow">02 / ENGINEERING</p>
          <h2>The hard parts.</h2>
          <ul>
            {project.challenges.map((challenge) => (
              <li key={challenge}>{challenge}</li>
            ))}
          </ul>
        </section>
      </div>
      {project.TODO.length > 0 && (
        <section className="project-next">
          <p className="eyebrow">03 / EXPLORATIONS</p>
          <h2>Where it could go.</h2>
          <p className="muted">
            Ideas on the project roadmap, separate from the capabilities above.
          </p>
          <ul>
            {project.TODO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      <Link className="archive-link" href={`/projects/${next.id}`}>
        <span>
          <span className="mono">NEXT PROJECT</span>
          <strong>{next.title}</strong>
        </span>
        <ArrowUpRight />
      </Link>
    </article>
  );
}
