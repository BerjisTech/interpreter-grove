
// Sound utility functions for notifications

// Sound when a new call comes in
export const playCallNotification = () => {
  try {
    console.log("Playing call notification sound");
    // Create a new audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Use a more reliable way to play sounds
    const audio = new Audio('/notification.mp3');
    audio.volume = 1.0; // Maximum volume
    
    // Try multiple methods to ensure audio plays
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Notification sound started playing successfully");
        })
        .catch(err => {
          console.error('Error playing notification sound:', err);
          
          // Fallback to AudioContext API
          fetch('/notification.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContext.destination);
              source.start(0);
              console.log("Played notification using AudioContext API");
            })
            .catch(err => {
              console.error("Fallback audio method also failed:", err);
            });
        });
    }
  } catch (error) {
    console.error('Error creating Audio object:', error);
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
