import React from 'react';
import { format } from 'date-fns';
import { GRADE_POINTS } from '@shared/constants/gradeSystem';
import { GPACalculator } from '@shared/utils/gpaCalculator';

export default function MinimalTemplate({ data }) {
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
    const sgpaResult = GPACalculator.calculateSemesterGPA({ courses: semester.courses });
    
    cumulativeCourses = [...cumulativeCourses, ...semester.courses];
    const cgpaResult = GPACalculator.calculateSemesterGPA({ courses: cumulativeCourses });
    
    return {
      ...semester,
      sgpa: sgpaResult.gpa,
      cgpa: cgpaResult.gpa,
      credits: sgpaResult.totalCredits
    };
  });
  
  semestersWithGPA.reverse();

  return (
    <div className="bg-white p-6" style={{ maxWidth: '210mm', margin: '0 auto' }}>
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Academic Transcript</h1>
        <p className="text-xs text-gray-600">IIIT Raichur, Karnataka</p>
      </div>

      {/* Student Info - Compact */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div><strong>Name:</strong> {student?.name || 'N/A'}</div>
        <div><strong>Roll No:</strong> {student?.rollNo || 'N/A'}</div>
        <div><strong>Program:</strong> {student?.branch || 'N/A'}</div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gray-100 p-3 rounded flex justify-around text-center mb-4">
        <div>
          <div className="text-2xl font-bold text-blue-700">{result?.gpa?.toFixed(2) || '0.00'}</div>
          <div className="text-xs text-gray-600">CGPA</div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900">{result?.totalCredits || 0}</div>
          <div className="text-xs text-gray-600">Credits</div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900">{result?.courseCount || 0}</div>
          <div className="text-xs text-gray-600">Courses</div>
        </div>
      </div>

      {/* Semester-wise Courses */}
      {semestersWithGPA.map((semester) => (
        <div key={semester.id} className="mb-4">
          <div className="bg-blue-100 px-3 py-1.5 rounded-t flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">{semester.name}</span>
            <div className="flex gap-3 text-xs">
              <span className="font-semibold text-blue-700">SGPA: {semester.sgpa.toFixed(2)}</span>
              <span className="font-semibold text-purple-700">CGPA: {semester.cgpa.toFixed(2)}</span>
            </div>
          </div>
          
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-1.5 px-2">Code</th>
                <th className="text-left py-1.5 px-2">Course</th>
                <th className="text-center py-1.5 px-2 w-16">Credits</th>
                <th className="text-center py-1.5 px-2 w-16">Grade</th>
              </tr>
            </thead>
            <tbody>
              {semester.courses.map((course, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-1.5 px-2 font-mono">{course.code}</td>
                  <td className="py-1.5 px-2">{course.title}</td>
                  <td className="py-1.5 px-2 text-center">{course.credits?.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-center font-bold">
                    {course.grade || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-50 px-3 py-1 text-xs text-gray-600 rounded-b border-t">
            Semester Credits: <span className="font-semibold">{semester.credits.toFixed(1)}</span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 pt-3 border-t flex justify-between text-xs text-gray-600">
        <div>Generated: {format(new Date(generatedAt || Date.now()), 'MMM dd, yyyy')}</div>
        <div>GPA Genie v3.0</div>
      </div>
    </div>
  );
}