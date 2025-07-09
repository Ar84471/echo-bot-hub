
import { useState, useEffect } from 'react';
import { useMobileFeatures } from './useMobileFeatures';

export interface CrossPlatformFeatures {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isNative: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
  touchSupported: boolean;
  optimizeForPlatform: (mobileConfig: any, tabletConfig: any, desktopConfig: any) => any;
}

export const useCrossPlatform = (): CrossPlatformFeatures => {
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const { isNative } = useMobileFeatures();

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update screen size
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
      
      // Update orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  const isMobile = screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl';
  const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const optimizeForPlatform = (mobileConfig: any, tabletConfig: any, desktopConfig: any) => {
    if (isMobile) return mobileConfig;
    if (isTablet) return tabletConfig;
    return desktopConfig;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isNative,
    screenSize,
    orientation,
    touchSupported,
    optimizeForPlatform
  };
};
