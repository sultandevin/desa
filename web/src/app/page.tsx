import Container from "@/components/container";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        <Container>
          <h1 className="text-center">
            Welcome to the <strong>Home Page </strong>
          </h1>
        </Container>
      </main>
    </>
  );
}
