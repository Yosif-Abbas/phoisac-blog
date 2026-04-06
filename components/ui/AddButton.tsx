import { MouseEvent } from "react";
import { Plus } from "lucide-react";

interface ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function AddButton({ onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center overflow-hidden rounded-e-[3px] text-primary-foreground transition-all duration-150 active:scale-[0.98] h-6 w-fit"
    >
      {/* main button */}
      <div className="bg-primary hover:bg-primary-hover h-full px-3 text-sm font-semibold tracking-wide transition-colors duration-150">
        إضافة
      </div>

      {/* left darker section */}
      <div className="bg-primary-active px-1 flex items-center justify-center h-full">
        <span className="">
          <Plus size={12} />
        </span>
      </div>

      {/* subtle bottom shadow */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 pointer-events-none" />
    </button>
  );
}
