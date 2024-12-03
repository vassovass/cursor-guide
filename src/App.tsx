import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Layout />
      <Toaster />
    </Router>
  );
}

export default App;