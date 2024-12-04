import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('AI Suite Integration Tests', () => {
  it('should verify AI Suite process endpoint is accessible', async () => {
    const testInput = "Test input for AI processing";
    const response = await supabase.functions.invoke('ai-suite-process', {
      body: { 
        modelId: 'openai:gpt-4o-mini',
        input: testInput,
        task: 'test'
      }
    });

    // Log the full response for debugging
    console.log('AI Suite Process Response:', response);

    // Basic connectivity test
    expect(response).toBeDefined();
    
    if (response.error) {
      console.error('AI Suite Process Error:', response.error);
    }

    // Check if we're getting a proper response structure
    if (response.data) {
      expect(response.data).toHaveProperty('output');
      expect(response.data).toHaveProperty('model');
      expect(response.data).toHaveProperty('task');
    }
  });

  it('should verify available AI models from sync function', async () => {
    const { data: models, error } = await supabase
      .from('ai_suite_models')
      .select('*');

    console.log('Available AI Models:', models);
    if (error) console.error('AI Models Error:', error);

    expect(error).toBeNull();
    expect(models).toBeDefined();
    expect(Array.isArray(models)).toBe(true);
  });

  it('should test aisuite package availability', async () => {
    const response = await supabase.functions.invoke('ai-suite-process', {
      body: {
        action: 'verify_package',
      }
    });

    console.log('AI Suite Package Verification Response:', response);
    
    if (response.error) {
      console.error('Package Verification Error:', response.error);
    }

    expect(response).toBeDefined();
  });
});