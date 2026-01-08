import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  className?: string;
  rightElement?: React.ReactNode;
}

export function Header({
  title,
  showBack = false,
  backTo,
  className,
  rightElement,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between bg-background/80 backdrop-blur-lg px-4 py-4 border-b border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border/50 transition-all hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
}
