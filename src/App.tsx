import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/toaster';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import { useToast } from './components/ui/use-toast';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        console.log('Authenticated as:', session.user.email);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6E59A5',
                    brandAccent: '#7E69AB',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;