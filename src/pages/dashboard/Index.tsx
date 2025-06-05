import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  hoverGradient: string;
  onClick: () => void;
}

function NavigationCard({ title, description, icon, gradient, hoverGradient, onClick }: NavigationCardProps) {
  return (
    <div 
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>
      <button className={`w-full py-3 ${gradient} text-white font-semibold rounded-xl ${hoverGradient} transition-all duration-300`}>
        {title === 'Add Employee' ? 'Get Started' : 'View All'}
      </button>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: 'Add Employee',
      description: 'Create new employee records with detailed information and manage their profiles.',
      icon: '➕',
      gradient: 'bg-gradient-to-r from-cyan-500 to-purple-500',
      hoverGradient: 'hover:from-cyan-600 hover:to-purple-600',
      onClick: () => navigate('/add-employee')
    },
    {
      title: 'View Employees',
      description: 'Browse, edit, and manage your existing employee database with advanced filtering.',
      icon: '👥',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
      onClick: () => navigate('/employees')
    }
  ];

  return (
    <div className="common-background">
      <div className="relative z-10 container mx-auto p-6">
        <Header />
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-7xl font-bold gradient-text mb-6">
              Employee Management
            </h1>
            <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
              Streamline your workforce management with our modern, intuitive dashboard. Add new employees and manage your team effortlessly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {navigationCards.map((card) => (
                <NavigationCard
                  key={card.title}
                  {...card}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}