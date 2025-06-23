import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="relative h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    </div>
  );
}
