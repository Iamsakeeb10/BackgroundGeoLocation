import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {Button, PermissionsAndroid, Platform, View} from 'react-native';
import BackgroundService from 'react-native-background-actions';

const backgroundTask = async taskData => {
  // Task to execute in the background
  const {delay} = taskData;

  while (BackgroundService.isRunning()) {
    // Fetch location continuously
    watchLocation();
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const backgroundLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'This app needs access to your location in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (
        fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
        backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Location permissions granted');
        startBackgroundTask();
      } else {
        console.log('Location permission denied');
      }
    } else {
      // For iOS, permissions are requested differently
      startBackgroundTask();
    }
  } catch (err) {
    console.warn(err);
  }
};

const watchLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      const {latitude, longitude} = position.coords;
      console.log(
        `Fetching latitude in every 10 seconds: ${latitude}, Fetching longitude in every 10 seconds Longitude: ${longitude}`,
      );
    },
    error => {
      console.error('Error fetching location:', error);
    },
    {enableHighAccuracy: true, distanceFilter: 0, interval: 5000}, // High accuracy, interval of 5 seconds
  );
};

const startBackgroundTask = async () => {
  console.log('Starting background task...');
  const options = {
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
      delay: 10000, // Fetch location every 5 seconds
    },
  };

  await BackgroundService.start(backgroundTask, options);
};

const stopBackgroundTask = async () => {
  console.log('Stopping background task...');
  await BackgroundService.stop();
};

const App = () => {
  useEffect(() => {
    // requestLocationPermission();

    // Cleanup background task on unmount
    return () => {
      console.log('Clean up function triggered ');
    };
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Start Background Task"
        onPress={requestLocationPermission}
      />
      <View style={{height: 10}} />
      <Button title="Stop Background Task" onPress={stopBackgroundTask} />
    </View>
  );
};

export default App;
