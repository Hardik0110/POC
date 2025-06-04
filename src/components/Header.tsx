import { useEffect, useState } from 'react';
import { auth } from '../lib/utils/firebase';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="backdrop-blur-lg bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Employee Dashboard
            </h1>
            {userEmail && (
              <span className="text-slate-300 backdrop-blur-lg bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                {userEmail}
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl
              hover:from-red-600 hover:to-pink-600 transition-all duration-300
              shadow-lg hover:shadow-xl hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};