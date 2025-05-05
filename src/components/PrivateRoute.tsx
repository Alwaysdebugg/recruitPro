import { Navigate, useLocation } from 'react-router-dom';
import { useUser, clearUser } from '../contexts/userContext';
import { useEffect } from 'react';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useUser();
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (!token) {
      clearUser();
    }
  }, [token]);

  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;