import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="border-b border-accent">
      <Container className="h-16 py-0 flex-row items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold">kopassus</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={"#"}>Get Started</Link>
          </Button>

          <ModeToggle />
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
