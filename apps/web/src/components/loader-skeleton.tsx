import { Skeleton } from "./ui/skeleton";

export default function LoaderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}
