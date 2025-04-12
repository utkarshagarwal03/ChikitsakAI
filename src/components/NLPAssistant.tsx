
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User, Bot } from 'lucide-react';

const mockResponses: Record<string, string> = {
  "hello": "Hello! How can I assist you with your health today?",
  "hi": "Hi there! How can I help you with your healthcare needs?",
  "how are you": "I'm functioning well, thank you! More importantly, how are you feeling today?",
  "headache": "I'm sorry to hear you're experiencing a headache. Headaches can be caused by various factors like stress, dehydration, lack of sleep, or eye strain. If it's persistent or severe, please consult with your doctor.",
  "stress": "Stress is a common issue that can affect both mental and physical health. Some useful techniques to manage stress include deep breathing exercises, meditation, regular physical activity, and ensuring adequate sleep.",
  "depression": "Depression is a serious but treatable mental health condition. It's important to reach out to a healthcare professional if you're experiencing persistent feelings of sadness, hopelessness, or loss of interest in activities.",
  "anxiety": "Anxiety can manifest in various ways, including excessive worry, restlessness, and physical symptoms. Techniques like mindfulness, regular exercise, and cognitive-behavioral strategies can help manage anxiety symptoms.",
  "medication": "I can't provide specific medication advice as that requires professional medical assessment. Please consult with your doctor about any medication-related questions.",
  "sleep": "Quality sleep is essential for overall health. Try to maintain a regular sleep schedule, create a relaxing bedtime routine, limit screen time before bed, and ensure your sleep environment is comfortable and quiet.",
  "diet": "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats supports overall health. Consider consulting with a nutritionist for personalized dietary advice.",
  "exercise": "Regular physical activity offers numerous health benefits, including stress reduction, improved mood, and better sleep. Aim for at least 150 minutes of moderate exercise per week.",
};

const getNLPResponse = (input: string): string => {
  input = input.toLowerCase().trim();
  
  // Check for exact matches first
  if (mockResponses[input]) {
    return mockResponses[input];
  }
  
  // Check for partial matches
  for (const key in mockResponses) {
    if (input.includes(key)) {
      return mockResponses[key];
    }
  }
  
  // Default response
  return "I'm not sure I understand. Could you please rephrase or ask another health-related question?";
};

interface Message {
  text: string;
  isUser: boolean;
}

const NLPAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your ChikitsakAI assistant. How can I help with your health questions today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response
    const response = getNLPResponse(input);
    
    // Add AI response with a slight delay to simulate processing
    setTimeout(() => {
      const aiMessage: Message = { text: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-healthcare-500" />
          <span>ChikitsakAI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-[380px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`rounded-full p-2 ${message.isUser ? 'bg-healthcare-100 text-healthcare-700' : 'bg-gray-100 text-gray-700'}`}>
                    {message.isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-lg ${message.isUser ? 'bg-healthcare-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your health question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button onClick={handleSend} size="icon" className="bg-healthcare-500 hover:bg-healthcare-600">
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NLPAssistant;
