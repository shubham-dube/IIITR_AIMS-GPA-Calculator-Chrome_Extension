import React from 'react';
import { format } from 'date-fns';
import { GRADE_DESCRIPTIONS, GRADE_POINTS } from '@shared/constants/gradeSystem';

export default function OfficialTemplate({ data }) {
  const { student, semesters, result, generatedAt } = data;

  const getGradeColor = (grade) => {
    const point = GRADE_POINTS[grade];
    if (!point && point !== 0) return '';
    if (point >= 9) return 'text-green-700';
    if (point >= 8) return 'text-blue-700';
    if (point >= 7) return 'text-yellow-700';
    return 'text-orange-700';
  };

  // Group courses by semester
  const coursesBySemester = {};
  (result?.courses || []).forEach(course => {
    const semId = course.semesterId || 'unknown';
    if (!coursesBySemester[semId]) {
      coursesBySemester[semId] = [];
    }
    coursesBySemester[semId].push(course);
  });

  return (
    <div className="transcript-page p-12 relative bg-white">
      {/* Watermark */}
      <div className="watermark">IIIT RAICHUR</div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="official-seal">
            <span className="text-sm">IIIT<br/>RAICHUR</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Indian Institute of Information Technology, Raichur
            </h1>
            <p className="text-sm text-gray-600">Karnataka, India</p>
          </div>
        </div>
        <div className="h-1 w-32 bg-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Academic Transcript</h2>
      </div>

      {/* Student Information */}
      <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Student Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-900">{student?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Roll Number</p>
            <p className="font-semibold text-gray-900">{student?.rollNo || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Program</p>
            <p className="font-semibold text-gray-900">{student?.branch || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Academic Performance Summary */}
      <div className="mb-6 bg-primary-50 p-6 rounded-lg border-2 border-primary-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Academic Performance Summary
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">CGPA</p>
            <p className="text-3xl font-bold text-primary-700">{result?.gpa?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Credits Earned</p>
            <p className="text-2xl font-bold text-gray-900">{result?.earnedCredits || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Credits</p>
            <p className="text-2xl font-bold text-gray-900">{result?.totalCredits || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Courses</p>
            <p className="text-2xl font-bold text-gray-900">{result?.courseCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Details</h3>
        
        <table className="grade-table text-sm">
          <thead>
            <tr>
              <th className="w-24">Course Code</th>
              <th>Course Title</th>
              <th className="w-20 text-center">Credits</th>
              <th className="w-24">Reg. Type</th>
              <th className="w-20 text-center">Grade</th>
              <th className="w-24 text-center">Grade Points</th>
            </tr>
          </thead>
          <tbody>
            {(result?.courses || []).map((course, idx) => (
              <tr key={idx}>
                <td className="font-mono text-xs">{course.code}</td>
                <td>{course.title}</td>
                <td className="text-center">{course.credits?.toFixed(1)}</td>
                <td className="text-xs">{course.regType || 'Regular'}</td>
                <td className={`text-center font-bold ${getGradeColor(course.grade)}`}>
                  {course.grade || '-'}
                </td>
                <td className="text-center">
                  {course.grade && GRADE_POINTS[course.grade] !== null 
                    ? GRADE_POINTS[course.grade].toFixed(1) 
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grading System */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Grading System</h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {Object.entries(GRADE_POINTS).filter(([_, pts]) => pts !== null).map(([grade, points]) => (
            <div key={grade} className="flex items-center gap-2">
              <span className={`font-bold ${getGradeColor(grade)}`}>{grade}</span>
              <span className="text-gray-600">= {points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t-2 border-gray-300">
        <div className="flex justify-between items-end text-xs text-gray-600">
          <div>
            <p>Generated: {format(new Date(generatedAt || Date.now()), 'MMMM dd, yyyy HH:mm')}</p>
            <p className="mt-1">Generated by GPA Genie v3.0</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800 mb-8">Authorized Signature</p>
            <div className="border-t border-gray-400 w-48"></div>
            <p className="mt-1">Controller of Examinations</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-700">
        <strong>Note:</strong> This is an unofficial transcript generated by GPA Genie extension. 
        For official transcripts, please contact your institution's examination office.
      </div>
    </div>
  );
}