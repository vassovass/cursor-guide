import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { VersionDisplay } from './VersionDisplay';
import { SetupPage } from '@/pages/SetupPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { BestPracticesPage } from '@/pages/BestPracticesPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { MetricsPage } from '@/pages/MetricsPage';
import { SprintPage } from '@/pages/SprintPage';
import { useState, useEffect } from 'react';

export function Layout() {
  const [debugMode, setDebugMode] = useState(() => {
    const saved = localStorage.getItem("debugMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const saved = localStorage.getItem("debugMode");
    if (saved) {
      setDebugMode(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <div className="hidden lg:block">
          <Sidebar debugMode={debugMode} />
        </div>
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/best-practices" element={<BestPracticesPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/roadmap/sprint-:sprintNumber" element={<SprintPage />} />
          </Routes>
        </main>
      </div>
      <VersionDisplay />
    </div>
  );
}