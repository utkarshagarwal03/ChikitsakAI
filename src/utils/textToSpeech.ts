
class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    
    // Load voices
    this.loadVoices();
    
    // Some browsers (like Chrome) load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    
    // Try to find an Indian English voice
    const indianVoice = this.voices.find(voice => 
      voice.lang === 'en-IN' || 
      voice.name.includes('Indian')
    );
    
    // Or any English voice as fallback
    const englishVoice = this.voices.find(voice => 
      voice.lang.startsWith('en-')
    );
    
    this.selectedVoice = indianVoice || englishVoice || (this.voices.length > 0 ? this.voices[0] : null);
  }

  public speak(text: string, rate: number = 1, voice: SpeechSynthesisVoice | null = null): void {
    if (!text) return;
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    } else if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.synth.speak(utterance);
  }

  public stop(): void {
    this.synth.cancel();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }
}

// Create a singleton instance
const ttsService = new TextToSpeechService();

export default ttsService;
