import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { storage, getCourtName } from "@/lib/storage";
import { toast } from "sonner";

export default function Passcode() {
  const navigate = useNavigate();
  const { type: typeParam, courtId } = useParams<{ type: "attendance" | "admin"; courtId?: string }>();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  // Detect type from URL if param is undefined
  const location = window.location.pathname;
  const type = typeParam || (location.includes('/admin') ? 'admin' : 'attendance');

  const handleContinue = () => {
    if (type === "attendance" && courtId) {
      const trainer = storage.validateTrainer(courtId, passcode);

      if (trainer) {
        sessionStorage.setItem("currentTrainer", JSON.stringify(trainer));
        toast.success(`Welcome, ${trainer.name}!`);
        // Use window.location instead of navigate
        navigate(`/attendance/${courtId}`);
      } else {
        setError(`Invalid trainer passcode`);
        toast.error("Invalid passcode");
      }
    } else if (type === "admin") {
      if (passcode === storage.PASSCODES.ADMIN) {
        toast.success("Admin access granted!");
        navigate("/admin");
      } else {
        setError("Invalid admin passcode");
        toast.error("Invalid admin passcode");
      }
    }
  };

  const title = type === "attendance" ? "Trainer Access" : "Admin Access";
  const subtitle = type === "attendance" && courtId
    ? getCourtName(courtId)
    : "Universal Access";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4">
        <button
          onClick={() => navigate(type === "attendance" ? "/court-selection/attendance" : "/")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border/50 transition-all hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 animate-fade-in">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Input */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Enter Passcode
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={passcode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPasscode(value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleContinue();
                  }
                }}
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0000"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive mt-2 animate-shake">
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleContinue();
              }}
              onClick={(e) => {
                e.preventDefault();
                handleContinue();
              }}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
