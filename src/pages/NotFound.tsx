
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl font-bold text-healthcare-500">404</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        We're sorry, the page you requested could not be found. Please check the URL or navigate back to the homepage.
      </p>
      <Button asChild>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
