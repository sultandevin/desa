import { authClient } from "@/lib/auth-client";
import type { auth } from "@desa/auth";

export default function Dashboard({
	session,
}: {
	session: typeof auth.$Infer.Session;
}) {
	return <></>;
}
