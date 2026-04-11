import { TagIcon } from "lucide-react";
import EditTagModal from "../../Modal/EditTagModal";
import type { Tag } from "@/types/cms";
import DeleteTagModal from "../../Modal/DeleteTagModal";

export default function TagCard({ tag }: { tag: Tag }) {
  const { count, name } = tag;
  const countNum = count ?? 0;

  return (
    <div className="group flex items-center justify-between p-4 bg-container border border-card-hover rounded-2xl hover:border-primary/50 transition-all">
      <div className="flex items-center gap-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TagIcon size={18} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground text-nowrap">{name}</span>
          <span className="text-xs text-muted-foreground text-nowrap">
            {countNum}{" "}
            {(countNum > 1 && countNum < 11) || countNum === 0
              ? "منشورات"
              : "منشور"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-1 ">
        <EditTagModal tag={tag} title="تعديل الوسم" />
        <DeleteTagModal tag={tag} title="حذف الوسم" />
      </div>
    </div>
  );
}
