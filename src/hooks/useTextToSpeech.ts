
// This hook has been disabled - TTS functionality removed
export const useTextToSpeech = () => {
  return {
    speak: () => {},
    stop: () => {},
    pause: () => {},
    resume: () => {},
    isSpeaking: false,
    isPaused: false,
    voices: [],
    selectedVoice: null,
    setSelectedVoice: () => {},
    rate: 1,
    setRate: () => {},
    pitch: 1,
    setPitch: () => {}
  };
};
