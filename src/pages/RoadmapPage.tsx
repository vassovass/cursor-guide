import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export function RoadmapPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });
      
      const graph = `
gantt
  title Project Timeline
  dateFormat YYYY-MM-DD
  section Sprint 1: Foundation & Error Handling
    Project setup :2024-01-01, 7d
    Error boundary implementation :2024-01-02, 3d
    Sentry integration :2024-01-04, 2d
    Logging service setup :2024-01-06, 2d
  section Sprint 2: Documentation & AI Integration
    Documentation browser :2024-01-08, 3d
    AI-powered search :2024-01-10, 2d
    Code snippet highlighting :2024-01-12, 2d
    Interactive examples :2024-01-14, 2d
  section Sprint 3: Project Setup & Validation
    Project setup wizard :2024-01-15, 3d
    Configuration validation :2024-01-17, 2d
    Template generation :2024-01-19, 2d
    Integration testing :2024-01-21, 2d
  section Sprint 4: AI Model Configuration
    Model configuration UI :2024-01-22, 3d
    Parameter validation :2024-01-24, 2d
    Performance monitoring :2024-01-26, 2d
    Error rate tracking :2024-01-28, 2d
  section Sprint 5: Quality Assurance & Launch
    End-to-end testing :2024-01-29, 2d
    Performance optimization :2024-01-31, 2d
    Security audit :2024-02-02, 2d
    Documentation completion :2024-02-04, 2d
`;

      mermaid.render('roadmap-diagram', graph).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      });
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Project Roadmap</h1>
        <p className="text-muted-foreground mb-8">
          Complete project timeline and milestone tracking
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <div ref={mermaidRef} className="overflow-x-auto" />
      </div>
    </div>
  );
}