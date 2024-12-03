import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { VersionDisplay } from './VersionDisplay';
import { SetupPage } from '@/pages/SetupPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { BestPracticesPage } from '@/pages/BestPracticesPage';
import { ModelConfigPage } from '@/pages/ModelConfigPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { MetricsPage } from '@/pages/MetricsPage';
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
            <Route path="/model-config" element={<ModelConfigPage />} />
            {debugMode && (
              <>
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/metrics" element={<MetricsPage />} />
                <Route path="/roadmap/sprint-1" element={<div>Sprint 1 Content</div>} />
                <Route path="/roadmap/sprint-2" element={<div>Sprint 2 Content</div>} />
                <Route path="/roadmap/sprint-3" element={<div>Sprint 3 Content</div>} />
                <Route path="/roadmap/sprint-4" element={<div>Sprint 4 Content</div>} />
                <Route path="/roadmap/sprint-5" element={<div>Sprint 5 Content</div>} />
              </>
            )}
          </Routes>
        </main>
      </div>
      <VersionDisplay />
    </div>
  );
}