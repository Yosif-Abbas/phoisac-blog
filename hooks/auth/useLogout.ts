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

      window.location.href = "/";
    },

    onError: (error: any) => {
      console.error("Logout error:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    },
  });

  return { logout, isPending };
}
