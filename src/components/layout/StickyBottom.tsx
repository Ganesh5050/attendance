import { cn } from "@/lib/utils";

interface StickyBottomProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyBottom({ children, className }: StickyBottomProps) {
  return (
    <div className={cn("sticky-bottom", className)}>
      <div className="container max-w-lg mx-auto">{children}</div>
    </div>
  );
}
