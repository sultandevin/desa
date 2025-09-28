import { ModeToggle } from "@/app/components/theme-toggle";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardNavbar = () => {
  return (
    <nav className="border-b border-accent">
      <Container className="h-16 py-0 flex-row items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold">desa kopassus!</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={"/account"}>Account</Link>
          </Button>

          <ModeToggle />
        </div>
      </Container>
    </nav>
  );
};

export default DashboardNavbar;
