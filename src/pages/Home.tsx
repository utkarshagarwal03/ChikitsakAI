
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Users, Activity } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const redirectPath = user?.role === 'doctor' ? '/patients' : '/doctors';

  const features = [
    {
      icon: <Users className="h-10 w-10 text-healthcare-500" />,
      title: 'Doctor-Patient Connection',
      description: 'Seamlessly connect with healthcare professionals or manage your patients.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-healthcare-500" />,
      title: 'Secure Messaging',
      description: 'Communicate with doctors or patients through our secure messaging system.'
    },
    {
      icon: <Heart className="h-10 w-10 text-healthcare-500" />,
      title: 'Holistic Care',
      description: 'Receive or provide care that addresses the whole person, not just symptoms.'
    },
    {
      icon: <Activity className="h-10 w-10 text-healthcare-500" />,
      title: 'Health Tracking',
      description: 'Keep track of health progress and treatment plans all in one place.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-healthcare-100 to-healthcare-200 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Mindful Healthcare <span className="text-healthcare-600">For Everyone</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Connecting patients with healthcare professionals through a simple, secure, and mindful platform.
              </p>
              {isAuthenticated ? (
                <Button 
                  asChild
                  size="lg" 
                  className="healthcare-gradient text-white"
                >
                  <Link to={redirectPath}>
                    {user?.role === 'doctor' ? 'View Your Patients' : 'Find a Doctor'}
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="healthcare-gradient text-white"
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button 
                    asChild
                    size="lg" 
                    variant="outline"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Healthcare professionals" 
                className="rounded-lg shadow-xl max-h-96 object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Features</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Mindful Care System provides tools and features to make healthcare communication simpler and more effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-healthcare-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers already using Mindful Care System.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="healthcare-gradient text-white"
              >
                <Link to="/register">Create an Account</Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
