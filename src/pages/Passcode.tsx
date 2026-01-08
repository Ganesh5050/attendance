import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

export default function Passcode() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: "attendance" | "admin" }>();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "attendance") {
      if (passcode === "1234") {
        navigate("/attendance");
      } else {
        setError("Invalid passcode (Try: 1234)");
      }
    } else {
      if (passcode === "0000") {
        navigate("/admin");
      } else {
        setError("Invalid passcode (Try: 0000)");
      }
    }
  };

  const title = type === "attendance" ? "Trainer Access" : "Admin Access";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4">
        <button
          onClick={() => navigate("/")}
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
              Enter your passcode to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                className="input-field text-center text-2xl tracking-[0.5em] font-medium"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-destructive text-center animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Continue
            </button>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Contact administrator if you forgot your passcode
          </p>
        </div>
      </div>
    </div>
  );
}
