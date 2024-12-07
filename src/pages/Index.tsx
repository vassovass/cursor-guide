import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar, CheckCircle2 } from "lucide-react";

export function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch sprints
  const { data: sprints, isLoading } = useQuery({
    queryKey: ['sprints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .order('sprint_number', { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch sprints",
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
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleCreateSprint = () => {
    navigate('/sprint');
  };

  const handleSprintClick = (sprintId: string) => {
    navigate(`/sprint/${sprintId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Sprints</h1>
          <p className="text-muted-foreground mt-2">
            Manage your project sprints and tasks
          </p>
        </div>
        <Button onClick={handleCreateSprint}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Sprint
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100 dark:bg-gray-800" />
              <CardContent className="h-20 bg-gray-50 dark:bg-gray-900" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sprints?.map((sprint) => (
            <Card 
              key={sprint.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSprintClick(sprint.id)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{sprint.title}</span>
                  <span className={`text-sm ${getStatusColor(sprint.status)}`}>
                    {sprint.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5" />
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