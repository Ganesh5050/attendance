import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getColor = () => {
    if (percentage >= 80) return "bg-success";
    if (percentage >= 50) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Attendance</span>
          <span className="font-medium text-foreground">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div
        className={cn(
          "progress-bar",
          size === "sm" && "h-1.5",
          size === "md" && "h-2",
          size === "lg" && "h-3"
        )}
      >
        <div
          className={cn("progress-fill", getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
