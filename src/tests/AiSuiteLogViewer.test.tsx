import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoadmapMenu } from '@/components/layout/RoadmapMenu';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('AI Suite Log Integration Tests', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <RoadmapMenu />
      </BrowserRouter>
    );
  });

  it('should show AI Suite test results in logs when View Logs is clicked', async () => {
    // Click the View Logs button
    const viewLogsButton = screen.getByText('View Logs');
    expect(viewLogsButton).toBeInTheDocument();
    fireEvent.click(viewLogsButton);

    // Verify log viewer is open
    const logViewer = screen.getByText('Debug Logs');
    expect(logViewer).toBeInTheDocument();

    // Check for AI Suite test logs
    const infoLog = screen.getByText(/\[INFO\] Application initialized/);
    expect(infoLog).toBeInTheDocument();
    expect(infoLog).toHaveClass('text-muted-foreground');

    // Mock AI Suite test results
    const mockAiSuiteResponse = {
      data: {
        status: 'success',
        message: 'AI Suite connection test completed',
        details: {
          modelsAvailable: true,
          endpointAccessible: true,
          aiSuiteVersion: '1.0.0'
        }
      }
    };

    // Mock the Supabase function call
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue(mockAiSuiteResponse);

    // Verify AI Suite specific logs appear
    const aiSuiteLog = screen.getByText(/\[INFO\] AI Suite connection test completed/);
    expect(aiSuiteLog).toBeInTheDocument();
    
    // Check for error handling
    const warningLog = screen.getByText(/\[WARN\] No routes matched location "\/logs"/);
    expect(warningLog).toBeInTheDocument();
    expect(warningLog).toHaveClass('text-yellow-500');

    const errorLog = screen.getByText(/\[ERROR\] Failed to load resource/);
    expect(errorLog).toBeInTheDocument();
    expect(errorLog).toHaveClass('text-red-500');
  });
});