import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/toaster';
import { useEffect } from 'react';
import { supabase } from './integrations/supabase/client';
import { useToast } from './components/ui/use-toast';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const signInWithEmail = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'vasso@vaseo.co.za',
        password: 'your-password-here' // Replace with your actual password
      });

      if (error) {
        console.error('Authentication error:', error);
        toast({
          title: "Authentication Error",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        console.log('Successfully authenticated as vasso@vaseo.co.za');
      }
    };

    // Check current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        signInWithEmail();
      } else {
        console.log('Already authenticated as:', session.user.email);
      }
    });
  }, [toast]);

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