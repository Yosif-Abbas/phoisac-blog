import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col gap-y-2 items-center justify-center h-full my-auto">
      <div>
        <Spinner />
      </div>
      <span className="text-muted-foreground text-sm">Loading...</span>
    </div>
  );
}
