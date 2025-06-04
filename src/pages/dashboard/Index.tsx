import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        <Header />
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Title */}
            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Employee Management
            </h1>
            <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
              Streamline your workforce management with our modern, intuitive dashboard. Add new employees and manage your team effortlessly.
            </p>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Add Employee Card */}
              <div 
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => navigate('/add-employee')}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-3xl">➕</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Add Employee</h3>
                <p className="text-slate-300 mb-6">Create new employee records with detailed information and manage their profiles.</p>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300">
                  Get Started
                </button>
              </div>

              {/* View Employees Card */}
              <div 
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => navigate('/employees')} 
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">View Employees</h3>
                <p className="text-slate-300 mb-6">Browse, edit, and manage your existing employee database with advanced filtering.</p>
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}