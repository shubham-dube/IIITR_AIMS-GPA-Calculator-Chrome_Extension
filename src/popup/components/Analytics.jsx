import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Award, BookOpen, ChevronDown, ChevronUp 
} from 'lucide-react';

/**
 * IMPORT PATHS:
 * Reverting to the path mapping provided in the original UI snippet to resolve compilation errors.
 */
import { GPACalculator } from '@shared/utils/gpaCalculator';

export default function Analytics({ semesters = [] }) {
  // Changed to object to track multiple sections independently as per requested UI
  const [expandedSections, setExpandedSections] = useState({
    trend: true,
    grades: true,
    credits: false,
    semesters: false
  });

  // PRESERVED LOGIC: Calculate Semester Breakdown using original utility methods
  const breakdownData = useMemo(() => {
    const data = (semesters || []).map((sem, idx) => {
      const stats = GPACalculator.calculateSemesterGPA(sem);
      return {
        semester: sem.name || sem.semesterName || `Sem ${idx + 1}`,
        name: `Sem ${idx + 1}`, // Used for chart axis
        gpa: stats.gpa,
        totalCredits: stats.totalCredits,
        courseCount: stats.courseCount,
      };
    });
    return data;
  }, [semesters]);

  // PRESERVED LOGIC: Prepare Grade Distribution
  const gradeData = useMemo(() => {
    const distribution = {};
    (semesters || []).forEach(sem => {
      (sem.courses || []).forEach(course => {
        if (course.grade && course.grade.trim()) {
          distribution[course.grade] = (distribution[course.grade] || 0) + 1;
        }
      });
    });
    return Object.entries(distribution)
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => b.count - a.count);
  }, [semesters]);

  // PRESERVED LOGIC: Overall Statistics
  const cgpaStats = useMemo(() => {
    if (!semesters || semesters.length === 0) {
      return { gpa: 0, totalCredits: 0, earnedCredits: 0, courseCount: 0 };
    }
    return GPACalculator.calculateCumulativeGPA(semesters);
  }, [semesters]);

  // UI COLORS from snippet
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Section Component with the requested styling
  const Section = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-2 bg-white">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">{title}</span>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isExpanded && <div className="p-3 bg-white">{children}</div>}
      </div>
    );
  };

  if (!semesters || semesters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
        <TrendingUp size={48} className="mb-2 opacity-20" />
        <p className="text-sm">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {/* GPA Trend Chart */}
      <Section id="trend" title="GPA Trend" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={breakdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ fontSize: '11px', padding: '4px 8px' }}
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
            />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#0ea5e9" 
              strokeWidth={2.5}
              dot={{ fill: '#0ea5e9', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Grade Distribution */}
      <Section id="grades" title="Grade Distribution" icon={Award}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', padding: '4px 8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1">
            {gradeData.slice(0, 6).map((item, index) => (
              <div key={item.grade} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-semibold">{item.grade}</span>
                </div>
                <span className="text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Credits Distribution */}
      <Section id="credits" title="Credits per Semester" icon={BookOpen}>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={breakdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip contentStyle={{ fontSize: '11px', padding: '4px 8px' }} />
            <Bar dataKey="totalCredits" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Semester Breakdown Details */}
      <Section id="semesters" title="Semester Details" icon={BookOpen}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {breakdownData.map((sem) => (
            <div 
              key={sem.semester}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-800 truncate">
                    {sem.semester}
                  </span>
                  <span className={`text-xs font-bold ${
                    sem.gpa >= 9 ? 'text-green-600' :
                    sem.gpa >= 8 ? 'text-blue-600' :
                    sem.gpa >= 7 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {sem.gpa.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">
                  {sem.courseCount} courses • {sem.totalCredits} credits
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Compact Stats Banner */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-blue-700">{cgpaStats.gpa.toFixed(2)}</div>
            <div className="text-[10px] text-blue-600 font-medium">CGPA</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-700">{cgpaStats.earnedCredits}</div>
            <div className="text-[10px] text-emerald-600 font-medium">Credits</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-700">{cgpaStats.courseCount}</div>
            <div className="text-[10px] text-indigo-600 font-medium">Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
}