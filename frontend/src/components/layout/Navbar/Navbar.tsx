// frontend/src/components/layout/Navbar/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { paths } from '../../../router/paths';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../ui/Button/Button';
import { ThemeToggle } from '../../ui/ThemeToggle/ThemeToggle';
import { NotificationBell } from '../../notifications/NotificationBell/NotificationBell';
import { cn } from '../../../utils/cn';

const navLinks = [
  { name: 'Home', path: paths.home },
  { name: 'Browse', path: paths.browse },
  { name: 'About', path: paths.about },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'
          : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={paths.home} className="flex items-center gap-2">
            <MusicalNoteIcon className="w-8 h-8 text-gold-500" />
            <span className="text-xl font-bold text-navy-900 dark:text-white">
              Afro<span className="text-gold-500">Muziki</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-gold-600 dark:text-gold-500'
                    : 'text-gray-700 hover:text-gold-600 dark:text-gray-300 dark:hover:text-gold-500'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to={paths.search}>
              <Button variant="ghost" size="sm" icon={<MagnifyingGlassIcon className="w-4 h-4" />} />
            </Link>
            
            <ThemeToggle />
            
            {user ? (
              <>
                <NotificationBell />
                <Link to={user.role === 'artist' ? paths.artist.dashboard : paths.profile}>
                  <Button variant="ghost" size="sm" icon={<UserIcon className="w-4 h-4" />}>
                    {user.username}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={paths.login}>
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to={paths.register}>
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={cn('w-full h-0.5 bg-current transition-all', isMobileMenuOpen && 'rotate-45 translate-y-2')} />
              <span className={cn('w-full h-0.5 bg-current transition-all', isMobileMenuOpen && 'opacity-0')} />
              <span className={cn('w-full h-0.5 bg-current transition-all', isMobileMenuOpen && '-rotate-45 -translate-y-2')} />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-2 rounded-lg transition-colors',
                    location.pathname === link.path
                      ? 'bg-gray-100 dark:bg-gray-800 text-gold-600'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                {user ? (
                  <>
                    <Link to={paths.search} className="block px-3 py-2 text-gray-700 dark:text-gray-300">
                      Search
                    </Link>
                    <Link to={user.role === 'artist' ? paths.artist.dashboard : paths.profile} className="block px-3 py-2 text-gray-700 dark:text-gray-300">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={paths.login} className="block px-3 py-2 text-gray-700 dark:text-gray-300">
                      Log In
                    </Link>
                    <Link to={paths.register} className="block px-3 py-2 text-gold-600 font-medium">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
