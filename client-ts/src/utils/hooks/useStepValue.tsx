import { useState } from 'react';

export interface UseStepValueResult {
  step: number;
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  handleJump: (targetStep: number) => void;
}
export default function useStepValue(defaultStep = 0): UseStepValueResult {
  const [step, setStep] = useState(defaultStep);
  function handleNext(): void {
    setStep(step + 1);
  }
  function handleBack(): void {
    setStep(step - 1);
  }
  function handleReset(): void {
    setStep(0);
  }
  function handleJump(targetStep: number): void {
    setStep(targetStep);
  }

  return {
    step, handleNext, handleBack, handleReset, handleJump
  };
}
