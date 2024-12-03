import { useQuery } from "@tanstack/react-query";

export function VersionDisplay() {
  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/repos/shadcn/ui/releases/latest");
      const data = await response.json();
      return data.tag_name || "v0.1.0";
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <div className="fixed bottom-4 right-4 text-sm text-muted-foreground">
      {version}
    </div>
  );
}