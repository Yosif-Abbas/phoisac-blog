import { logoutServerAction } from "@/actions/auth-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLogout() {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => logoutServerAction(),

    onSuccess: () => {
      queryClient.clear();
      toast.success("تم تسجيل الخروج");
    },

    onError: (error: any) => {
      // 1. Check if the error is actually a Next.js redirect
      if (error.message === "NEXT_REDIRECT") {
        return; // Do nothing, let Next.js handle the redirect
      }

      // 2. Real errors still get toasted
      console.error("Logout error:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    },
  });

  return { logout, isPending };
}
