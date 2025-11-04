import { useState, useEffect } from 'react';
import { GPACalculator } from '@shared/utils/gpaCalculator';
import { STORAGE_KEYS } from '@shared/constants/messages';

export function useGPACalculator(semesters) {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [gpaResult, setGpaResult] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    loadSavedCalculations();
    loadStudentInfo();
  }, []);

  const loadStudentInfo = async () => {
    const result = await chrome.storage.local.get(STORAGE_KEYS.STUDENT_DATA);
    if (result[STORAGE_KEYS.STUDENT_DATA]) {
      setStudentInfo(result[STORAGE_KEYS.STUDENT_DATA]);
    }
  };

  const loadSavedCalculations = async () => {
    const result = await chrome.storage.local.get(STORAGE_KEYS.SAVED_CALCULATIONS);
    if (result[STORAGE_KEYS.SAVED_CALCULATIONS]) {
      setSavedCalculations(result[STORAGE_KEYS.SAVED_CALCULATIONS]);
    }
  };

  const calculateGPA = (courses, fromPage = false) => {
    if (!courses || courses.length === 0) return null;
    
    const mockSemester = { courses: courses };
    const result = GPACalculator.calculateSemesterGPA(mockSemester);
    setGpaResult(result);
    
    if (!fromPage) {
      setSelectedCourses(courses);
    }
    
    return result;
  };

  const saveCalculation = async (result) => {
    const calculation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      courses: selectedCourses,
      result,
      student: studentInfo,
    };

    const updated = [calculation, ...savedCalculations].slice(0, 20);
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
    selectedCourses,
    setSelectedCourses,
    gpaResult,
    calculateGPA,
    saveCalculation,
    savedCalculations,
    deleteCalculation,
  };
}