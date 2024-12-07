import { SpecificationInput } from "@/components/specification/SpecificationInput";

export default function IndexPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">CursorGuide</h1>
      <div className="grid gap-8">
        <SpecificationInput />
      </div>
    </div>
  );
}