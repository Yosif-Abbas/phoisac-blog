import { getQueryClientUser } from "@/services/server/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import AdminSidebar from "./dashboard/AdminSidebar";
import AdminActions from "./dashboard/AdminActions";

// This component handles the user hydration for the admin UI
export default async function AdminShellPart({
  type,
}: {
  type: "sidebar" | "actions";
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getQueryClientUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {type === "sidebar" ? <AdminSidebar /> : <AdminActions />}
    </HydrationBoundary>
  );
}
