import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import type { LayoutProps } from '../lib/types/types';

export function Layout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true, 
  showEmployeesButton = false,
  showAddButton = false 
}: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="common-background text-white">
      <div className="page-container">
        <Header />
        
        <div className="mt-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            {showBackButton && (
              <button onClick={() => navigate('/')} className="gradient-button ml-4 px-4 py-2">
                <span className="text-xl">←</span>
                Back to Home
              </button>
            )}
            
            {showEmployeesButton && (
              <button
                onClick={() => navigate('/employees')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300"
              >
                <span className="text-lg">👥</span>
                View All Employees
              </button>
            )}
            
            {showAddButton && (
              <button
                onClick={() => navigate('/add-employee')}
                className="gradient-button flex items-center gap-2 px-4 py-2 mr-4"
              >
                <span className="text-lg">➕</span>
                Add New Employee
              </button>
            )}
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}