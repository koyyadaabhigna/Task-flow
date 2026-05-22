import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-border bg-void-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-glow-indigo group-hover:shadow-glow-cyan transition-all duration-300">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg text-white tracking-tight">
              Task<span className="text-indigo-400">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-void-800 border border-surface-border">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 flex items-center justify-center">
                  <User size={12} className="text-indigo-400" />
                </div>
                <span className="text-sm text-slate-300 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 text-sm font-medium"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-void-700 transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {user && menuOpen && (
          <div className="sm:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-border">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-void-800">
                <User size={14} className="text-indigo-400" />
                <span className="text-sm text-slate-300">{user.name}</span>
                <span className="text-xs text-slate-500 ml-auto">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
