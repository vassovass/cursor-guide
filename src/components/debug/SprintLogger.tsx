import { Dispatch, SetStateAction } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Log } from "./types";

export async function logSprintStatus(setLogs: Dispatch<SetStateAction<Log[]>>) {
  try {
    const { data: sprints, error: sprintsError } = await supabase
      .from('sprints')
      .select(`
        *,
        sprint_tasks (*)
      `)
      .order('sprint_number', { ascending: true });

    if (sprintsError) throw sprintsError;

    if (!sprints) {
      throw new Error('No sprints data received');
    }

    setLogs(prev => [...prev, {
      level: 'INFO',
      message: `Found ${sprints.length} sprints`,
      timestamp: new Date().toISOString()
    }]);

    sprints.forEach((sprint) => {
      const completedTasks = sprint.sprint_tasks.filter(task => task.status === 'completed').length;
      const totalTasks = sprint.sprint_tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setLogs(prev => [...prev, {
        level: 'INFO',
        message: `Sprint ${sprint.sprint_number}: ${sprint.title} - Status: ${sprint.status} (${progress}% complete)`,
        timestamp: new Date().toISOString()
      }]);

      sprint.sprint_tasks.forEach((task) => {
        setLogs(prev => [...prev, {
          level: 'INFO',
          message: `  - ${task.title}: ${task.status}`,
          timestamp: new Date().toISOString()
        }]);
      });
    });

  } catch (error) {
    setLogs(prev => [...prev, {
      level: 'ERROR',
      message: `Sprint status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }]);
  }
}