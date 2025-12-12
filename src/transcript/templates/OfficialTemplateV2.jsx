import React, { useState } from 'react';
import {  GRADE_POINTS } from '@shared/constants/gradeSystem';

const USED_GRADE_POINTS = GRADE_POINTS;

// Simple GPA Calculator fallback
const calculateGPA = (courses) => {
  let totalPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;

  courses.forEach(course => {
    const points = USED_GRADE_POINTS[course.grade];
    if (points !== null && points !== undefined && course.credits) {
      totalPoints += points * course.credits;
      totalCredits += course.credits;
      if (points > 0) earnedCredits += course.credits;
    }
  });

  return {
    gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
    earnedCredits
  };
};

export default function OfficialTemplateV2({ data }) {
  const { student, result, generatedAt } = data;

  // Group courses by semester
  const groupedBySemester = {};
  (result?.courses || []).forEach(course => {
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
  const semestersWithGPA = semesters.map((semester) => {
    const sgpaResult = calculateGPA(semester.courses);
    cumulativeCourses = [...cumulativeCourses, ...semester.courses];
    const cgpaResult = calculateGPA(cumulativeCourses);
    
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

  return (
    <div className="bg-white p-6" style={{ maxWidth: '210mm', margin: '0 auto', fontFamily: 'Times New Roman, serif' }}>
      {/* Compact Official Header */}
      <div className="text-center mb-4 pb-3 border-b-2 border-blue-800">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img 
            src={chrome.runtime.getURL('icons/iiitr.png')} 
            alt="IIIT Raichur" 
            className="h-12 w-12"
          />
          <div className="text-left">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              INDIAN INSTITUTE OF INFORMATION TECHNOLOGY, RAICHUR
            </h1>
            <p className="text-xs text-gray-600">(Institute of National Importance) Karnataka - 584135, India</p>
          </div>
        </div>
        <h2 className="text-base font-bold text-blue-800 uppercase tracking-wide mt-2">Academic Transcript</h2>
      </div>

      {/* Compact Student Information */}
      <div className="mb-3 border border-gray-300 p-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex">
            <span className="font-semibold w-32">Name:</span>
            <span className="flex-1">{student?.name || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Roll Number:</span>
            <span className="flex-1">{student?.rollNo || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Programme:</span>
            <span className="flex-1">{student?.branch || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Date of Issue:</span>
            <span className="flex-1">{new Date(generatedAt || Date.now()).toLocaleDateString('en-IN', { 
              day: '2-digit', month: 'short', year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Semester-wise Course Details */}
      <div className="mb-3">
        {semestersWithGPA.map((semester, semesterIndex) => {
          const isBacklog = isBacklogSemester(semester);
          
          return (
            <div key={semester.id} className="mb-3 break-inside-avoid">
              {/* Compact Semester Header */}
              <div className="bg-blue-800 text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
                <span>
                  {semester.name}
                  {isBacklog && (
                    <span className="ml-2 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded text-[10px]">
                      Supplementary
                    </span>
                  )}
                </span>
                <span className="text-[10px] opacity-90">{semester.courses.length} courses</span>
              </div>

              {/* Compact Course Table */}
              <table className="w-full text-[10px] border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 px-2 py-1 text-left w-20">Code</th>
                    <th className="border border-gray-400 px-2 py-1 text-left">Course Title</th>
                    <th className="border border-gray-400 px-2 py-1 text-center w-14">Credits</th>
                    <th className="border border-gray-400 px-2 py-1 text-center w-12">Grade</th>
                    <th className="border border-gray-400 px-2 py-1 text-center w-14">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-400 px-2 py-1 font-mono text-[9px]">{course.code}</td>
                      <td className="border border-gray-400 px-2 py-1">{course.title}</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">{course.credits?.toFixed(1)}</td>
                      <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                        {course.grade || '-'}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 text-center">
                        {course.grade && USED_GRADE_POINTS[course.grade] !== null 
                          ? USED_GRADE_POINTS[course.grade].toFixed(1) 
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Compact Semester Summary */}
              <div className="bg-gray-100 border border-gray-400 border-t-0 px-2 py-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span>
                    <span className="font-semibold">Sem Credits: </span>{semester.sgpaCredits.toFixed(1)}
                    <span className="ml-3 font-semibold">SGPA: </span>
                    <span className="font-bold">{semester.sgpa.toFixed(2)}</span>
                  </span>
                  <span>
                    <span className="font-semibold">Cum Credits: </span>{semester.cgpaCredits.toFixed(1)}
                    <span className="ml-3 font-semibold">CGPA: </span>
                    <span className="font-bold">{semester.cgpa.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Overall Performance */}
      <div className="mb-3 border-2 border-blue-800 p-2 bg-blue-50">
        <h3 className="text-center font-bold text-xs mb-2 text-blue-900">CUMULATIVE PERFORMANCE</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <p className="text-[10px] text-gray-700 mb-0.5">CGPA</p>
            <p className="text-xl font-bold text-blue-900">{result?.gpa?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-700 mb-0.5">Credits Earned</p>
            <p className="text-xl font-bold text-green-700">{result?.earnedCredits || 0}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-700 mb-0.5">Credits Registered</p>
            <p className="text-xl font-bold text-gray-900">{result?.totalCredits || 0}</p>
          </div>
        </div>
      </div>

      {/* Compact Grading System */}
      <div className="mb-3 border border-gray-300 p-2">
        <h3 className="font-bold text-[10px] mb-1.5 text-center uppercase">Grading System</h3>
        <div className="grid grid-cols-8 gap-x-2 gap-y-0.5 text-[10px]">
          {Object.entries(USED_GRADE_POINTS)
            .filter(([_, pts]) => pts !== null)
            .map(([grade, points]) => (
              <div key={grade} className="flex justify-between">
                <span className="font-bold">{grade}:</span>
                <span className="text-gray-700">{points.toFixed(1)}</span>
              </div>
            ))}
        </div>
        <p className="text-[9px] text-gray-600 mt-1 text-center italic">
          Ab = Absent, W = Withdrawn, F = Fail
        </p>
      </div>


      {/* Compact Signature Section */}
      <div className="mt-4 mb-3">
        <div className="grid grid-cols-2 gap-6">
          {/* Stamp */}
          <div className="text-center">
            <img 
              src={chrome.runtime.getURL('icons/stamp.png')} 
              alt="Official Stamp" 
              className="h-16 mx-auto opacity-80"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }} className="w-16 h-16 mx-auto border-2 border-blue-800 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-blue-800 font-bold text-center">OFFICIAL<br/>SEAL</span>
            </div>
          </div>

          {/* Signature */}
          <div className="text-center">
            <img 
              src={chrome.runtime.getURL('icons/director_sign.png')} 
              alt="Authorized Signature" 
              className="h-12 mx-auto"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="border-t border-gray-400 pt-1 mt-4 inline-block min-w-[120px]">
              <p className="text-[10px] font-semibold">Authorized Signatory</p>
              <p className="text-[9px] text-gray-600">Academic Office</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="text-center text-[9px] text-gray-600 mt-3 pt-2 border-t border-gray-300">
        <p className="text-gray-500">www.iiitr.ac.in | office.acad@iiitr.ac.in</p>
      </div>
    </div>
  );
}