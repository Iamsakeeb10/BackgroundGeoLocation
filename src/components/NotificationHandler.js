import PushNotification from 'react-native-push-notification';

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'example-channel-id', // (required) Unique channel ID
      channelName: 'Example Channel', // (required) Name of the channel
      channelDescription: 'A channel to categorize your notifications', // (optional) Description of the channel
      playSound: true, // Enable sound for notifications in this channel
      soundName: 'default', // Default sound for notifications
      importance: 4, // High importance
      vibrate: true, // Enable vibration
    },
    created => console.log(`Channel created: ${created}`), // Log whether the channel was created or already existed
  );
};

// Function to trigger a local notification
export const showNotification = () => {
  PushNotification.localNotification({
    channelId: 'example-channel-id', // Channel ID created in createChannel()
    title: 'Local Notification', // Notification title
    message: 'This is a local notification triggered by button click!', // Notification message
    playSound: true, // Play notification sound
    soundName: 'default', // Use default notification sound
    importance: 'high', // Set priority to high
    vibrate: true, // Enable vibration
    vibration: 300, // Vibration duration in milliseconds
  });
};
