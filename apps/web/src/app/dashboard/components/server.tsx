import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from "@/utils/orpc";

const Server = async () => {
  const assets = await client.asset.list({ pageSize: 1 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${!assets ? "bg-red-500" : "bg-green-500"}`}
          />
          Server Side
        </CardTitle>
        <CardDescription>
          Fetching data dari server component via oRPC
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        {assets && assets.data.length > 0 && (
          <p>Found: {assets.data[0]?.name}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Server;
