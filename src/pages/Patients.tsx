
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Patient, ConditionSeverity } from '@/types';
import { Search, MessageSquare, FileText, AlertTriangle } from 'lucide-react';

// Mock data for patients with Indian names
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    role: 'patient',
    age: 45,
    contactNumber: '555-123-4567',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    mentalHealthScore: 9,
    conditionSeverity: 'Moderate',
    lastAssessmentDate: '2023-03-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Meera Gupta',
    email: 'meera.gupta@example.com',
    role: 'patient',
    age: 32,
    contactNumber: '555-987-6543',
    medicalHistory: 'Asthma, Seasonal Allergies',
    mentalHealthScore: 3,
    conditionSeverity: 'Mild',
    lastAssessmentDate: '2023-03-20T10:15:00Z'
  },
  {
    id: '3',
    name: 'Rahul Joshi',
    email: 'rahul.joshi@example.com',
    role: 'patient',
    age: 58,
    contactNumber: '555-222-3333',
    medicalHistory: 'Coronary Artery Disease, Hyperlipidemia',
    mentalHealthScore: 12,
    conditionSeverity: 'Severe',
    lastAssessmentDate: '2023-03-10T09:45:00Z'
  },
  {
    id: '4',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    role: 'patient',
    age: 29,
    contactNumber: '555-444-5555',
    medicalHistory: 'Anxiety, Migraines',
    mentalHealthScore: 7,
    conditionSeverity: 'Moderate',
    lastAssessmentDate: '2023-03-18T13:20:00Z'
  },
  {
    id: '5',
    name: 'Deepak Kumar',
    email: 'deepak.kumar@example.com',
    role: 'patient',
    age: 41,
    contactNumber: '555-666-7777',
    medicalHistory: 'GERD, IBS',
    mentalHealthScore: 1,
    conditionSeverity: 'Minimal',
    lastAssessmentDate: '2023-03-22T15:10:00Z'
  }
];

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default sort by severity (highest first)
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch patients
    const fetchPatients = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatients(mockPatients);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalHistory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditionSeverity?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort patients by condition severity
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const severityOrder = { 'Severe': 4, 'Moderate': 3, 'Mild': 2, 'Minimal': 1, undefined: 0 };
    const aValue = a.conditionSeverity ? severityOrder[a.conditionSeverity] : 0;
    const bValue = b.conditionSeverity ? severityOrder[b.conditionSeverity] : 0;
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const getSeverityColor = (severity?: ConditionSeverity) => {
    switch (severity) {
      case 'Severe': return 'text-red-600 bg-red-50';
      case 'Moderate': return 'text-orange-600 bg-orange-50';
      case 'Mild': return 'text-yellow-600 bg-yellow-50';
      case 'Minimal': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Patients</h1>
          <p className="text-gray-600 mt-2">Manage your patient records and communications</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name or condition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-[300px]"
          />
        </div>
      </div>
      
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={toggleSortOrder}
          className="text-sm flex items-center gap-1"
        >
          Sort by Severity: {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p>Loading patients...</p>
        </div>
      ) : sortedPatients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No patients found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPatients.map((patient) => (
            <Card key={patient.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{patient.name}</CardTitle>
                    <CardDescription>
                      Age: {patient.age}
                    </CardDescription>
                  </div>
                  {patient.conditionSeverity === 'Severe' && (
                    <div className="text-red-500">
                      <AlertTriangle size={20} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{patient.contactNumber}</p>
                    <p className="text-sm">{patient.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Mental Health Assessment</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getSeverityColor(patient.conditionSeverity)}`}>
                        {patient.conditionSeverity || 'Not assessed'}
                      </span>
                      {patient.lastAssessmentDate && (
                        <span className="text-xs text-gray-500">
                          ({new Date(patient.lastAssessmentDate).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Medical History</p>
                    <p className="text-sm text-gray-700">{patient.medicalHistory || 'No medical history recorded'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Link to={`/patient/${patient.id}`}>
                    <FileText size={16} />
                    <span>Records</span>
                  </Link>
                </Button>
                <Button 
                  asChild
                  className={`${patient.conditionSeverity === 'Severe' || patient.conditionSeverity === 'Moderate' ? 'bg-red-500 hover:bg-red-600' : 'healthcare-gradient'} text-white`}
                  size="sm"
                >
                  <Link to={`/messages/new/${patient.id}`} className="flex items-center gap-1">
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

export default Patients;
