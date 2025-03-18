
// Sound utility functions for notifications

// Sound when a new call comes in
export const playCallNotification = () => {
  try {
    console.log("Playing call notification sound");
    
    // Try multiple playback methods for better compatibility
    playWithAudioElement();
    
    // As a fallback, try with the Web Audio API
    setTimeout(() => {
      playWithAudioContext();
    }, 100);
    
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Method 1: Play with Audio element (most compatible)
const playWithAudioElement = () => {
  try {
    // Create a new audio element with forced autoplay
    const audio = new Audio('/notification.mp3');
    audio.volume = 1.0; // Maximum volume
    audio.muted = false;
    
    // Try to play the sound with user interaction simulation
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Notification sound started playing successfully (Audio element)");
          
          // Ensure volume is maxed after playback starts
          setTimeout(() => {
            audio.volume = 1.0;
          }, 100);
        })
        .catch(err => {
          console.error('Error playing notification with Audio element:', err);
          
          // On failure, try again with Web Audio API
          playWithAudioContext();
        });
    }
  } catch (error) {
    console.error('Error with Audio element playback:', error);
  }
};

// Method 2: Play with Web Audio API (better on mobile)
const playWithAudioContext = () => {
  try {
    // Create audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      console.error("AudioContext not supported in this browser");
      return;
    }
    
    const audioContext = new AudioContext();
    
    // Force resume the audioContext (required by some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Fetch the audio file
    fetch('/notification.mp3')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        // Create audio source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0; // Maximum volume
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play the sound
        source.start(0);
        console.log("Notification sound played using AudioContext API");
      })
      .catch(err => {
        console.error("Error playing with AudioContext:", err);
      });
  } catch (error) {
    console.error('Error with AudioContext playback:', error);
  }
};

// Sound for other notifications
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.error('Error playing notification sound:', err);
    });
  } catch (error) {
    console.error('Error creating Audio object:', error);
  }
};
