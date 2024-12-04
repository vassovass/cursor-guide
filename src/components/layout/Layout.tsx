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
import { SprintPage } from '@/pages/SprintPage';
import { ApiKeysPage } from '@/pages/ApiKeysPage';
import { useState, useEffect } from 'react';

export function Layout() {
  const [debugMode, setDebugMode] = useState(() => {
    const saved = localStorage.getItem("debugMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("debugMode");
    if (saved) {
      setDebugMode(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex pt-16">
        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out lg:block z-30`}>
          <Sidebar debugMode={debugMode} onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/best-practices" element={<BestPracticesPage />} />
            <Route path="/model-config" element={<ModelConfigPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/roadmap/sprint-:sprintNumber" element={<SprintPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
          </Routes>
        </main>
      </div>
      <VersionDisplay />
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}