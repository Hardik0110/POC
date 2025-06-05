import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user
    ? <>{children}</>
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
