export default function AdminBadge() {
  return (
    <div className="flex items-center gap-x-2 w-fit px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-500">
        وضع المسؤول
      </span>
    </div>
  );
}
