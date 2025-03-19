
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleDarkMode, isDarkMode }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by AuthProvider through protected routes
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Notelio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/') 
                ? "text-primary" 
                : "text-foreground/70"
            )}
          >
            Home
          </Link>
          {currentUser && (
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/dashboard') 
                  ? "text-primary" 
                  : "text-foreground/70"
              )}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/features"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/features') 
                ? "text-primary" 
                : "text-foreground/70"
            )}
          >
            Features
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {currentUser ? (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
              <Button asChild>
                <Link to="/dashboard">
                  My Notes
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-b border-border">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary py-2",
                isActive('/') 
                  ? "text-primary" 
                  : "text-foreground/70"
              )}
            >
              Home
            </Link>
            {currentUser && (
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  isActive('/dashboard') 
                    ? "text-primary" 
                    : "text-foreground/70"
                )}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/features"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary py-2",
                isActive('/features') 
                  ? "text-primary" 
                  : "text-foreground/70"
              )}
            >
              Features
            </Link>
            
            {currentUser ? (
              <>
                <Button variant="ghost" onClick={handleLogout} className="justify-start">
                  Log out
                </Button>
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    My Notes
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
