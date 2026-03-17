import PostForm from "@/components/ui/dashboard/PostForm";

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl">لوحة تحكم المسؤول</h1>
      <h2 className="mt-4">اكتب منشور</h2>
      <PostForm />
    </div>
  );
}
