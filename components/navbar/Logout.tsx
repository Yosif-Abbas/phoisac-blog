import { useLogout } from "@/hooks/auth/useLogout";
import { LogOut, Loader2 } from "lucide-react";

export default function Logout() {
  const { logout, isPending } = useLogout();

  return (
    <button
      onClick={() => logout()}
      disabled={isPending}
      className="group text-sm flex items-center gap-x-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <LogOut
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
      )}
      <span>تسجيل الخروج</span>
    </button>
  );
}
