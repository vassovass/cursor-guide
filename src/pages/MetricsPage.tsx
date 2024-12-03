import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Sprint 1', completed: 75, planned: 100 },
  { name: 'Sprint 2', completed: 45, planned: 80 },
  { name: 'Sprint 3', completed: 20, planned: 60 },
  { name: 'Sprint 4', completed: 0, planned: 40 },
  { name: 'Sprint 5', completed: 0, planned: 20 },
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

      <div className="h-[400px] border rounded-lg p-4 bg-card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#4F46E5" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="planned" 
              stroke="#64748B" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}