/** A conceptual workflow diagram, not a screenshot of the product. */
export function OpenfloorDiagram() {
  return <div className="openfloor-diagram" role="img" aria-label="Openfloor workflow: teammate prompts route to parallel agents with shared context, then checks and human review.">
    <div className="diagram-top mono"><span>OPENFLOOR / COORDINATION MODEL</span><span className="diagram-dot" /></div>
    <div className="diagram-input"><span className="mono">01 / TEAM INTENT</span><strong>One shared workspace.</strong><span className="diagram-cursor" aria-hidden="true">▍</span></div>
    <div className="diagram-spine" />
    <div className="diagram-agents"><div><i /><span className="mono">AGENT 01</span><strong>Build</strong></div><div><i /><span className="mono">AGENT 02</span><strong>Test</strong></div><div><i /><span className="mono">AGENT 03</span><strong>Reconcile</strong></div></div>
    <div className="diagram-context"><span className="mono">SHARED CONTEXT</span><span aria-hidden="true">↔</span><span className="mono">PARALLEL WORK</span></div>
    <div className="diagram-spine" />
    <div className="diagram-review"><span className="mono">02 / CHECKS + HUMAN REVIEW</span><strong>Bring it together.</strong><span aria-hidden="true">↗</span></div>
    <span className="diagram-footnote mono">TEAMMATES IN SYNC. PEOPLE IN CONTROL.</span>
  </div>
}
