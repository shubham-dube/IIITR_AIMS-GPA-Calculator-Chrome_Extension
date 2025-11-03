import React from 'react';
import { format } from 'date-fns';
import { GRADE_POINTS } from '@shared/constants/gradeSystem';

export default function MinimalTemplate({ data }) {
  const { student, semesters, result, generatedAt } = data;

  return (
    <div className="transcript-page p-8">
      {/* Header */}
      <div className="border-b-4 border-primary-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Academic Transcript</h1>
        <p className="text-sm text-gray-600">IIIT Raichur</p>
      </div>

      {/* Student Info - Compact */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div><strong>Name:</strong> {student.name}</div>
        <div><strong>Roll No:</strong> {student.rollNo}</div>
        <div className="col-span-2"><strong>Program:</strong> {student.branch}</div>
      </div>

      {/* Performance Summary - Clean */}
      <div className="mb-6 bg-gray-100 p-4 rounded flex justify-around text-center">
        <div>
          <div className="text-2xl font-bold text-primary-700">{result.gpa.toFixed(2)}</div>
          <div className="text-xs text-gray-600">CGPA</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{result.totalCredits}</div>
          <div className="text-xs text-gray-600">Credits</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{result.courseCount}</div>
          <div className="text-xs text-gray-600">Courses</div>
        </div>
      </div>

      {/* Courses - Compact Table */}
      {semesters.map((semester) => (
        <div key={semester.id} className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm bg-gray-100 p-2 rounded">
            {semester.name}
          </h3>
          
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-2">Code</th>
                <th className="text-left py-2 px-2">Course</th>
                <th className="text-center py-2 px-2">Credits</th>
                <th className="text-center py-2 px-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {semester.courses.map((course, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2 px-2 font-mono">{course.code}</td>
                  <td className="py-2 px-2">{course.title}</td>
                  <td className="py-2 px-2 text-center">{course.credits.toFixed(1)}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {course.grade || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600 flex justify-between">
        <div>Generated: {format(new Date(generatedAt), 'MMM dd, yyyy')}</div>
        <div>GPA Genie v3.0</div>
      </div>
    </div>
  );
}