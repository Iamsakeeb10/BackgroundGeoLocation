import {PermissionsAndroid} from 'react-native';

export const foregroundLocationPermission = async () => {
  try {
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

    return fineLocationGranted;
  } catch (err) {
    console.warn(err);
  }
};

export const backgroundLocationPermission = async () => {
  try {
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

    return backgroundLocationGranted;
  } catch (err) {
    console.warn(err);
  }
};
