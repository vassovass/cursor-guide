import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function SprintPage() {
  const { sprintNumber } = useParams();
  
  // Parse sprint number and validate it
  const parsedSprintNumber = sprintNumber ? parseInt(sprintNumber, 10) : null;

  const { data: sprint, isLoading } = useQuery({
    queryKey: ["sprint", parsedSprintNumber],
    queryFn: async () => {
      // Return early if sprint number is invalid
      if (!parsedSprintNumber || isNaN(parsedSprintNumber)) {
        throw new Error("Invalid sprint number");
      }

      const { data, error } = await supabase
        .from("sprints")
        .select(`
          *,
          sprint_tasks (*)
        `)
        .eq("sprint_number", parsedSprintNumber)
        .single();
      
      if (error) throw error;
      return data;
    },
    // Disable the query if sprint number is invalid
    enabled: Boolean(parsedSprintNumber && !isNaN(parsedSprintNumber)),
  });

  // Show error state for invalid sprint number
  if (!parsedSprintNumber || isNaN(parsedSprintNumber)) {
    return (
      <div 
        className="text-center py-12 text-muted-foreground"
        data-testid="sprint-page-invalid"
      >
        Invalid sprint number
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="sprint-page-loading">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!sprint) {
    return (
      <div 
        className="text-center py-12 text-muted-foreground"
        data-testid="sprint-page-not-found"
      >
        Sprint not found
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid={`sprint-page-${sprint.sprint_number}`}>
      <div className="sprint-header">
        <h1 
          className="text-3xl font-bold mb-4 text-foreground"
          data-testid="sprint-page-title"
        >
          Sprint {sprint.sprint_number}: {sprint.title}
        </h1>
        <div 
          className="flex gap-4 text-sm text-muted-foreground"
          data-testid="sprint-page-dates"
        >
          <span>Start: {new Date(sprint.start_date).toLocaleDateString()}</span>
          <span>End: {new Date(sprint.end_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div 
        className="grid gap-4"
        data-testid="sprint-tasks-container"
      >
        {sprint.sprint_tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-6 bg-card text-card-foreground sprint-task-card"
            data-testid={`sprint-task-${task.id}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 
                className="text-lg font-semibold text-foreground"
                data-testid={`sprint-task-title-${task.id}`}
              >
                {task.title}
              </h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  task.status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                data-testid={`sprint-task-status-${task.id}`}
              >
                {task.status}
              </span>
            </div>
            {task.description && (
              <p 
                className="text-muted-foreground"
                data-testid={`sprint-task-description-${task.id}`}
              >
                {task.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}