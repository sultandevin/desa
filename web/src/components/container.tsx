import { cn } from "@/lib/utils";

const Container = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 sm:px-8`,
        className,
      )}
    >
      {children}
    </div>
  );
};

const useContainerStyles = () => {
  return `mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 sm:px-8`;
};

export { useContainerStyles };

export default Container;
