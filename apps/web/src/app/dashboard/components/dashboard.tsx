import { cn } from "@/lib/utils";

const Dashboard = (props: {
  className?: string;
  children: React.ReactNode;
}) => (
  <main className={cn("flex flex-col gap-4 py-4", props.className)}>
    {props.children}
  </main>
);

const DashboardHeader = (props: {
  className?: string;
  children: React.ReactNode;
}) => (
  <header className={cn("flex flex-col gap-2", props.className)}>
    {props.children}
  </header>
);

const DashboardTitle = (props: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h1 className={cn("font-medium text-2xl", props.className)}>
    {props.children}
  </h1>
);

const DashboardDescription = (props: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p className={cn("text-muted-foreground", props.className)}>
    {props.children}
  </p>
);

const DashboardSection = (props: {
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={cn(
      "flex flex-col gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card",
      props.className,
    )}
  >
    {props.children}
  </section>
);

export {
  Dashboard,
  DashboardHeader,
  DashboardTitle,
  DashboardDescription,
  DashboardSection,
};
