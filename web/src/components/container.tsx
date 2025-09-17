import { cn } from "@/lib/utils";

const Container = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<section
			className={cn(
				`mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 sm:px-8`,
				className
			)}>
			{children}
		</section>
	);
};

export default Container;
