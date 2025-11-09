import { LoaderCircle } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col gap-6 min-h-[60vh] *:text-neutral-500 animate-pulse items-center justify-center">
      <h2 className="font-bold text-center text-2xl">Memasak nasi custom...</h2>
      <LoaderCircle className="animate-spin size-10" />
    </div>
  );
};

export default LoadingPage;
