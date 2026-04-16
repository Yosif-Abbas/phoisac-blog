import { getServerUser } from "@/services/server/auth";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerUser();
  const isAdmin = user?.role === "admin" || user?.role === "developer";

  if (!isAdmin) notFound();

  return <div className="h-full w-full">{children}</div>;
}
