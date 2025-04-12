
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  MessageSquare, 
  User, 
  Users, 
  LogOut,
  Menu,
  BrainCircuit,
  Pill,
  ClipboardList,
  Building2
} from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {user && (
        <>
          <Link 
            to="/profile" 
            className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </Link>
          
          {user.role === 'doctor' ? (
            <>
              <Link 
                to="/patients" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <Users size={18} />
                <span>Patients</span>
              </Link>
              <Link 
                to="/profile?tab=records" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <ClipboardList size={18} />
                <span>Records</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <MessageSquare size={18} />
                <span>Messages</span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/profile?tab=assessment" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <BrainCircuit size={18} />
                <span>Mental Health</span>
              </Link>
              <Link 
                to="/profile?tab=medications" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <Pill size={18} />
                <span>Medications</span>
              </Link>
              <Link 
                to="/doctors" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <User size={18} />
                <span>Doctors</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center gap-1 text-gray-700 hover:text-healthcare-500 transition-colors"
              >
                <MessageSquare size={18} />
                <span>Messages</span>
              </Link>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="flex items-center gap-1"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white header-shadow sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center">
            <span className="text-white font-bold">CH</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xl text-healthcare-800">ChikitsakAI</span>
            <span className="text-xs text-healthcare-500">Digital Healthcare Initiative</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
          >
            <Menu />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <NavLinks />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
