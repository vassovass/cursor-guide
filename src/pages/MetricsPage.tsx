import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const sprintProgress = [
  { name: 'Sprint 1', completed: 2, total: 4, percentComplete: 50 },
  { name: 'Sprint 2', completed: 0, total: 4, percentComplete: 0 },
  { name: 'Sprint 3', completed: 0, total: 4, percentComplete: 0 },
  { name: 'Sprint 4', completed: 0, total: 4, percentComplete: 0 },
  { name: 'Sprint 5', completed: 0, total: 4, percentComplete: 0 },
];

const taskCompletion = [
  { name: 'Project Setup', status: 'Completed' },
  { name: 'Error Boundaries', status: 'In Progress' },
  { name: 'Sentry Integration', status: 'Pending' },
  { name: 'Logging Setup', status: 'In Progress' },
];

export function MetricsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Development Metrics</h1>
        <p className="text-muted-foreground mb-8">
          Track project progress and development metrics across sprints
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="text-xl font-semibold mb-4">Sprint Progress</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4F46E5" name="Completed Tasks" />
                <Bar dataKey="total" fill="#64748B" name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <h2 className="text-xl font-semibold mb-4">Completion Percentage</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sprintProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentComplete" 
                  stroke="#4F46E5" 
                  name="Completion %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Current Sprint Tasks</h2>
        <div className="grid gap-4">
          {taskCompletion.map((task, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-background rounded-md border"
            >
              <span>{task.name}</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}