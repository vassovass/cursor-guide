import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));