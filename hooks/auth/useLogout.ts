import { logout as logoutAPI } from "@/services/client/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLogout() {
  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => logoutAPI(),

    onSuccess: () => {
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
