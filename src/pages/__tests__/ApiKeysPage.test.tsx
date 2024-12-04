import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiKeysPage } from '../ApiKeysPage';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

// Create a fresh QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ApiKeysPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show sync button', () => {
    renderWithClient(<ApiKeysPage />);
    expect(screen.getByText(/Sync Models/i)).toBeInTheDocument();
  });

  it('should handle successful sync', async () => {
    // Mock successful response
    (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({ 
      data: { success: true }, 
      error: null 
    });

    renderWithClient(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('sync-ai-models');
    });

    // Should show success message
    expect(await screen.findByText(/AI models have been synced successfully/i)).toBeInTheDocument();
  });

  it('should handle sync failure', async () => {
    // Mock error response
    (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to sync')
    });

    renderWithClient(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('sync-ai-models');
    });

    // Should show error message
    expect(await screen.findByText(/Failed to sync/i)).toBeInTheDocument();
  });

  it('should handle unauthorized error', async () => {
    // Mock 401 unauthorized error
    (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: {
        message: 'Missing authorization header',
        status: 401
      }
    });

    renderWithClient(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('sync-ai-models');
    });

    // Should show unauthorized error message
    expect(await screen.findByText(/Missing authorization header/i)).toBeInTheDocument();
  });
});