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
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Select an AI provider" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-md">
          {providers.map((provider) => (
            <SelectItem 
              key={provider.provider_id} 
              value={provider.provider_id}
              className="cursor-pointer hover:bg-selection-background hover:text-selection-foreground"
            >
              {provider.provider_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}