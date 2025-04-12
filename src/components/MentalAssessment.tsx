
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BrainCircuit, CheckCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 2,
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 3,
    question: "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 4,
    question: "Over the past 2 weeks, how often have you felt tired or had little energy?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 5,
    question: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  }
];

interface MentalAssessmentProps {
  onComplete: (score: number, severity: string) => void;
}

const MentalAssessment = ({ onComplete }: MentalAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
      
      // Determine severity based on score
      let severity = "Minimal";
      if (totalScore >= 10) severity = "Severe";
      else if (totalScore >= 6) severity = "Moderate";
      else if (totalScore >= 3) severity = "Mild";
      
      onComplete(totalScore, severity);
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (completed) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Assessment Completed</CardTitle>
          <CardDescription>
            Thank you for completing the mental health assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Your results have been recorded and shared with your healthcare provider.</p>
          <p className="mt-2">Your healthcare provider will review your assessment and may reach out to discuss your results.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-6 w-6 text-healthcare-500" />
          <CardTitle>Mental Health Assessment</CardTitle>
        </div>
        <CardDescription>
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
          <RadioGroup value={answers[questions[currentQuestion].id]} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-grow cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentalAssessment;
