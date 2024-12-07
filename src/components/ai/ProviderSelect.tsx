import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderSelectProps {
  providers: Array<{
    provider_id: string;
    provider_name: string;
  }>;
  selectedProvider: string;
  onProviderChange: (value: string) => void;
}

export function ProviderSelect({ providers, selectedProvider, onProviderChange }: ProviderSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Provider</label>
      <Select value={selectedProvider} onValueChange={onProviderChange}>
        <SelectTrigger className="select-trigger">
          <SelectValue placeholder="Select an AI provider" />
        </SelectTrigger>
        <SelectContent className="select-content">
          {providers.map((provider) => (
            <SelectItem 
              key={provider.provider_id} 
              value={provider.provider_id}
              className="select-item"
            >
              {provider.provider_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}