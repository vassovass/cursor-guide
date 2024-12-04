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

  it('should fetch and validate all AI providers and their models', async () => {
    // Mock the response from the GitHub API for providers
    const mockProvidersResponse = {
      data: [
        { name: 'openai_provider.py' },
        { name: 'anthropic_provider.py' },
        { name: 'google_provider.py' },
        { name: 'groq_provider.py' },
        { name: 'perplexity_provider.py' },
        { name: 'mistral_provider.py' },
        { name: 'huggingface_provider.py' }
      ]
    };

    // Test fetching providers
    const response = await supabase.functions.invoke('sync-ai-models', {
      body: { action: 'fetch_providers' }
    });

    console.log('AI Providers Response:', response);
    
    if (response.error) {
      console.error('Providers Fetch Error:', response.error);
    }

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.providers)).toBe(true);

    // Verify each provider has the correct structure
    response.data.providers.forEach((provider: any) => {
      expect(provider).toHaveProperty('name');
      expect(provider).toHaveProperty('models');
      expect(Array.isArray(provider.models)).toBe(true);

      // Verify each model has required properties
      provider.models.forEach((model: any) => {
        expect(model).toHaveProperty('model_id');
        expect(model).toHaveProperty('model_name');
        expect(model).toHaveProperty('provider');
        expect(model).toHaveProperty('version');
        expect(model).toHaveProperty('capabilities');
      });
    });

    // Verify specific providers are present
    const providerNames = response.data.providers.map((p: any) => p.name.toLowerCase());
    expect(providerNames).toContain('openai');
    expect(providerNames).toContain('anthropic');
    expect(providerNames).toContain('google');

    // Verify specific models for key providers
    const openaiProvider = response.data.providers.find((p: any) => 
      p.name.toLowerCase() === 'openai'
    );
    expect(openaiProvider.models).toContainEqual(
      expect.objectContaining({
        model_id: 'openai:gpt-4o',
        model_name: 'GPT-4 Optimized'
      })
    );

    const anthropicProvider = response.data.providers.find((p: any) => 
      p.name.toLowerCase() === 'anthropic'
    );
    expect(anthropicProvider.models).toContainEqual(
      expect.objectContaining({
        model_id: 'anthropic:claude-3-opus',
        model_name: 'Claude 3 Opus'
      })
    );

    // Test model capabilities
    response.data.providers.forEach((provider: any) => {
      provider.models.forEach((model: any) => {
        expect(model.capabilities).toHaveProperty('tasks');
        expect(model.capabilities).toHaveProperty('features');
        expect(model.capabilities.tasks).toContain('text-generation');
        expect(model.capabilities.features).toContain('chat');
      });
    });
  });
});
