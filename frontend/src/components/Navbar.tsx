import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const { clearAuth, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/projects" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div>
              <span className="font-bold text-xl">Atoms Demo</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/projects"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Projects
            </Link>
            <Link
              to="/components"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Components
            </Link>
            <div className="text-gray-300 text-sm">
              {user?.name || user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
