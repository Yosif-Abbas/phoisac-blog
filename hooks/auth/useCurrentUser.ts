import { useQuery } from "@tanstack/react-query";
// Import a client-side version of your fetcher
import { getClientUser } from "@/services/client/auth";

export function useCurrentUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getClientUser, // This only runs if the server-side data is missing/stale
    staleTime: 1000 * 60 * 5, // Keep the user data for 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    // Use the role from your 'users' table
    isAdmin: user?.role === "admin",
  };
}
