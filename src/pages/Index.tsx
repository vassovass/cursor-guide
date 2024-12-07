import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar, CheckCircle2, AlertCircle, Search, SortAsc, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type SortOption = "newest" | "oldest" | "title" | "status";
type FilterOption = "all" | "completed" | "in_progress" | "planned" | "blocked";

export function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterStatus, setFilterStatus] = useState<FilterOption>("all");

  // Fetch sprints with error handling
  const { data: sprints, isLoading, refetch, error } = useQuery({
    queryKey: ['sprints'],
    queryFn: async () => {
      console.log("Fetching sprints...");
      const { data, error } = await supabase
        .from('sprints')
        .select('*, sprint_tasks(count)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching sprints:", error);
        toast({
          title: "Error fetching sprints",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Fetched sprints:", data);
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

  // Filter and sort sprints
  const filteredAndSortedSprints = sprints
    ?.filter((sprint) => {
      const matchesSearch = sprint.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || sprint.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

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
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
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

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  By Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>
                  By Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Sprints
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("in_progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("planned")}>
                  Planned
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("blocked")}>
                  Blocked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedSprints?.map((sprint) => (
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

            {filteredAndSortedSprints?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery || filterStatus !== "all" 
                      ? "No sprints match your filters" 
                      : "No sprints yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Create your first sprint to start organizing your tasks"}
                  </p>
                  {!searchQuery && filterStatus === "all" && (
                    <Button onClick={handleCreateSprint}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Sprint
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}