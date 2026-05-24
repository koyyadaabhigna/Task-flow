import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, User, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isConnected, onlineCount } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{backgroundColor: 'var(--navbar-bg)', borderColor: 'var(--border-color)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-glow-indigo group-hover:shadow-glow-cyan transition-all duration-300">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg tracking-tight" style={{color: 'var(--text-primary)'}}>
              Task<span style={{color: 'var(--accent-primary)'}}>Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              {/* Connection Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border text-xs" style={{backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)'}}>
                <span className="relative flex h-2 w-2">
                  {isConnected ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </>
                  ) : (
                    <>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
                    </>
                  )}
                </span>
                <span className={`${isConnected ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                  {isConnected ? 'Live Sync' : 'Offline'}
                </span>
                {isConnected && onlineCount > 1 && (
                  <span className="text-slate-500 border-l border-slate-700 pl-2">
                    {onlineCount} online
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)'}}>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 flex items-center justify-center">
                  <User size={12} style={{color: 'var(--accent-primary)'}} />
                </div>
                <span className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>{user.name}</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="toggle-btn"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 text-sm font-medium"
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
              style={{color: 'var(--text-secondary)'}}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {user && menuOpen && (
          <div className="sm:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2 pt-2 border-t" style={{borderColor: 'var(--border-color)'}}>
              {/* Connection Status Badge (Mobile) */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs w-full" style={{backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)'}}>
                <span className="relative flex h-2 w-2">
                  {isConnected ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </>
                  ) : (
                    <>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
                    </>
                  )}
                </span>
                <span className={`${isConnected ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                  {isConnected ? 'Live Sync Enabled' : 'Offline Mode'}
                </span>
                {isConnected && onlineCount > 1 && (
                  <span className="text-slate-500 ml-auto px-2 py-0.5 rounded-md border text-xs" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                    {onlineCount} online
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)'}}>
                <User size={14} style={{color: 'var(--accent-primary)'}} />
                <span className="text-sm" style={{color: 'var(--text-secondary)'}}>{user.name}</span>
                <span className="text-xs" style={{color: 'var(--text-muted)', marginLeft: 'auto'}}>{user.email}</span>
              </div>

              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium w-full border"
                style={{backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)'}}
              >
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>

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
