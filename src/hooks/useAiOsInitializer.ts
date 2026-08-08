import { useEffect, useState, useRef } from 'react';

export type SystemOsState = 'offline' | 'initializing' | 'ready';

interface UseAiOsInitializerOptions {
  isCompanyAuthenticated: boolean;
  onBootStart?: () => void;
  onBootComplete?: () => void;
}

export function useAiOsInitializer({
  isCompanyAuthenticated,
  onBootStart,
  onBootComplete
}: UseAiOsInitializerOptions) {
  const [systemState, setSystemState] = useState<SystemOsState>(
    isCompanyAuthenticated ? 'initializing' : 'offline'
  );
  
  const prevAuthRef = useRef<boolean>(isCompanyAuthenticated);

  // Effect listening for isCompanyAuthenticated state changes
  useEffect(() => {
    const prevAuth = prevAuthRef.current;
    prevAuthRef.current = isCompanyAuthenticated;

    if (!prevAuth && isCompanyAuthenticated) {
      // User just authenticated/entered PIN!
      setSystemState('initializing');
      if (onBootStart) onBootStart();

      const timer = setTimeout(() => {
        setSystemState('ready');
        if (onBootComplete) onBootComplete();
      }, 2000);

      return () => clearTimeout(timer);
    } else if (!isCompanyAuthenticated) {
      setSystemState('offline');
    } else if (isCompanyAuthenticated && systemState === 'initializing') {
      const timer = setTimeout(() => {
        setSystemState('ready');
        if (onBootComplete) onBootComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCompanyAuthenticated]);

  const rebootOs = () => {
    if (!isCompanyAuthenticated) return;
    setSystemState('initializing');
    if (onBootStart) onBootStart();
    setTimeout(() => {
      setSystemState('ready');
      if (onBootComplete) onBootComplete();
    }, 2000);
  };

  return {
    systemState,
    setSystemState,
    rebootOs,
    isInitializing: systemState === 'initializing',
    isReady: systemState === 'ready',
    isOffline: systemState === 'offline'
  };
}
