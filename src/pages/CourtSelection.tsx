import { useNavigate, useParams } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";

const COURTS = [
    { id: "court-1", name: "GKP Club", color: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50" },
    { id: "court-2", name: "Kalptaru Aura", color: "bg-green-500/10 border-green-500/30 hover:border-green-500/50" },
    { id: "court-3", name: "The Orchards", color: "bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50" },
    { id: "court-4", name: "The Address (Wadhwa)", color: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50" },
    { id: "court-5", name: "Aaradhya One MICL", color: "bg-pink-500/10 border-pink-500/30 hover:border-pink-500/50" },
];

export default function CourtSelection() {
    const navigate = useNavigate();
    const { type } = useParams<{ type: "attendance" | "admin" }>();
    const location = window.location.pathname;

    // Determine if this is admin mode
    const isAdmin = location.includes('/admin') || type === 'admin';

    const handleCourtSelect = (courtId: string) => {
        if (isAdmin) {
            // For admin: go directly to admin dashboard
            navigate(`/admin/${courtId}`);
        } else {
            // For trainers: go to passcode with court context
            navigate(`/passcode/attendance/${courtId}`);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header
                title={isAdmin ? "Select Court to Manage" : "Select Court"}
                showBack
                backTo={isAdmin ? "/" : "/"}
            />

            <div className="container max-w-lg mx-auto px-4 py-8">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Choose Your Court
                    </h2>
                    <p className="text-muted-foreground">
                        {isAdmin
                            ? "Select which court to manage"
                            : "Select the court you're assigned to"}
                    </p>
                </div>

                <div className="space-y-4">
                    {COURTS.map((court, index) => (
                        <button
                            key={court.id}
                            onClick={() => handleCourtSelect(court.id)}
                            className={`w-full p-6 rounded-2xl border-2 transition-all hover:shadow-lg active:scale-[0.98] animate-slide-up ${court.color}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card/50">
                                        <Building2 className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {court.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {isAdmin ? "Admin View" : "Trainer Access"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
