import React, { useState } from 'react';
import { format } from 'date-fns';
import { GRADE_DESCRIPTIONS, GRADE_POINTS } from '@shared/constants/gradeSystem';
import { GPACalculator } from '@shared/utils/gpaCalculator';

export default function OfficialTemplate({ data }) {
  const { student, result, generatedAt } = data;
  const getGradeColor = (grade) => {
    const point = GRADE_POINTS[grade];
    if (!point && point !== 0) return 'text-gray-600';
    if (point >= 9) return 'text-green-600';
    if (point >= 8) return 'text-blue-600';
    if (point >= 7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Group courses by semester
  const groupedBySemester = {};
  (result?.courses || []).forEach(course => {
    // Extract semester from course data or use a default grouping
    const semesterId = course.semesterId || 'Unknown';
    if (!groupedBySemester[semesterId]) {
      groupedBySemester[semesterId] = {
        id: semesterId,
        name: course.semesterName || semesterId,
        courses: []
      };
    }
    groupedBySemester[semesterId].courses.push(course);
  });

  const semesters = Object.values(groupedBySemester);
  semesters.reverse();

  // Calculate cumulative data
  let cumulativeCourses = [];
  const semestersWithGPA = semesters.map((semester, index) => {
    const sgpaResult = GPACalculator.calculateSemesterGPA({ courses: semester.courses });
    
    cumulativeCourses = [...cumulativeCourses, ...semester.courses];
    const cgpaResult = GPACalculator.calculateSemesterGPA({ courses: cumulativeCourses });
    
    return {
      ...semester,
      sgpa: sgpaResult.gpa,
      sgpaCredits: sgpaResult.totalCredits,
      cgpa: cgpaResult.gpa,
      cgpaCredits: cgpaResult.totalCredits,
      earnedCredits: cgpaResult.earnedCredits
    };
  });

  semestersWithGPA.reverse();

  const isBacklogSemester = (semester) => {
    return semester.courses.every(c => c.regType === 'Backlog');
  };

  const getSemesterNumber = (index) => {
    const nonBacklogSems = semestersWithGPA.filter(s => !isBacklogSemester(s));
    const semIndex = nonBacklogSems.findIndex(s => s.id === semestersWithGPA[index].id);
    return semIndex !== -1 ? semIndex + 1 : null;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm" style={{ maxWidth: '210mm', margin: '0 auto' }}>
      {/* Compact Header */}
      <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-blue-600">
        <div className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          <img src={chrome.runtime.getURL('icons/iiitr.png')} alt="IIIT Raichur" className="w-16 h-16" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            Indian Institute of Information Technology (IIIT), Raichur
          </h1>
          <p className="text-xs text-gray-600 mt-1">Karnataka - 584135, India</p>
          <h2 className="text-base font-semibold text-blue-700 mt-2">Academic Transcript</h2>
        </div>
      </div>

      {/* Compact Student Info */}
      <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded text-sm">
        <div>
          <span className="text-gray-600 text-xs">Name:</span>
          <p className="font-semibold text-gray-900">{student?.name || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-600 text-xs">Roll Number:</span>
          <p className="font-semibold text-gray-900">{student?.rollNo || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-600 text-xs">Program:</span>
          <p className="font-semibold text-gray-900">{student?.branch || 'N/A'}</p>
        </div>
      </div>

      {/* Overall Performance Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4 bg-blue-50 p-3 rounded border border-blue-200">
        <div className="text-center">
          <p className="text-xs text-gray-600">Overall CGPA</p>
          <p className="text-2xl font-bold text-blue-700">{result?.gpa?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Credits Earned</p>
          <p className="text-xl font-bold text-green-700">{result?.earnedCredits || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Total Credits</p>
          <p className="text-xl font-bold text-gray-900">{result?.totalCredits || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Total Courses</p>
          <p className="text-xl font-bold text-gray-900">{result?.courseCount || 0}</p>
        </div>
      </div>

      {/* Semester-wise Course Details */}
      <div className="mb-4">
         <h3 className="text-sm font-semibold text-gray-800 mb-3">Semester-wise Course Details</h3>
        
        {semestersWithGPA.map((semester, semesterIndex) => {
          const isBacklog = isBacklogSemester(semester);
          const semNumber = getSemesterNumber(semesterIndex);
          
          return (
            <div key={semester.id} className="mb-4">
              {/* Semester Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-t flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">
                    {semester.name}
                  </span>
                  {isBacklog ? (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-semibold">
                      Holidays
                    </span>
                  ) : semNumber && semester.id != "Unknown" && (
                    <span className="bg-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold">
                      Semester {(semestersWithGPA.length) - semNumber+1}
                    </span>
                  )}
                </div>
                <span className="text-xs opacity-90">
                  {semester.courses.length} course{semester.courses.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Course Table */}
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left">Code</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Course Title</th>
                    <th className="border border-gray-300 px-2 py-1 text-center w-20">Reg. Type</th>
                    <th className="border border-gray-300 px-2 py-1 text-center w-16">Credits</th>
                    <th className="border border-gray-300 px-2 py-1 text-center w-16">Grade</th>
                    <th className="border border-gray-300 px-2 py-1 text-center w-20">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 font-mono text-xs">{course.code}</td>
                      <td className="border border-gray-300 px-2 py-1">{course.title}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-xs">
                        {course.regType || 'Regular'}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{course.credits?.toFixed(1)}</td>
                      <td className={`border border-gray-300 px-2 py-1 text-center font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {course.grade && GRADE_POINTS[course.grade] !== null 
                          ? GRADE_POINTS[course.grade].toFixed(1) 
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Semester Summary (SGPA & CGPA) */}
              <div className="bg-gray-50 border border-gray-300 border-t-0 rounded-b">
                <div className="grid grid-cols-3 gap-3 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{semester.id != "Unknown" ? "Semester" : "Total"} Credits:</span>
                    <span className="font-bold text-gray-900">{semester.sgpaCredits.toFixed(1)}</span>
                  </div>
                  {semester.id == "Unknown" ? (<div></div>) : (
                    <div className="flex items-center justify-between bg-blue-100 px-2 py-1 rounded">
                    <span className="font-semibold text-blue-800">SGPA:</span>
                    <span className="font-bold text-blue-900 text-sm">{semester.sgpa.toFixed(2)}</span>
                  </div>
                  )}
                  <div className="flex items-center justify-between bg-purple-100 px-2 py-1 rounded">
                    <span className="font-semibold text-purple-800">CGPA:</span>
                    <span className="font-bold text-purple-900 text-sm">{semester.cgpa.toFixed(2)}</span>
                  </div>
                </div>
                <div className="px-3 pb-2 text-xs text-gray-600">
                  Cumulative Credits: <span className="font-semibold">{semester.cgpaCredits.toFixed(1)}</span>
                  {' • '}
                  Earned: <span className="font-semibold text-green-700">{semester.earnedCredits.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Grading System */}
      <div className="bg-gray-50 p-3 rounded mb-4 border border-gray-200">
        <h3 className="text-xs font-semibold text-gray-800 mb-2">Grading System (10-Point Scale)</h3>
        <div className="grid grid-cols-5 gap-x-4 gap-y-1 text-xs">
          {Object.entries(GRADE_POINTS).filter(([_, pts]) => pts !== null).map(([grade, points]) => (
            <div key={grade} className="flex items-center justify-between">
              <span className={`font-bold ${getGradeColor(grade)}`}>{grade}</span>
              <span className="text-gray-600">= {points.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Footer */}
      <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-600">
        <div>
          <p>Generated: {new Date(generatedAt || Date.now()).toLocaleDateString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}</p>
          <p className="text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>Unofficial Transcript</span>
          </p>
          <p className="text-gray-500 mt-1 text-[10px]">
            For official transcripts, contact the Academic Office
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-[10px]">GPA Genie v3.0</p>
        </div>
      </div>
    </div>
  );
}