import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            TM
          </div>
          TaskManager
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/projects" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"><FolderKanban size={18} /> Projects</Link>
          <Link to="/tasks" className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"><CheckSquare size={18} /> Tasks</Link>
          <button onClick={handleLogout} className="ml-4 text-red-500 hover:text-red-700 transition flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
