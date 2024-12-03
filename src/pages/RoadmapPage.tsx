import React from 'react';
import Mermaid from 'react-mermaid2';

export function RoadmapPage() {
  const timeline = `
gantt
  title Project Timeline
  dateFormat YYYY-MM-DD
  section Sprint 1
    Foundation & Error Handling :2024-01-01, 7d
  section Sprint 2
    Documentation & AI Integration :2024-01-08, 7d
  section Sprint 3
    Project Setup & Validation :2024-01-15, 7d
  section Sprint 4
    AI Model Configuration :2024-01-22, 7d
  section Sprint 5
    Quality Assurance & Launch :2024-01-29, 7d
  `;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Project Roadmap</h1>
        <p className="text-muted-foreground mb-8">
          Complete project timeline and milestone tracking
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <Mermaid chart={timeline} />
      </div>
    </div>
  );
}