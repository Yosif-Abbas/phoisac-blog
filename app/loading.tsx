import Spinner from "@/components/ui/Spinner";

export default function loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  );
}
