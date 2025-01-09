import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#101317]">
      <div className="flex flex-col space-y-3">
        <div className="flex space-x-4 items-center">
          <Skeleton className="h-12 w-12 rounded-full bg-[#16C784]/70" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-[#2ce69f]/60" />
            <Skeleton className="h-4 w-[200px] bg-[#20c686]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
