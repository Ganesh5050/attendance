import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface StudentCardProps {
  name: string;
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;
  showCheckbox?: boolean;
  className?: string;
}

export function StudentCard({
  name,
  id,
  checked = false,
  onCheckedChange,
  onClick,
  showCheckbox = true,
  className,
}: StudentCardProps) {
  return (
    <div
      className={cn(
        "student-card",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>
      </div>
      {showCheckbox && (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="h-6 w-6 rounded-lg border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
