
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Doctor } from '@/types';
import { Search, MessageSquare } from 'lucide-react';

// Mock data for doctors with Indian names
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 12,
    availability: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Experienced cardiologist specializing in preventive care and heart health management.'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@example.com',
    role: 'doctor',
    specialization: 'Neurology',
    experience: 8,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    bio: 'Neurologist focused on treatment of stroke, epilepsy, and movement disorders.'
  },
  {
    id: '3',
    name: 'Dr. Anjali Verma',
    email: 'anjali.verma@example.com',
    role: 'doctor',
    specialization: 'Pediatrics',
    experience: 15,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    bio: 'Pediatrician with expertise in child development and preventive care.'
  },
  {
    id: '4',
    name: 'Dr. Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    role: 'doctor',
    specialization: 'Dermatology',
    experience: 10,
    availability: ['Wednesday', 'Friday'],
    bio: 'Dermatologist specializing in skin cancer screening and cosmetic procedures.'
  },
  {
    id: '5',
    name: 'Dr. Neha Kapoor',
    email: 'neha.kapoor@example.com',
    role: 'doctor',
    specialization: 'Psychiatry',
    experience: 14,
    availability: ['Monday', 'Wednesday', 'Thursday'],
    bio: 'Psychiatrist focusing on depression, anxiety, and stress management.'
  }
];

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch doctors
    const fetchDoctors = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDoctors(mockDoctors);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Find a Doctor</h1>
          <p className="text-gray-600 mt-2">Connect with healthcare professionals</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-[300px]"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p>Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-healthcare-100 to-healthcare-200 pb-2">
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <CardDescription className="text-healthcare-700 font-medium">
                  {doctor.specialization}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{doctor.experience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available on</p>
                    <p className="font-medium">{doctor.availability?.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">About</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{doctor.bio}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                >
                  <Link to={`/doctor/${doctor.id}`}>View Profile</Link>
                </Button>
                <Button 
                  asChild
                  className="healthcare-gradient text-white" 
                  size="sm"
                >
                  <Link to={`/messages/new/${doctor.id}`} className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
