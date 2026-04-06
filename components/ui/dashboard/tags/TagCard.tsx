import { TagIcon } from "lucide-react";
import EditTagModal from "../../Modal/EditTagModal";
import { Tag } from "@/types/post";
import DeleteTagModal from "../../Modal/DeleteTagModal";

export default function TagCard({ tag }: { tag: Tag }) {
  const { count, name } = tag;

  return (
    <div className="group flex items-center justify-between p-4 bg-container border border-[#1F2937] rounded-2xl hover:border-primary/50 transition-all">
      <div className="flex items-center gap-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TagIcon size={18} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">
            {count}{" "}
            {(count > 1 && count < 11) || count === 0 ? "منشورات" : "منشور"}
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
