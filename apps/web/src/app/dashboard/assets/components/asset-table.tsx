import { client } from "@/utils/orpc";
import { DashboardSection } from "../../components/dashboard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AssetTable = async () => {
  const assets = await client.asset.list();

  return (
    <DashboardSection className="grid grid-cols-4">
      {assets.map((asset) => (
        <Card key={asset.id}>
          <CardHeader>
            <CardTitle>{asset.name}</CardTitle>
            <CardDescription>{JSON.stringify(asset.createdAt)}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </DashboardSection>
  );
};

export default AssetTable;
