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
    console.log('Fetching ROADMAP.md content...');
    fetch('/ROADMAP.md')
      .then(response => {
        console.log('ROADMAP.md response:', response.status);
        return response.text();
      })
      .then(content => {
        console.log('ROADMAP.md content length:', content.length);
        console.log('First 100 characters:', content.substring(0, 100));
        setRoadmapContent(content);
      })
      .catch(error => {
        console.error('Error loading roadmap:', error);
      });
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

      <div className="prose dark:prose-invert max-w-none 
        prose-h1:text-[2em] prose-h1:font-semibold prose-h1:border-b prose-h1:border-[#30363d] prose-h1:pb-[0.3em] prose-h1:mb-[1em]
        prose-h2:text-[1.5em] prose-h2:font-semibold prose-h2:border-b prose-h2:border-[#30363d] prose-h2:pb-[0.3em] prose-h2:mb-[1em]
        prose-h3:text-[1.25em] prose-h3:font-semibold
        prose-h4:text-[1em] prose-h4:font-semibold
        prose-h5:text-[0.875em] prose-h5:font-semibold
        prose-h6:text-[0.85em] prose-h6:font-semibold
        prose-p:text-base prose-p:leading-[1.75] prose-p:mb-4
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:font-semibold
        prose-code:bg-[#30363d] prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm
        prose-pre:bg-[#30363d] prose-pre:rounded-md prose-pre:p-4
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
        prose-li:mb-1
        prose-blockquote:border-l-4 prose-blockquote:border-[#30363d] prose-blockquote:pl-4 prose-blockquote:italic
        prose-hr:border-[#30363d]
        [&_input[type='checkbox']]:appearance-none [&_input[type='checkbox']]:bg-transparent 
        [&_input[type='checkbox']]:border [&_input[type='checkbox']]:border-[#30363d] 
        [&_input[type='checkbox']]:rounded [&_input[type='checkbox']]:w-4 [&_input[type='checkbox']]:h-4 
        [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:align-middle
        [&_input[type='checkbox']]:checked:bg-blue-500 [&_input[type='checkbox']]:checked:border-blue-500
        [&_input[type='checkbox']]:focus:ring-2 [&_input[type='checkbox']]:focus:ring-blue-500
        " 
        data-testid="roadmap-content">
        {roadmapContent && (
          <ReactMarkdown>
            {roadmapContent}
          </ReactMarkdown>
        )}
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
