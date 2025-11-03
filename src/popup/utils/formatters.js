import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

export const formatGPA = (gpa, decimals = 2) => {
  if (typeof gpa !== 'number' || isNaN(gpa)) return '0.00';
  return gpa.toFixed(decimals);
};

export const formatCredits = (credits, decimals = 1) => {
  if (typeof credits !== 'number' || isNaN(credits)) return '0.0';
  return credits.toFixed(decimals);
};

export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const formatSemesterName = (semesterName) => {
  // Convert "JUL24-NOV24" to "Semester 3 (Jul-Nov 2024)"
  if (!semesterName) return '';
  
  const match = semesterName.match(/([A-Z]+)(\d{2})-([A-Z]+)(\d{2})/);
  if (match) {
    const [, month1, year1, month2, year2] = match;
    return `${month1.charAt(0) + month1.slice(1).toLowerCase()}-${month2.charAt(0) + month2.slice(1).toLowerCase()} 20${year1}`;
  }
  
  return semesterName;
};

export const getGradeEmoji = (gpa) => {
  if (gpa >= 9.5) return '🏆';
  if (gpa >= 9) return '🌟';
  if (gpa >= 8) return '⭐';
  if (gpa >= 7) return '👍';
  if (gpa >= 6) return '✅';
  return '📚';
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
};