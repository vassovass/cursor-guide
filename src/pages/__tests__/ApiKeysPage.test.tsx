import { render, screen, fireEvent } from '@testing-library/react';
import { ApiKeysPage } from '../ApiKeysPage';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Create a new QueryClient for each test
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ApiKeysPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the sync button', () => {
    renderWithProviders(<ApiKeysPage />);
    expect(screen.getByText(/Sync Models/i)).toBeInTheDocument();
  });

  it('handles successful sync', async () => {
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    mockInvoke.mockResolvedValueOnce({ data: {}, error: null });

    renderWithProviders(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    await fireEvent.click(syncButton);

    expect(mockInvoke).toHaveBeenCalledWith('sync-ai-models');
    expect(screen.getByText(/Success/i)).toBeInTheDocument();
  });

  it('handles sync failure', async () => {
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    mockInvoke.mockResolvedValueOnce({ 
      data: null, 
      error: new Error('Failed to sync') 
    });

    renderWithProviders(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    await fireEvent.click(syncButton);

    expect(mockInvoke).toHaveBeenCalledWith('sync-ai-models');
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  it('handles unauthorized error (401)', async () => {
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    mockInvoke.mockResolvedValueOnce({ 
      data: null, 
      error: { 
        message: 'Missing authorization header',
        status: 401 
      } 
    });

    renderWithProviders(<ApiKeysPage />);
    
    const syncButton = screen.getByText(/Sync Models/i);
    await fireEvent.click(syncButton);

    expect(mockInvoke).toHaveBeenCalledWith('sync-ai-models');
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });
});