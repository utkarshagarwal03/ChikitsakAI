
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ttsService from '@/utils/textToSpeech';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  speed?: number; // 0.1 to 10, default is 1
  voiceIndex?: number; // Index of the voice to use
}

const TextToSpeechButton = ({ 
  text, 
  className = '',
  speed = 1,
  voiceIndex
}: TextToSpeechButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices if already available
    loadVoices();

    // Set up event listener for when voices are loaded
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      // Select an Indian accent voice if available, otherwise use default
      const voices = availableVoices;
      let selectedVoice = null;
      
      if (voiceIndex !== undefined && voices[voiceIndex]) {
        selectedVoice = voices[voiceIndex];
      } else {
        // Try to find an Indian English voice
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en-IN') || 
          voice.name.includes('Indian')
        );
      }

      ttsService.speak(text, speed, selectedVoice);
      setIsSpeaking(true);
      
      // Listen for when speech has finished
      const checkSpeaking = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setIsSpeaking(false);
          clearInterval(checkSpeaking);
        }
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to use text-to-speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSpeak}
      className={`flex items-center gap-2 ${className}`}
      aria-label={isSpeaking ? "Stop speaking" : "Read text aloud"}
    >
      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{isSpeaking ? "Stop" : "Listen"}</span>
    </Button>
  );
};

export default TextToSpeechButton;
