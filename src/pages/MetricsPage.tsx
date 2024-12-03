import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import mermaid from 'mermaid';
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
import { supabase } from "@/integrations/supabase/client";

// Fetch sprints and tasks from Supabase
const fetchSprintData = async () => {
  const { data: sprints, error: sprintsError } = await supabase
    .from('sprints')
    .select(`
      *,
      sprint_tasks (*)
    `)
    .order('sprint_number', { ascending: true });

  if (sprintsError) throw sprintsError;
  return sprints;
};

export function MetricsPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const { data: sprintData, isLoading } = useQuery({
    queryKey: ['sprints'],
    queryFn: fetchSprintData
  });

  useEffect(() => {
    if (mermaidRef.current && sprintData) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });

      const generateMermaidDiagram = () => {
        let diagram = 'gantt\n  title Project Timeline\n  dateFormat YYYY-MM-DD\n';
        
        sprintData.forEach((sprint) => {
          if (sprint.start_date && sprint.end_date) {
            diagram += `  section Sprint ${sprint.sprint_number}\n`;
            sprint.sprint_tasks.forEach((task) => {
              const startDate = new Date(sprint.start_date).toISOString().split('T')[0];
              const duration = '3d'; // Default duration, can be calculated based on your needs
              diagram += `    ${task.title} :${startDate}, ${duration}\n`;
            });
          }
        });

        return diagram;
      };

      if (sprintData.length > 0) {
        mermaid.render('sprint-diagram', generateMermaidDiagram()).then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        });
      }
    }
  }, [sprintData]);

  // Transform sprint data for charts
  const sprintProgress = sprintData?.map(sprint => ({
    name: `Sprint ${sprint.sprint_number}`,
    completed: sprint.sprint_tasks.filter(task => task.status === 'completed').length,
    total: sprint.sprint_tasks.length,
    percentComplete: sprint.sprint_tasks.length > 0
      ? (sprint.sprint_tasks.filter(task => task.status === 'completed').length / sprint.sprint_tasks.length) * 100
      : 0
  })) || [];

  // Get current sprint tasks
  const currentSprint = sprintData?.find(sprint => sprint.status === 'active');
  const currentTasks = currentSprint?.sprint_tasks || [];

  if (isLoading) {
    return <div className="p-8">Loading sprint data...</div>;
  }

  return (
    <div className="space-y-8 p-6">
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
        <h2 className="text-xl font-semibold mb-4">Sprint Timeline</h2>
        <div ref={mermaidRef} className="overflow-x-auto" />
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">Current Sprint Tasks</h2>
        <div className="grid gap-4">
          {currentTasks.map((task) => (
            <div 
              key={task.id}
              className="flex justify-between items-center p-3 bg-background rounded-md border"
            >
              <span>{task.title}</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
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