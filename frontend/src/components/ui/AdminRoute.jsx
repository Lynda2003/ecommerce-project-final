import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user?.isAdmin ? children : <Navigate to="/" />;
}