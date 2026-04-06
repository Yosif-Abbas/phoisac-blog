import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryClientUser } from "@/services/server/auth";
import Header from "./ui/navbar/Header";
import Footer from "./ui/Footer";
import AdminSidebar from "./ui/dashboard/AdminSidebar";
import AdminActions from "./ui/dashboard/AdminActions";

export default async function ServerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // 1. Fetch the user securely on the server
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getQueryClientUser,
  });

  // 2. Determine role based on the fetched data
  const user = queryClient.getQueryData(["user"]);
  const isAdmin = user?.role === "admin";

  console.log(isAdmin);

  return (
    // 3. Pass the fetched server data to the client-side TanStack hooks
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        <Header />

        <div className="grow w-full max-w-[1440px] mx-auto py-8 flex flex-col">
          <div className="grow grid lg:grid-cols-[225px_1fr_225px] gap-x-6 gap-y-2">
            {/* The server decides what layout blocks to send */}
            {isAdmin ? <AdminSidebar /> : <div />}

            <main className="grow flex flex-col w-full panel">{children}</main>

            {isAdmin ? (
                <AdminActions />
            ) : (
              <div />
            )}
          </div>
        </div>

        <Footer />
      </div>
    </HydrationBoundary>
  );
}
