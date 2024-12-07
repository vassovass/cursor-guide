import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch sprints with error handling
  const { data: sprints, isLoading, refetch, error } = useQuery({
    queryKey: ['sprints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sprints')
        .select('*, sprint_tasks(count)')
        .order('sprint_number', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching sprints",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500 bg-green-50 dark:bg-green-950/30';
      case 'in_progress':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30';
      case 'blocked':
        return 'text-red-500 bg-red-50 dark:bg-red-950/30';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800/30';
    }
  };

  const handleCreateSprint = () => {
    navigate('/sprint');
  };

  const handleSprintClick = (sprintId: string) => {
    navigate(`/sprint/${sprintId}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Sprint list has been updated",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center p-6 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Sprints</h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Sprints</h1>
          <p className="text-muted-foreground mt-2">
            Manage your project sprints and tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          <Button onClick={handleCreateSprint}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sprints?.map((sprint) => (
            <Card 
              key={sprint.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 hover:scale-[1.02] transform transition-all duration-200"
              style={{ borderLeftColor: sprint.status === 'completed' ? '#22c55e' : 
                       sprint.status === 'in_progress' ? '#3b82f6' : '#94a3b8' }}
              onClick={() => handleSprintClick(sprint.id)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{sprint.title}</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(sprint.status)}`}>
                    {sprint.status === 'completed' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    ) : (
                      sprint.status.replace('_', ' ')
                    )}
                  </span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Sprint #{sprint.sprint_number}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {sprint.start_date ? (
                      <span>
                        {new Date(sprint.start_date).toLocaleDateString()} - 
                        {sprint.end_date ? new Date(sprint.end_date).toLocaleDateString() : 'Ongoing'}
                      </span>
                    ) : (
                      <span>Not scheduled</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(sprint as any).sprint_tasks_count || 0} tasks
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sprints?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No sprints yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first sprint to start organizing your tasks
            </p>
            <Button onClick={handleCreateSprint}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Sprint
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}