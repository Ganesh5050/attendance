import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  variant = "primary",
  onClick,
  className,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        variant === "primary" ? "action-card-primary" : "action-card-secondary",
        "w-full text-left",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            variant === "primary"
              ? "bg-primary-foreground/10"
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-7 w-7",
              variant === "primary" ? "text-primary-foreground" : "text-primary"
            )}
          />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p
              className={cn(
                "mt-1 text-sm",
                variant === "primary"
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
