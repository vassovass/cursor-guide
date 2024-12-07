import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
  models: any[];
  selectedModel: string;
  onModelChange: (value: string) => void;
}

export function ModelSelect({ models, selectedModel, onModelChange }: ModelSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Model</label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.model_id} value={model.model_id}>
              {model.model_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}