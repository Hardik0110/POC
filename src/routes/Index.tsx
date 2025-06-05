import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Index';
import AddEmployee from '../pages/dashboard/AddEmployee';
import Employees from '../pages/dashboard/Employee';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <ProtectedRoute><Outlet /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/add-employee', element: <AddEmployee /> },
      { path: '/employees', element: <Employees /> },
      { path: '/', element: <Dashboard /> },
    ],
  },
]);
