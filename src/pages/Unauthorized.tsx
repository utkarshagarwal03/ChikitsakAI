
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        You don't have permission to access this page. Please log in with the appropriate account type or return to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </Button>
        <Button asChild className="healthcare-gradient text-white">
          <Link to="/login">
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
