import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Index';
import { AuthProvider } from './lib/store/auth';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;