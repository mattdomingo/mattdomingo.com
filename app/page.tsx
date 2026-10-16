import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { SpatialStage } from "@/components/spatial-stage";
import { ScrollChapter } from "@/components/scroll-chapter";
import { OpenfloorDiagram } from "@/components/openfloor-diagram";
import { ProjectVideo } from "@/components/project-video";
import { experience } from "@/lib/profile";

export default function HomePage() {
  return (
    <>
      <div className="spatial-story" data-spatial-story>
        <SpatialStage />
        <section className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero-topline mono">
            <span>
              <i className="status-dot" /> SOFTWARE ENGINEER & CO-FOUNDER
            </span>
            <span>DENVER, CO / 2026</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">IDEAS → SYSTEMS → IMPACT</p>
            <h1 id="hero-title">
              Complexity.
              <br />
              <span className="outline-type">Meet clarity.</span>
            </h1>
            <div className="hero-summary">
              <p>
                I’m Matt. I build software that connects ambitious ideas to the
                real world.
              </p>
              <Link className="button button-accent" href="#work">
                Explore my work <ArrowDown size={17} />
              </Link>
            </div>
          </div>
          <div className="hero-bottom mono">
            <span>
              ENGINEERING AT VISA
              <br />
              BUILDING OPENFLOOR
            </span>
            <a href="#perspective" className="hero-scroll">
              <span>SCROLL TO EXPLORE</span>
              <ArrowDown size={17} />
            </a>
            <span className="hero-coordinate">00 — AN INTRODUCTION</span>
          </div>
        </section>
        <section id="perspective" className="perspective-section section-pad">
          <p className="eyebrow">THE SPACE BETWEEN AN IDEA AND ITS IMPACT</p>
          <h2>
            That’s where
            <br />I like to <span>build.</span>
          </h2>
          <div className="perspective-copy">
            <p>
              Reliable payment infrastructure. AI agents working together.
              Physical movement translated into simulation.
            </p>
            <p>
              I work across the stack, connect the pieces, and stay close to the
              people using what I build.
            </p>
          </div>
          <div className="capability-line mono">
            <span>01 / SYSTEMS ENGINEERING</span>
            <Plus size={15} />
            <span>02 / APPLIED AI</span>
            <Plus size={15} />
            <span>03 / PRODUCT OWNERSHIP</span>
          </div>
        </section>
      </div>
      <div className="work-section section-pad" id="work">
        <p className="eyebrow">01 / SELECTED WORK</p>
        <div className="section-heading">
          <h2>
            Built to do
            <br />
            <em>something real.</em>
          </h2>
          <p>
            Products, platforms, and experiments.
            <br />A few things I’ve helped bring into the world.
          </p>
        </div>
        <ScrollChapter index={1}>
          <div className="work-panel-heading mono">
            <span>01 — OPENFLOOR</span>
            <span>CO-FOUNDER & CTO / 2026</span>
          </div>
          <div className="work-panel-grid">
            <div className="work-narrative">
              <span className="project-category">COLLABORATIVE AI</span>
              <h3 id="work-title-1">
                Many agents.
                <br />
                One team.
              </h3>
              <p>
                I co-founded Openfloor to give people and AI coding agents a
                shared place to work: live teammate prompts, parallel agents,
                shared context, and a clear review workflow.
              </p>
              <div className="project-metrics">
                <div>
                  <strong>20</strong>
                  <span>beta users</span>
                </div>
                <div>
                  <strong>01</strong>
                  <span>paying customer</span>
                </div>
              </div>
              <Link href="/projects/17" className="text-link">
                Explore Openfloor <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="work-visual openfloor-visual">
              <OpenfloorDiagram />
            </div>
          </div>
          <div className="work-panel-footer mono">
            <span>PRODUCT VISION → ENGINEERING → BETA LAUNCH</span>
            <span>01 / 03</span>
          </div>
        </ScrollChapter>
        <ScrollChapter index={2}>
          <div className="work-panel-heading mono">
            <span>02 — HOLOS INDUSTRY CAPSTONE</span>
            <span>LEAD DEVELOPER / 2026</span>
          </div>
          <div className="work-panel-grid">
            <div className="work-narrative">
              <span className="project-category">PHYSICAL AI</span>
              <h3 id="work-title-2">
                Movement.
                <br />
                Made legible.
              </h3>
              <p>
                I led development on a five-person team turning Apple Vision Pro
                captures into synchronized spatial playback, physics simulation,
                and AI-generated activity annotations.
              </p>
              <div className="project-proof">
                <span className="mono">FROM CAPTURE TO UNDERSTANDING</span>
                <p>
                  Three.js + MuJoCo. An analytical inverse kinematics solver. A
                  two-pass Gemini enrichment pipeline.
                </p>
              </div>
              <div className="inline-links">
                <Link href="/projects/15" className="text-link">
                  Spatial viewer <ArrowUpRight size={18} />
                </Link>
                <Link href="/projects/13" className="text-link">
                  AI pipeline <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <div className="work-visual holos-visual">
              <div className="visual-label mono">
                <span>SPATIAL PLAYBACK / MUJOCO</span>
                <span>XYZ ↗</span>
              </div>
              <ProjectVideo
                src="/projects/mujoco-sandbox.webm"
                poster="/projects/mujoco-sandbox.png"
                title="Holos spatial capture playback"
                ambient
              />
              <div className="visual-note">
                Features implemented by Holos and showcased to Samsung and
                NVIDIA.
              </div>
            </div>
          </div>
          <div className="work-panel-footer mono">
            <span>COMPUTER VISION / SIMULATION / MULTIMODAL AI</span>
            <span>02 / 03</span>
          </div>
        </ScrollChapter>
        <ScrollChapter index={3}>
          <div className="work-panel-heading mono">
            <span>03 — QUESTGPT</span>
            <span>PERSONAL PROJECT</span>
          </div>
          <div className="work-panel-grid">
            <div className="work-narrative">
              <span className="project-category">INTERACTIVE SYSTEMS</span>
              <h3 id="work-title-3">
                A world built
                <br />
                with words.
              </h3>
              <p>
                An AI-powered text RPG with a complete gameplay loop: character
                builds, combat, shops, progression, and enemies that scale with
                the player.
              </p>
              <div className="project-proof">
                <span className="mono">FULL-STACK, END TO END</span>
                <p>
                  A Spring Boot API coordinates game state with a React
                  interface and a MySQL data layer.
                </p>
              </div>
              <Link href="/projects/10" className="text-link">
                Explore QuestGPT <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="work-visual screenshot-visual">
              <Image
                src="/projects/questgpt.png"
                alt="QuestGPT game interface"
                width={1200}
                height={800}
                sizes="(max-width: 900px) 90vw, 50vw"
              />
              <span className="visual-label mono">
                JAVA / SPRING BOOT / REACT / MYSQL
              </span>
            </div>
          </div>
          <div className="work-panel-footer mono">
            <span>AI GENERATION / GAME STATE / INTERACTION DESIGN</span>
            <span>03 / 03</span>
          </div>
        </ScrollChapter>
        <Link href="/projects" className="archive-link">
          <span>
            <span className="mono">KEEP EXPLORING</span>
            <strong>The project archive.</strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <section className="experience-section section-pad" id="experience">
        <div className="experience-intro">
          <p className="eyebrow">02 / EXPERIENCE</p>
          <h2>
            Big systems.
            <br />
            <em>Small details.</em>
          </h2>
          <p>I care about both.</p>
          <Link href="/resume" className="text-link">
            View my résumé <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="experience-timeline">
          {experience.map((job, index) => (
            <details
              key={job.company}
              className="experience-row"
              open={index === 0}
            >
              <summary>
                <span className="mono">{job.period}</span>
                <span>
                  <strong>{job.company}</strong>
                  <span>{job.role}</span>
                </span>
                <Plus size={20} />
              </summary>
              <div className="experience-detail">
                <p>{job.summary}</p>
                <ul>
                  {job.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <span className="mono">{job.location}</span>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="personal-section section-pad">
        <div className="personal-photo">
          <Image
            src="/profile.png"
            alt="Matt Domingo"
            width={700}
            height={800}
            sizes="(max-width: 700px) 85vw, 35vw"
          />
          <span className="mono">MATT DOMINGO / BEYOND THE TERMINAL</span>
        </div>
        <div className="personal-copy">
          <p className="eyebrow">03 / THE PERSON BEHIND THE WORK</p>
          <h2>
            Curiosity
            <br />
            doesn’t clock out.
          </h2>
          <p>
            UW–Madison computer science graduate. Denver-based builder. Usually
            working on an idea, out on a trail, or chasing a better golf swing.
          </p>
          <p>
            I make videos, DJ, run, and look for new things to learn. The same
            curiosity finds its way into my software.
          </p>
          <Link href="/about" className="text-link">
            A little more about me <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
