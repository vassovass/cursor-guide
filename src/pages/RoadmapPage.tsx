import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

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
    fetch('/ROADMAP.md')
      .then(response => response.text())
      .then(content => {
        // Update the content to mark completed items
        const updatedContent = content
          .replace('- Specification input interface', '- ✓ Specification input interface')
          .replace('- Basic parsing logic', '- ✓ Basic parsing logic')
          .replace('- Initial best practices documentation', '- ✓ Initial best practices documentation');
        setRoadmapContent(updatedContent);
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
        <Badge variant="secondary" className="mb-6">
          Sprint 1 - All Tasks Completed
        </Badge>
      </div>

      <div className="prose dark:prose-invert max-w-none 
        prose-headings:mt-6 prose-headings:mb-4
        prose-h1:text-[2em] prose-h1:font-semibold prose-h1:border-b prose-h1:border-border/40 prose-h1:pb-[0.3em]
        prose-h2:text-[1.5em] prose-h2:font-semibold prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-[0.3em]
        prose-h3:text-[1.25em] prose-h3:font-semibold
        prose-h4:text-[1em] prose-h4:font-semibold
        prose-h5:text-[0.875em] prose-h5:font-semibold
        prose-h6:text-[0.85em] prose-h6:font-semibold
        prose-p:my-4 prose-p:leading-[1.75]
        prose-a:text-primary hover:prose-a:underline
        prose-strong:font-semibold
        prose-code:before:content-[''] prose-code:after:content-['']
        prose-code:bg-muted prose-code:rounded prose-code:px-[0.4em] prose-code:py-[0.2em] prose-code:text-sm
        prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4
        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-8
        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-8
        prose-li:my-2
        prose-blockquote:border-l-4 prose-blockquote:border-border/40 prose-blockquote:pl-4 prose-blockquote:italic
        prose-hr:border-border/40
        [&_input[type='checkbox']]:h-4 [&_input[type='checkbox']]:w-4 
        [&_input[type='checkbox']]:border [&_input[type='checkbox']]:border-border/40 
        [&_input[type='checkbox']]:rounded [&_input[type='checkbox']]:bg-transparent
        [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:align-middle
        [&_input[type='checkbox']]:checked:bg-primary [&_input[type='checkbox']]:checked:border-primary
        [&_input[type='checkbox']]:focus:ring-2 [&_input[type='checkbox']]:focus:ring-primary/50
        [&_task-list-item]:list-none [&_task-list-item]:-ml-4" 
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
            <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              Sprint {sprint.sprint_number}: {sprint.title}
              {sprint.sprint_number === 1 && <CheckCircle2 className="text-primary h-5 w-5" />}
            </h2>
            <div className="space-y-4">
              {sprint.sprint_tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted rounded roadmap-task-item"
                  data-testid={`roadmap-task-${task.id}`}
                >
                  <span className="text-foreground flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="text-primary h-4 w-4" />
                    ) : (
                      <Circle className="text-secondary h-4 w-4" />
                    )}
                    {task.title}
                  </span>
                  <Badge 
                    variant={task.status === "completed" ? "default" : "secondary"}
                    data-testid={`roadmap-task-status-${task.id}`}
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}