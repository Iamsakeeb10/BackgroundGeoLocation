export const options = {
  taskName: 'Location Fetcher',
  taskTitle: 'Fetching location in the background',
  taskDesc: 'The app is currently fetching your location.',
  taskIcon: {
    name: 'ic_launcher', // Your app icon
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourapp://chat/jane', // Optional
  parameters: {
    delay: 5000, // Fetch location every 5 seconds
  },
};
