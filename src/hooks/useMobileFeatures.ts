
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export interface MobileFeatures {
  isNative: boolean;
  isOffline: boolean;
  pushNotificationsEnabled: boolean;
  hapticFeedback: (style?: ImpactStyle) => Promise<void>;
  saveOfflineData: (key: string, data: any) => Promise<void>;
  getOfflineData: (key: string) => Promise<any>;
  requestPushNotifications: () => Promise<boolean>;
  sendLocalNotification: (title: string, body: string) => Promise<void>;
  setStatusBarStyle: (style: Style) => Promise<void>;
  hideSplashScreen: () => Promise<void>;
}

export const useMobileFeatures = (): MobileFeatures => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize mobile features if on native platform
    if (isNative) {
      initializeMobileFeatures();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isNative]);

  const initializeMobileFeatures = async () => {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Hide splash screen
      await SplashScreen.hide();

      // Check push notification permissions
      const permStatus = await PushNotifications.checkPermissions();
      setPushNotificationsEnabled(permStatus.receive === 'granted');

      // Register for push notifications if not already done
      if (permStatus.receive !== 'granted') {
        const result = await PushNotifications.requestPermissions();
        setPushNotificationsEnabled(result.receive === 'granted');
      }

      if (pushNotificationsEnabled) {
        await PushNotifications.register();
      }

      // Listen for push notifications
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

    } catch (error) {
      console.error('Error initializing mobile features:', error);
    }
  };

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  };

  const saveOfflineData = async (key: string, data: any) => {
    try {
      await Preferences.set({
        key: `offline_${key}`,
        value: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = async (key: string) => {
    try {
      const result = await Preferences.get({ key: `offline_${key}` });
      return result.value ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  const requestPushNotifications = async (): Promise<boolean> => {
    if (!isNative) return false;
    
    try {
      const result = await PushNotifications.requestPermissions();
      const granted = result.receive === 'granted';
      setPushNotificationsEnabled(granted);
      
      if (granted) {
        await PushNotifications.register();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting push notifications:', error);
      return false;
    }
  };

  const sendLocalNotification = async (title: string, body: string) => {
    if (!isNative) return;
    
    try {
      await LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 1000) }
        }]
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (isNative) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.error('Error setting status bar style:', error);
      }
    }
  };

  const hideSplashScreen = async () => {
    if (isNative) {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    }
  };

  return {
    isNative,
    isOffline,
    pushNotificationsEnabled,
    hapticFeedback,
    saveOfflineData,
    getOfflineData,
    requestPushNotifications,
    sendLocalNotification,
    setStatusBarStyle,
    hideSplashScreen
  };
};
