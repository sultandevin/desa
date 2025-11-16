import { LoaderCircle } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex min-h-[60vh] animate-pulse flex-col items-center justify-center gap-6 *:text-neutral-500">
      <h2 className="text-center font-bold text-2xl">Memasak nasi custom...</h2>
      <LoaderCircle className="size-10 animate-spin" />
    </div>
  );
};

export default LoadingPage;
