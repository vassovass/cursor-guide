import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SetupPage } from '@/pages/SetupPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { BestPracticesPage } from '@/pages/BestPracticesPage';
import { ModelConfigPage } from '@/pages/ModelConfigPage';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/best-practices" element={<BestPracticesPage />} />
            <Route path="/model-config" element={<ModelConfigPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}