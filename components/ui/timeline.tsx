"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { JOURNEY, TOOLKIT } from "@/lib/portfolio-journey";

// Adapted from the supplied horizontal timeline, using the portfolio's existing motion engine.
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [.02, 1]);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - pin.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(pin);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={sectionRef} id="journey" className="journey-section" aria-labelledby="journey-title" style={{ height: reduceMotion ? "auto" : `calc(100svh + ${travel}px)` }}>
        <div ref={pinRef} className="journey-pin">
          <header className="journey-header">
            <div><p className="journey-eyebrow">The journey</p><h2 id="journey-title">Always building.</h2></div>
            <p className="journey-range">2014 — 2026<span>Keep scrolling <span aria-hidden="true">→</span></span></p>
          </header>
          <motion.ol ref={trackRef} className="journey-track" style={{ x: reduceMotion ? 0 : x }} aria-label="Education and career timeline">
            <li className="journey-cover" aria-hidden="true">
              <Image src="/photos/journey/portrait.webp" alt="" width={526} height={744} sizes="(max-width: 600px) 80vw, 360px" />
              <p>From the first line of code<br />to what comes next.</p>
            </li>
            <li className="journey-axis" aria-hidden="true"><motion.span style={{ scaleX: reduceMotion ? 1 : lineScale }} /></li>
            {JOURNEY.map((item, index) => (
              <li
                key={`${item.date}-${item.title}-${item.organization ?? ""}`}
                className={`journey-stop ${index % 2 ? "journey-stop-bottom" : "journey-stop-top"}`}
              >
                <span className="journey-dot" aria-hidden="true" />
                <span className="journey-stem" aria-hidden="true" />
                <motion.article className="journey-copy" initial={reduceMotion ? false : { opacity: .2, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .6 }} transition={{ duration: reduceMotion ? 0 : .5 }}>
                  <time dateTime={item.date}>{item.period}</time>
                  <h3>{item.title}</h3>
                  {item.organization && <p className="journey-organization">{item.organization}</p>}
                  <p className="journey-description">{item.content}</p>
                </motion.article>
                {item.image && (
                  <div className="journey-media">
                    {item.link ? (
                      <a href={item.link.href} target="_blank" rel="noopener noreferrer" aria-label={item.link.label}>
                        <Image src={item.image.src} alt={item.image.alt} width={640} height={360} sizes="(max-width: 600px) 78vw, 370px" unoptimized />
                        <span className="journey-video-label"><span aria-hidden="true">▶</span> Watch on YouTube <span aria-hidden="true">↗</span></span>
                      </a>
                    ) : (
                      <Image src={item.image.src} alt={item.image.alt} width={740} height={500} sizes="(max-width: 600px) 78vw, 370px" />
                    )}
                  </div>
                )}
              </li>
            ))}
          </motion.ol>
          <div className="journey-progress" aria-hidden="true"><motion.span style={{ scaleX: reduceMotion ? 1 : scrollYProgress }} /></div>
        </div>
      </section>
      <section className="journey-toolkit" aria-labelledby="toolkit-title">
        <p className="journey-eyebrow">Along the way</p><h2 id="toolkit-title">The toolkit. And the people.</h2>
        <div>{TOOLKIT.map((group) => <article key={group.title}><h3>{group.title}</h3><p>{group.content}</p></article>)}</div>
        <a href="#top" className="journey-back">Back to the folders <span aria-hidden="true">↑</span></a>
      </section>
    </>
  );
}
