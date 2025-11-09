import Loader from "@/components/loader";

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="font-bold text-center text-2xl">Memasak nasi custom...</h2>
      <Loader />
    </div>
  );
};

export default LoadingPage;
