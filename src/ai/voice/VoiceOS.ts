import { VoiceOSState } from '../types';

export class VoiceOS {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private static onErrorCallback: ((error: string) => void) | null = null;

  /**
   * Checks if browser speech recognition is supported.
   */
  public static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window))
    );
  }

  /**
   * Starts listening to user voice input.
   */
  public static startListening(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser. You can type commands.');
      return false;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Optimized for Indian English / MSME context

      this.onTranscriptCallback = onTranscript;
      this.onErrorCallback = onError || null;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final.trim().length > 0) {
          if (this.onTranscriptCallback) this.onTranscriptCallback(final.trim(), true);
        } else if (interim.trim().length > 0) {
          if (this.onTranscriptCallback) this.onTranscriptCallback(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (this.onErrorCallback) this.onErrorCallback(`Voice error: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      if (onError) onError(`Failed to start speech recognition: ${e.message}`);
      return false;
    }
  }

  /**
   * Stops listening to voice input.
   */
  public static stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition', e);
      }
    }
    this.isListening = false;
  }

  /**
   * Speaks text using Text-to-Speech (TTS).
   */
  public static speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      // Clean markdown tags for natural speech output
      const cleanText = text
        .replace(/#+/g, '')
        .replace(/\*+/g, '')
        .replace(/`+/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
      if (onEnd) onEnd();
    }
  }

  /**
   * Cancels any active speech output.
   */
  public static stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
