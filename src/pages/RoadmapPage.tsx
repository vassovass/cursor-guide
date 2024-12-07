import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';

export function RoadmapPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [roadmapContent, setRoadmapContent] = useState<string>("");

  const { data: sprints, isLoading: sprintsLoading } = useQuery({
    queryKey: ["sprints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprints")
        .select(`
          *,
          sprint_tasks (*)
        `)
        .order("sprint_number", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Fetch and parse ROADMAP.md content
    fetch('/ROADMAP.md')
      .then(response => response.text())
      .then(content => setRoadmapContent(content))
      .catch(error => console.error('Error loading roadmap:', error));
  }, []);

  useEffect(() => {
    if (mermaidRef.current && sprints) {
      mermaid.initialize({
        startOnLoad: true,
        theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
        securityLevel: "loose",
      });

      const graph = `
gantt
  title Project Timeline
  dateFormat YYYY-MM-DD
  ${sprints.map(sprint => `
  section Sprint ${sprint.sprint_number}: ${sprint.title}
    ${sprint.sprint_tasks.map(task => 
      `${task.title} :${new Date(sprint.start_date).toISOString().split('T')[0]}, ${task.status === 'completed' ? '100%' : '0%'}`
    ).join('\n    ')}
  `).join('\n')}`;

      mermaid.render("roadmap-diagram", graph).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      });
    }
  }, [sprints]);

  if (sprintsLoading) {
    return (
      <div className="space-y-8" data-testid="roadmap-loading-state">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4" data-testid="roadmap-container">
      <div className="roadmap-header">
        <h1 className="text-3xl font-bold mb-4 text-foreground" data-testid="roadmap-title">
          Project Roadmap
        </h1>
      </div>

      <div className="prose prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary dark:prose-invert max-w-none" data-testid="roadmap-content">
        <ReactMarkdown>
          {roadmapContent}
        </ReactMarkdown>
      </div>

      <div className="border rounded-lg p-6 bg-card text-card-foreground" data-testid="roadmap-chart-container">
        <div 
          ref={mermaidRef} 
          className="overflow-x-auto roadmap-chart dark:invert-[.85]" 
          data-testid="roadmap-mermaid-chart"
        />
      </div>

      <div className="grid gap-6" data-testid="roadmap-sprints-list">
        {sprints?.map((sprint) => (
          <div 
            key={sprint.id}
            className="border rounded-lg p-6 bg-card text-card-foreground roadmap-sprint-card"
            data-testid={`roadmap-sprint-${sprint.sprint_number}`}
          >
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Sprint {sprint.sprint_number}: {sprint.title}
            </h2>
            <div className="space-y-4">
              {sprint.sprint_tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted rounded roadmap-task-item"
                  data-testid={`roadmap-task-${task.id}`}
                >
                  <span className="text-foreground">{task.title}</span>
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      task.status === "completed" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}
                    data-testid={`roadmap-task-status-${task.id}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}