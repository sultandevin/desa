import Container from "@/components/container";
import DashboardNavbar from "./components/navbar";
import DashboardSidebar from "./components/sidebar";

const DashboardLayout = (props: { children: React.ReactNode }) => (
  <>
    <DashboardNavbar />
    <Container className="flex-row">
      <DashboardSidebar />
      {props.children}
    </Container>
  </>
);

export default DashboardLayout;
