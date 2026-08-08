import { useState, useEffect, useRef } from 'react';
import { useAccounting } from '../context/AccountingContext';

export interface UseAiOsBootReturn {
  isBooting: boolean;
  bootProgress: number;
  bootStepMessage: string;
  triggerBootSequence: () => void;
}

export function useAiOsBoot(): UseAiOsBootReturn {
  const { isCompanyAuthenticated, setActiveTab } = useAccounting();
  const [isBooting, setIsBooting] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [bootStepMessage, setBootStepMessage] = useState<string>('INITIALIZING VEPARI AI OS...');

  const prevAuthRef = useRef<boolean>(isCompanyAuthenticated);

  const steps = [
    'INITIALIZING VEPARI AI OPERATING SYSTEM CORE...',
    'CONNECTING DOUBLE-ENTRY GENERAL LEDGER ENGINE...',
    'LOADING 8 AUTHORITATIVE BUSINESS INTELLIGENCE MODULES...',
    'APPLYING 5-DIGIT ENCRYPTED OWNER GUARDRAILS...',
    'VEPARI AI BUSINESS OS READY'
  ];

  const triggerBootSequence = () => {
    setIsBooting(true);
    setBootProgress(0);
    setBootStepMessage(steps[0]);

    if (setActiveTab) {
      setActiveTab('vepari-ai');
    }

    const duration = 3000; // 3 seconds requirement
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsBooting(false);
        }, 200);
      }
      setBootProgress(Math.min(100, Math.round(currentProgress)));

      const stepIndex = Math.min(
        Math.floor((currentProgress / 100) * steps.length),
        steps.length - 1
      );
      setBootStepMessage(steps[stepIndex]);
    }, intervalTime);
  };

  useEffect(() => {
    const prevAuth = prevAuthRef.current;
    prevAuthRef.current = isCompanyAuthenticated;

    if (!prevAuth && isCompanyAuthenticated) {
      // Transition from unauthenticated -> authenticated
      triggerBootSequence();
    } else if (!isCompanyAuthenticated) {
      setIsBooting(false);
      setBootProgress(0);
    }
  }, [isCompanyAuthenticated]);

  return {
    isBooting,
    bootProgress,
    bootStepMessage,
    triggerBootSequence
  };
}
