import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';
import { GPACalculator } from '@shared/utils/gpaCalculator';

export default function Analytics({ semesters }) {
  const breakdown = GPACalculator.getGPABreakdown(semesters);
  
  // Prepare data for semester-wise GPA trend
  const trendData = breakdown.map((sem, index) => ({
    name: `Sem ${breakdown.length - index}`,
    gpa: sem.gpa,
    credits: sem.totalCredits,
  })).reverse();

  // Grade distribution
  const gradeDistribution = {};
  semesters.forEach(sem => {
    sem.courses.forEach(course => {
      if (course.grade && course.grade.trim()) {
        gradeDistribution[course.grade] = (gradeDistribution[course.grade] || 0) + 1;
      }
    });
  });

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Calculate statistics
  const allGPAs = breakdown.map(b => b.gpa);
  const avgGPA = allGPAs.reduce((a, b) => a + b, 0) / allGPAs.length;
  const maxGPA = Math.max(...allGPAs);
  const minGPA = Math.min(...allGPAs);
  const totalCredits = breakdown.reduce((sum, b) => sum + b.totalCredits, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-compact bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-primary-600" />
            <span className="text-xs text-gray-600">Avg GPA</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{avgGPA.toFixed(2)}</p>
        </div>

        <div className="card-compact bg-gradient-to-br from-success-50 to-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Award size={18} className="text-success-600" />
            <span className="text-xs text-gray-600">Best GPA</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{maxGPA.toFixed(2)}</p>
        </div>

        <div className="card-compact bg-gradient-to-br from-warning-50 to-orange-50">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-warning-600" />
            <span className="text-xs text-gray-600">Lowest GPA</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{minGPA.toFixed(2)}</p>
        </div>

        <div className="card-compact bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-purple-600" />
            <span className="text-xs text-gray-600">Total Credits</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalCredits}</p>
        </div>
      </div>

      {/* GPA Trend Chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-600" />
          GPA Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Credits per Semester */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600" />
          Credits Distribution
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="credits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Distribution */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Award size={18} className="text-primary-600" />
          Grade Distribution
        </h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ grade, percent }) => `${grade} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Semester-wise Breakdown */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Semester Details</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto"></div>
        {breakdown.map((sem, index) => (
            <div 
              key={sem.semester}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">
                  {sem.semester}
                </span>
                <span className={`text-lg font-bold ${
                  sem.gpa >= 9 ? 'text-green-600' :
                  sem.gpa >= 8 ? 'text-blue-600' :
                  sem.gpa >= 7 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {sem.gpa.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{sem.courseCount} courses</span>
                <span>{sem.totalCredits} credits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}