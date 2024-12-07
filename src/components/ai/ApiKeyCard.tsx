import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Key, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyCardProps {
  config: {
    id: string;
    provider: string;
    api_key: string;
    last_verified_at: string;
    notes?: string | null;
  };
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function ApiKeyCard({ config, onDelete, onUpdate }: ApiKeyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(config.notes || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const maskApiKey = (key: string) => {
    if (!key) return '';
    const lastFour = key.slice(-4);
    return `••••••••${lastFour}`;
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("[ApiKeyCard] Starting deletion process for key:", config.id);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to delete API keys");
      }

      // First, create a historical record
      const { error: historyError } = await supabase
        .from('api_key_history')
        .insert({
          user_id: user.id,
          provider: config.provider,
          notes: config.notes,
        });

      if (historyError) {
        console.error("[ApiKeyCard] Error creating history record:", historyError);
        throw historyError;
      }

      // Then delete the config
      const { error: deleteError } = await supabase
        .from('api_model_configs')
        .delete()
        .eq('id', config.id);

      if (deleteError) {
        console.error("[ApiKeyCard] Error deleting config:", deleteError);
        throw deleteError;
      }

      console.log("[ApiKeyCard] Successfully deleted key:", config.id);
      onDelete(config.id);
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    } catch (error) {
      console.error("[ApiKeyCard] Error deleting API key:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete API key",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      console.log("[ApiKeyCard] Updating notes for key:", config.id);
      const { error } = await supabase
        .from('api_model_configs')
        .update({ notes })
        .eq('id', config.id);

      if (error) {
        console.error("[ApiKeyCard] Error updating notes:", error);
        throw error;
      }

      console.log("[ApiKeyCard] Successfully updated notes for key:", config.id);
      setIsEditing(false);
      onUpdate();
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    } catch (error) {
      console.error("[ApiKeyCard] Error updating notes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update notes",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">{config.provider}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Key className="mr-2 h-4 w-4" />
              {maskApiKey(config.api_key)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                className="flex-1"
              />
              <Button size="sm" onClick={handleSaveNotes}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => setIsEditing(true)}
            >
              {notes || "Click to add notes..."}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Last verified: {new Date(config.last_verified_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}