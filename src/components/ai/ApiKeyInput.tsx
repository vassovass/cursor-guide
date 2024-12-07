import { Input } from "@/components/ui/input";

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">API Key</label>
      <Input
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={onChange}
      />
    </div>
  );
}