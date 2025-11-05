import { useState, useEffect } from 'react';
import { MESSAGE_TYPES, STORAGE_KEYS } from '@shared/constants/messages';
import { DataTransformer } from '@shared/utils/dataTransformer';

export function useSemesters() {
  const [semesters, setSemesters] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnAIMS, setIsOnAIMS] = useState(false);

  useEffect(() => {
    // Check if on AIMS portal
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setIsOnAIMS(url.includes('CrsHistory'));
    });

    // Load cached data
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.SEMESTER_DATA,
      STORAGE_KEYS.STUDENT_DATA,
    ]);

    if (result[STORAGE_KEYS.SEMESTER_DATA]) {
      setSemesters(result[STORAGE_KEYS.SEMESTER_DATA]);
    }
    if (result[STORAGE_KEYS.STUDENT_DATA]) {
      setStudentInfo(result[STORAGE_KEYS.STUDENT_DATA]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: MESSAGE_TYPES.FETCH_DATA,
      });

      if (!response || !response.success) {
        throw new Error(response?.error || 'Failed to fetch data');
      }

      const transformed = DataTransformer.transformAIMSData(
        response.courseData,
        response.studentInfo
      );

      setSemesters(transformed.semesters);
      setStudentInfo(transformed.student);

      // Cache the data
      await chrome.storage.local.set({
        [STORAGE_KEYS.SEMESTER_DATA]: transformed.semesters,
        [STORAGE_KEYS.STUDENT_DATA]: transformed.student,
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    semesters,
    studentInfo,
    loading,
    error,
    isOnAIMS,
    fetchData,
  };
}