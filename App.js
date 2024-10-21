import notifee from '@notifee/react-native';
import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';

const App = () => {
  useEffect(() => {
    // requestLocationPermission();

    // Cleanup background task on unmount
    return () => {
      console.log('Clean up function triggered ');
    };
  }, []);

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
            message:
              'This app needs access to your location in the background.',
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
        console.log('Error fetching location:', error);
        if (error?.message === 'No location provider available.') {
          // Optionally, show a notification or prompt the user to enable GPS
          displayNotification();
          stopBackgroundTask();
        }
      },
      {enableHighAccuracy: true, distanceFilter: 0}, // High accuracy, interval of 5 seconds
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

  notifee.onForegroundEvent(({type, detail}) => {
    const {pressAction} = detail; // Get the pressed action
    if (pressAction) {
      console.log('Pressed Action ID:', pressAction.id);
      if (pressAction.id === 'action1') {
        console.log('Action 1 was pressed!'); // Handle Action 1
        notifee.cancelNotification('gps-location-disabled');
      } else if (pressAction.id === 'action2') {
        console.log('Action 2 was pressed!'); // Handle Action 2
        openLocationSettings();
        // After opening the settings, check if the location can be fetched again
      }
    }
  });

  async function displayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'custom-sound',
      name: 'Channel with Custom Sound',
      sound: 'hollow', // Specify the sound name without the file extension
    });

    // Display a notification
    await notifee.displayNotification({
      id: 'gps-location-disabled',
      title: 'GPS Location Disabled',
      body: 'Location services are currently turned off. Please enable them to continue using.',
      android: {
        channelId,
        sound: 'hollow',
        actions: [
          {
            title: '<p style="color: #803D3B;"><b>Close</b></p>',
            pressAction: {
              id: 'action1',
            },
          },
          {
            title: '<p style="color: #626F47;"><b>Enable</b></p>',
            pressAction: {
              id: 'action2',
            },
          },
        ],
      },
    });
  }

  const openLocationSettings = () => {
    // Opens the location settings
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Start Background Task"
        onPress={requestLocationPermission}
      />
      <View style={{height: 10}} />
      <Button title="Stop Background Task" onPress={stopBackgroundTask} />
      <View style={{height: 10}} />
      <Button title="Display Notification" onPress={displayNotification} />
    </View>
  );
};

export default App;
