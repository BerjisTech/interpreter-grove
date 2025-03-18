
// Sound utility functions for notifications

// Sound when a new call comes in
export const playCallNotification = () => {
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

// Sound for other notifications
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => {
      console.error('Error playing notification sound:', err);
    });
  } catch (error) {
    console.error('Error creating Audio object:', error);
  }
};
