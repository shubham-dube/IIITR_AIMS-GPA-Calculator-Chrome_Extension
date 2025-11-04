import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { GPACalculator } from '@shared/utils/gpaCalculator';


export default function Analytics({ semesters }) {
  // Changed to object to track multiple sections independently
  const [expandedSections, setExpandedSections] = useState({
    trend: true,
    grades: true,
    credits: false,
    semesters: false
  });
  
  const breakdown = GPACalculator.getGPABreakdown(semesters);
  
  // Prepare data
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


  const gradeData = Object.entries(gradeDistribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => b.count - a.count);


  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];


  // Statistics
  const allGPAs = breakdown.map(b => b.gpa);
  const avgGPA = allGPAs.reduce((a, b) => a + b, 0) / allGPAs.length;
  const maxGPA = Math.max(...allGPAs);
  const minGPA = Math.min(...allGPAs);
  const totalCredits = breakdown.reduce((sum, b) => sum + b.totalCredits, 0);
  const trend = allGPAs.length > 1 ? allGPAs[allGPAs.length - 1] - allGPAs[allGPAs.length - 2] : 0;


  // Toggle individual section
  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  const Section = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-primary-600" />
            <span className="text-sm font-semibold text-gray-800">{title}</span>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isExpanded && <div className="p-3 bg-white">{children}</div>}
      </div>
    );
  };


  return (
    <div className="space-y-2 animate-fade-in">
      {/* GPA Trend Chart - Always visible and toggleable */}
      <Section id="trend" title="GPA Trend" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ fontSize: '11px', padding: '4px 8px' }}
              formatter={(value) => value.toFixed(2)}
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


      {/* Grade Distribution - Always visible and toggleable */}
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
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip contentStyle={{ fontSize: '11px', padding: '4px 8px' }} />
            <Bar dataKey="credits" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Semester Breakdown */}
      <Section id="semesters" title="Semester Details" icon={BookOpen}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {breakdown.map((sem, index) => (
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
      <div className="card p-2 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary-700">{avgGPA.toFixed(2)}</div>
            <div className="text-[10px] text-gray-600">Avg GPA</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-700">{maxGPA.toFixed(2)}</div>
            <div className="text-[10px] text-gray-600">Best</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-700">{totalCredits}</div>
            <div className="text-[10px] text-gray-600">Credits</div>
          </div>
        </div>
      </div>
    </div>
  );
}