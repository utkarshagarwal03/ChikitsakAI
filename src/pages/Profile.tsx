
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Patient, Doctor, ConditionSeverity, ADRTestResult } from '@/types';
import { User as UserIcon, Calendar, Phone, BookText, GraduationCap, Clock, BrainCircuit, MessageSquare, HeartPulse, Pill, ClipboardList, AlertTriangle } from 'lucide-react';
import MentalAssessment from '@/components/MentalAssessment';
import NLPAssistant from '@/components/NLPAssistant';
import MedicationReminder from '@/components/MedicationReminder';
import DailyPatientRecordComponent from '@/components/DailyPatientRecord';
import TextToSpeechButton from '@/components/TextToSpeechButton';


const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Partial<Patient | Doctor>>({});
  const [activeTab, setActiveTab] = useState('profile');
  const [showAssessment, setShowAssessment] = useState(false);
  const [showADRTest, setShowADRTest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    // For now, we'll just update the local storage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('mindfulCareUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleAssessmentComplete = (score: number, severity: ConditionSeverity) => {
    // In a real app, this would be sent to the backend
    const updatedUser = { 
      ...user, 
      mentalHealthScore: score,
      conditionSeverity: severity,
      lastAssessmentDate: new Date().toISOString(),
    };
    
    localStorage.setItem('mindfulCareUser', JSON.stringify(updatedUser));
    setShowAssessment(false);
    
    toast({
      title: "Assessment completed",
      description: `Your mental health assessment has been recorded. Severity level: ${severity}`,
    });

    // Update the form data to show the new assessment results
    setFormData(updatedUser);
    setActiveTab('profile');
  };

  
      
      

  const updatePatientData = (updatedPatient: Patient) => {
    localStorage.setItem('mindfulCareUser', JSON.stringify(updatedPatient));
    setFormData(updatedPatient);
  };

  const updateDoctorData = (updatedDoctor: Doctor) => {
    localStorage.setItem('mindfulCareUser', JSON.stringify(updatedDoctor));
    setFormData(updatedDoctor);
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


  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const renderTabsList = () => {
    // Base tabs for all users
    const commonTabs = [
      <TabsTrigger key="profile" value="profile" className="text-base">
        <UserIcon className="h-4 w-4 mr-2" />
        Profile
      </TabsTrigger>,
      <TabsTrigger key="assistant" value="assistant" className="text-base">
        <MessageSquare className="h-4 w-4 mr-2" />
        AI Assistant
      </TabsTrigger>
    ];
    
    // Role-specific tabs
    if (user.role === 'patient') {
      return [
        ...commonTabs,
        <TabsTrigger key="assessment" value="assessment" className="text-base">
          <BrainCircuit className="h-4 w-4 mr-2" />
          Mental Health
        </TabsTrigger>,
        <TabsTrigger key="medications" value="medications" className="text-base">
          <Pill className="h-4 w-4 mr-2" />
          Medications
        </TabsTrigger>,
        <TabsTrigger key="adr" value="adr" className="text-base">
          <AlertTriangle className="h-4 w-4 mr-2" />
          ADR Test
        </TabsTrigger>
      ];
    } else {
      return [
        ...commonTabs,
        <TabsTrigger key="records" value="records" className="text-base">
          <ClipboardList className="h-4 w-4 mr-2" />
          Patient Records
        </TabsTrigger>
      ];
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-healthcare-700 flex items-center justify-center gap-2">
        <UserIcon className="h-7 w-7" />
        <span>Welcome to ChikitsakAI</span>
        <TextToSpeechButton text={`Welcome to ChikitsakAI, ${user.name}. This is your profile dashboard.`} />
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            {renderTabsList()}
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-white border-healthcare-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-healthcare-100 to-white">
                <CardTitle className="flex items-center gap-2 text-healthcare-800">
                  <UserIcon className="h-6 w-6 text-healthcare-500" />
                  <span>{user.name}'s Profile</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleChange} 
                        placeholder="Your name"
                        className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email || ''} 
                        onChange={handleChange} 
                        placeholder="Your email" 
                        type="email"
                        readOnly
                        className="bg-gray-50 border-healthcare-200"
                      />
                    </div>
                  </div>
                  
                  {user.role === 'patient' && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="age" className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-healthcare-500" />
                            <span>Age</span>
                          </Label>
                          <Input 
                            id="age" 
                            name="age" 
                            value={(formData as Patient).age || ''} 
                            onChange={handleChange} 
                            placeholder="Your age" 
                            type="number"
                            className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber" className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-healthcare-500" />
                            <span>Contact Number</span>
                          </Label>
                          <Input 
                            id="contactNumber" 
                            name="contactNumber" 
                            value={(formData as Patient).contactNumber || ''} 
                            onChange={handleChange} 
                            placeholder="Your contact number"
                            className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                          />
                        </div>
                      </div>
                      
                      {(formData as Patient).conditionSeverity && (
                        <div className="border rounded-md p-4 bg-healthcare-50 border-healthcare-100">
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-healthcare-800">
                            <HeartPulse className="h-5 w-5 text-healthcare-500" />
                            Health Status
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-gray-500">Condition Severity</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getSeverityColor((formData as Patient).conditionSeverity)}`}>
                                {(formData as Patient).conditionSeverity}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Assessment</p>
                              <p className="font-medium">
                                {(formData as Patient).lastAssessmentDate
                                  ? new Date((formData as Patient).lastAssessmentDate!).toLocaleDateString()
                                  : 'No assessment taken'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory" className="flex items-center gap-1">
                          <BookText className="h-4 w-4 text-healthcare-500" />
                          <span>Medical History</span>
                        </Label>
                        <Textarea 
                          id="medicalHistory" 
                          name="medicalHistory" 
                          value={(formData as Patient).medicalHistory || ''} 
                          onChange={handleChange} 
                          placeholder="Relevant medical history" 
                          rows={4}
                          className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                        />
                      </div>
                    </>
                  )}
                  
                  {user.role === 'doctor' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="specialization" className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-healthcare-500" />
                          <span>Specialization</span>
                        </Label>
                        <Input 
                          id="specialization" 
                          name="specialization" 
                          value={(formData as Doctor).specialization || ''} 
                          onChange={handleChange} 
                          placeholder="Your specialization"
                          className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-healthcare-500" />
                          <span>Years of Experience</span>
                        </Label>
                        <Input 
                          id="experience" 
                          name="experience" 
                          value={(formData as Doctor).experience || ''} 
                          onChange={handleChange} 
                          placeholder="Years of experience" 
                          type="number"
                          className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                        />
                      </div>
                    </div>
                  )}
                  
                  {user.role === 'doctor' && (
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-1">
                        <BookText className="h-4 w-4 text-healthcare-500" />
                        <span>Professional Bio</span>
                      </Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={(formData as Doctor).bio || ''} 
                        onChange={handleChange} 
                        placeholder="Your professional bio" 
                        rows={4}
                        className="border-healthcare-200 focus:border-healthcare-400 focus:ring-healthcare-400"
                      />
                    </div>
                  )}
                  
                  <CardFooter className="px-0 pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-healthcare-500 hover:bg-healthcare-600 text-white"
                    >
                      Update Profile
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessment">
            {showAssessment ? (
              <MentalAssessment onComplete={handleAssessmentComplete} />
            ) : (
              <Card className="border-healthcare-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-healthcare-100 to-white">
                  <CardTitle className="flex items-center gap-2 text-healthcare-800">
                    <BrainCircuit className="h-6 w-6 text-healthcare-500" />
                    <span>Mental Health Assessment</span>
                  </CardTitle>
                  <CardDescription>
                    Take a quick assessment to help us understand your mental health needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This assessment consists of questions about your mental well-being over the past two weeks. 
                    Your answers will help your healthcare provider understand your needs better.
                  </p>
                  
                  {(formData as Patient).lastAssessmentDate && (
                    <div className="p-4 border rounded-md bg-healthcare-50 border-healthcare-100">
                      <h3 className="font-medium mb-2 text-healthcare-800">Previous Assessment Results</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Date Taken</p>
                          <p className="font-medium">
                            {new Date((formData as Patient).lastAssessmentDate!).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition Severity</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor((formData as Patient).conditionSeverity)}`}>
                            {(formData as Patient).conditionSeverity}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => setShowAssessment(true)} 
                      className="bg-healthcare-500 hover:bg-healthcare-600 text-white"
                    >
                      Start Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="assistant">
            <NLPAssistant />
          </TabsContent>
          
          <TabsContent value="medications">
            {user.role === 'patient' && (
              <MedicationReminder 
                patient={user as Patient} 
                onUpdate={updatePatientData} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="records">
            {user.role === 'doctor' && (
              <DailyPatientRecordComponent 
                doctor={user as Doctor} 
                onUpdate={updateDoctorData} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="adr">
            {user.role === 'patient' && (
              <>
                {showADRTest ? (
                  <ADRTest 
                    patient={user as Patient} 
                    onComplete={handleADRTestComplete} 
                    onCancel={() => setShowADRTest(false)} 
                  />
                ) : (
                  <Card className="border-healthcare-100 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-healthcare-100 to-white">
                      <CardTitle className="flex items-center gap-2 text-healthcare-800">
                        <AlertTriangle className="h-6 w-6 text-healthcare-500" />
                        <span>Adverse Drug Reaction Test</span>
                      </CardTitle>
                      <CardDescription>
                        Report any unusual reactions to medications you are taking
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        This test helps identify adverse reactions to medications. If you are experiencing any unusual symptoms after taking a medication, please complete this assessment.
                      </p>
                      
                      {(formData as Patient).adrTestResults && (formData as Patient).adrTestResults!.length > 0 && (
                        <div className="p-4 border rounded-md bg-healthcare-50 border-healthcare-100">
                          <h3 className="font-medium mb-2 text-healthcare-800">Previous ADR Test Results</h3>
                          <div className="space-y-3">
                            {(formData as Patient).adrTestResults!.slice(0, 3).map((result) => (
                              <div key={result.id} className="grid gap-2 md:grid-cols-3 border-b pb-2">
                                <div>
                                  <p className="text-sm text-gray-500">Medication</p>
                                  <p className="font-medium">{result.medicationName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Date</p>
                                  <p className="font-medium">
                                    {new Date(result.datePerformed).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Severity</p>
                                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getADRSeverityColor(result.severity)}`}>
                                    {result.severity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center mt-4">
                        <Button 
                          onClick={() => setShowADRTest(true)} 
                          className="bg-healthcare-500 hover:bg-healthcare-600 text-white"
                        >
                          Start ADR Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
