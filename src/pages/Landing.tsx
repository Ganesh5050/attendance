import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Shield } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <ClipboardCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            Attendance
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple. Efficient. Reliable.
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <ActionCard
            title="Attendance"
            description="Mark attendance for your group"
            icon={ClipboardCheck}
            variant="primary"
            onClick={() => navigate("/passcode/attendance")}
          />

          <ActionCard
            title="Admin"
            description="Manage students and view reports"
            icon={Shield}
            variant="secondary"
            onClick={() => navigate("/passcode/admin")}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Internal Management System
        </p>
      </div>
    </div>
  );
}
