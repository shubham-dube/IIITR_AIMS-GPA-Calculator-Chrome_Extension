import { useState, useEffect } from 'react';
import { GPACalculator } from '@shared/utils/gpaCalculator';
import { STORAGE_KEYS } from '@shared/constants/messages';

export function useGPACalculator(semesters) {
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [gpaResult, setGpaResult] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    loadSavedCalculations();
  }, []);

  const loadSavedCalculations = async () => {
    const result = await chrome.storage.local.get(STORAGE_KEYS.SAVED_CALCULATIONS);
    if (result[STORAGE_KEYS.SAVED_CALCULATIONS]) {
      setSavedCalculations(result[STORAGE_KEYS.SAVED_CALCULATIONS]);
    }
  };

  const calculateGPA = (semesterIds) => {
    const selected = semesters.filter(sem => semesterIds.includes(sem.id));
    const result = GPACalculator.calculateCumulativeGPA(selected);
    setGpaResult(result);
    return result;
  };

  const saveCalculation = async (result) => {
    const calculation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      semesters: selectedSemesters,
      result,
    };

    const updated = [calculation, ...savedCalculations].slice(0, 20); // Keep last 20
    setSavedCalculations(updated);
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SAVED_CALCULATIONS]: updated,
    });
  };

  const deleteCalculation = async (id) => {
    const updated = savedCalculations.filter(calc => calc.id !== id);
    setSavedCalculations(updated);
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SAVED_CALCULATIONS]: updated,
    });
  };

  return {
    selectedSemesters,
    setSelectedSemesters,
    gpaResult,
    calculateGPA,
    saveCalculation,
    savedCalculations,
    deleteCalculation,
  };
}