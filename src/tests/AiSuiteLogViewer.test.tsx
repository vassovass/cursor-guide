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
    // Mock the providers response
    const mockProvidersResponse = {
      data: {
        providers: [
          {
            name: 'openai',
            models: [
              {
                model_id: 'openai:gpt-4o',
                model_name: 'GPT-4 Optimized',
                provider: 'openai',
                version: '1.0',
                capabilities: {
                  tasks: ['text-generation'],
                  features: ['chat']
                }
              }
            ]
          }
        ]
      }
    };

    // Mock the Supabase function calls
    (supabase.functions.invoke as ReturnType<typeof vi.fn>)
      .mockImplementation((functionName, options) => {
        if (functionName === 'ai-suite-process') {
          return Promise.resolve({
            data: {
              status: 'success',
              message: 'AI Suite connection test completed',
              details: {
                modelsAvailable: true,
                endpointAccessible: true,
                aiSuiteVersion: '1.0.0'
              }
            }
          });
        } else if (functionName === 'sync-ai-models') {
          return Promise.resolve(mockProvidersResponse);
        }
      });

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

    // Verify AI Suite specific logs appear
    const aiSuiteLog = screen.getByText(/\[INFO\] AI Suite connection test completed/);
    expect(aiSuiteLog).toBeInTheDocument();

    // Verify provider logs appear
    const providerLog = screen.getByText(/\[INFO\] Found 1 AI providers/);
    expect(providerLog).toBeInTheDocument();

    const modelLog = screen.getByText(/\[INFO\] Provider: openai/);
    expect(modelLog).toBeInTheDocument();
  });
});