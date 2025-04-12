
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ADRSeverity, ADRTestResult, Patient } from '@/types';
import TextToSpeechButton from './TextToSpeechButton';

interface ADRTestProps {
  patient: Patient;
  onComplete: (result: ADRTestResult) => void;
  onCancel: () => void;
}

const commonMedications = [
  'Paracetamol',
  'Ibuprofen',
  'Aspirin',
  'Amoxicillin',
  'Azithromycin',
  'Ceftriaxone',
  'Metformin',
  'Atenolol',
  'Amlodipine',
  'Losartan',
  'Atorvastatin',
  'Methotrexate',
  'Prednisone',
  'Montelukast',
  'Cetirizine',
  'Pantoprazole',
  'Ondansetron'
];

const symptomQuestions = [
  {
    id: 'skin',
    question: 'Are you experiencing any skin reactions?',
    options: [
      { value: '0', label: 'No skin reactions' },
      { value: '1', label: 'Mild rash or itching' },
      { value: '2', label: 'Widespread rash' },
      { value: '3', label: 'Severe rash with blisters' }
    ]
  },
  {
    id: 'respiratory',
    question: 'Do you have any breathing difficulties?',
    options: [
      { value: '0', label: 'No breathing problems' },
      { value: '1', label: 'Mild breathing discomfort' },
      { value: '2', label: 'Noticeable shortness of breath' },
      { value: '3', label: 'Severe difficulty breathing' }
    ]
  },
  {
    id: 'digestive',
    question: 'Are you experiencing any stomach or digestive issues?',
    options: [
      { value: '0', label: 'No digestive issues' },
      { value: '1', label: 'Mild nausea or stomach discomfort' },
      { value: '2', label: 'Vomiting or diarrhea' },
      { value: '3', label: 'Severe abdominal pain or persistent vomiting' }
    ]
  },
  {
    id: 'neurological',
    question: 'Are you experiencing any neurological symptoms?',
    options: [
      { value: '0', label: 'No neurological symptoms' },
      { value: '1', label: 'Mild headache or dizziness' },
      { value: '2', label: 'Significant headache or confusion' },
      { value: '3', label: 'Seizures or loss of consciousness' }
    ]
  }
];

const ADRTest = ({ patient, onComplete, onCancel }: ADRTestProps) => {
  const [medicationName, setMedicationName] = useState('');
  const [customMedication, setCustomMedication] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reactionDescription, setReactionDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const determineSeverity = (scores: string[]): ADRSeverity => {
    const numericScores = scores.map(score => parseInt(score));
    const maxScore = Math.max(...numericScores);
    
    if (maxScore === 0) return 'None';
    if (maxScore === 1) return 'Mild';
    if (maxScore === 2) return 'Moderate';
    return 'Severe';
  };

  const getRecommendation = (severity: ADRSeverity): string => {
    switch (severity) {
      case 'None':
        return 'No action needed. Continue medication as prescribed.';
      case 'Mild':
        return 'Monitor symptoms. Contact your doctor if symptoms worsen.';
      case 'Moderate':
        return 'Consider discontinuing medication and consult with your doctor promptly.';
      case 'Severe':
      case 'Life-threatening':
        return 'Discontinue medication immediately and seek emergency medical attention.';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    // Validate medication selection
    const selectedMedication = medicationName === 'other' ? customMedication : medicationName;
    
    if (!selectedMedication) {
      toast({
        title: "Medication required",
        description: "Please select or enter a medication",
        variant: "destructive",
      });
      return;
    }

    // Validate that all questions are answered
    if (Object.keys(answers).length < symptomQuestions.length) {
      toast({
        title: "Incomplete assessment",
        description: "Please answer all questions",
        variant: "destructive",
      });
      return;
    }

    // Calculate severity
    const scores = Object.values(answers);
    const severity = determineSeverity(scores);
    const recommendations = getRecommendation(severity);

    // Create test result
    const result: ADRTestResult = {
      id: uuidv4(),
      medicationName: selectedMedication,
      datePerformed: new Date().toISOString(),
      reactionDescription,
      severity,
      recommendations
    };

    setSubmitted(true);
    setTimeout(() => {
      onComplete(result);
    }, 2000);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Test Submitted</CardTitle>
          <CardDescription>
            Your Adverse Drug Reaction test has been recorded
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Thank you for completing the ADR test. This information will help your healthcare provider assess your medication safety.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-healthcare-100 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-healthcare-500" />
            <CardTitle>Adverse Drug Reaction Test</CardTitle>
          </div>
          <TextToSpeechButton 
            text="This test will help identify if you are experiencing any adverse reactions to your medications. Please answer all questions honestly." 
          />
        </div>
        <CardDescription>
          Report any unusual reactions to medications you are taking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="medication">Select Medication</Label>
          <Select value={medicationName} onValueChange={setMedicationName}>
            <SelectTrigger id="medication">
              <SelectValue placeholder="Select a medication" />
            </SelectTrigger>
            <SelectContent>
              {commonMedications.map(med => (
                <SelectItem key={med} value={med}>{med}</SelectItem>
              ))}
              <SelectItem value="other">Other medication (specify)</SelectItem>
            </SelectContent>
          </Select>
          
          {medicationName === 'other' && (
            <Input
              placeholder="Enter medication name"
              value={customMedication}
              onChange={(e) => setCustomMedication(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Symptom Assessment</h3>
          
          {symptomQuestions.map((question) => (
            <div key={question.id} className="space-y-3 pt-2 border-t border-gray-200">
              <h4 className="font-medium">{question.question}</h4>
              <RadioGroup value={answers[question.id]} onValueChange={(value) => handleAnswer(question.id, value)}>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label 
                        htmlFor={`${question.id}-${option.value}`} 
                        className="flex-grow cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Additional Notes (Optional)</Label>
          <Textarea 
            id="description" 
            placeholder="Describe any other symptoms or reactions you're experiencing"
            value={reactionDescription}
            onChange={(e) => setReactionDescription(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit Report</Button>
      </CardFooter>
    </Card>
  );
};

export default ADRTest;
