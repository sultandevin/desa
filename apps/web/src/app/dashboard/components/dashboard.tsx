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
  <h1 className={cn("text-2xl font-bold", props.className)}>
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
      "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card flex flex-col gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs",
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
