import { CirclePlus, Pencil, Plus, Tags } from "lucide-react";

export default async function Dashboard() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full pb-10">
      {/* 1. Header Section */}
      <div className="flex items-baseline justify-between border-b border-[#1F2937] pb-6">
        <div className="flex items-baseline gap-x-2">
          <h1 className="text-3xl font-bold text-foreground">
            لوحة تحكم المسؤول
          </h1>
          <span className="text-lg text-muted-foreground">/ الرئيسية</span>
        </div>
      </div>

      {/* 2. The Hero / Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-[#1F2937] flex flex-col justify-center gap-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            ابدأ بكتابة قصيدة جديدة اليوم
          </h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            لديك حالياً 12 منشوراً منشوراً و 3 مسودات تنتظر اللمسات الأخيرة.
          </p>
          <button className="mt-2 w-fit px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-x-2">
            <span>اكتب الآن</span>
            <Plus size={18} />
          </button>
        </div>

        {/* Small Stat Cards */}
        <div className="flex flex-col gap-y-4">
          <StatCard label="إجمالي المشاهدات" value="1.2k" />
          <StatCard label="التعليقات الجديدة" value="5" />
        </div>
      </section>

      {/* 3. Latest Activities Timeline */}
      <section className="flex flex-col gap-y-6">
        <h3 className="text-xl font-bold">آخر النشاطات</h3>
        <div className="flex flex-col gap-y-2">
          <ActivityItem type="create" title="نثر الخريف" time="منذ ساعتين" />
          <ActivityItem
            type="edit"
            title="في زحام المدينة"
            time="منذ 5 ساعات"
          />
          <ActivityItem
            type="tag"
            title="أضفت وسم جديد: فلسفة"
            time="يوم أمس"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-2xl bg-container border border-[#1F2937] flex flex-col gap-y-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-3xl font-bold text-foreground">{value}</span>
    </div>
  );
}

function ActivityItem({
  type,
  title,
  time,
}: {
  type: "create" | "edit" | "tag";
  title: string;
  time: string;
}) {
  const icons = {
    create: <CirclePlus className="text-emerald-500" size={18} />,
    edit: <Pencil className="text-blue-400" size={18} />,
    tag: <Tags className="text-purple-400" size={18} />,
  };

  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-[#1F2937] hover:bg-white/[0.07] transition-all cursor-default">
      <div className="flex items-center gap-x-4">
        <div className="p-2 rounded-lg bg-background border border-[#1F2937]">
          {icons[type]}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs text-primary font-medium hover:underline transition-all">
        عرض التفاصيل
      </button>
    </div>
  );
}
