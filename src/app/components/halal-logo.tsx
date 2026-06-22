import { Compass } from "lucide-react";

export function HalalLogo({ className = "", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center bg-emerald-600 rounded-lg p-1.5">
        <Compass className="text-white size-5" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-bold text-emerald-700 ${textClassName}`}>GoSafar Thailand</span>
        <span className="text-[10px] text-muted-foreground tracking-wide">Trusted Travel Information for Thailand</span>
      </div>
    </div>
  );
}
