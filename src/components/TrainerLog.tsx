import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, User, Users, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TrainerLogEntry {
    id: string;
    trainerName: string;
    batchName: string;
    submittedAt: string;
    presentStudents: string[];
    totalStudents: number;
    date: string;
}

// Mock data for demonstration (empty until Firebase integration)
const MOCK_ENTRIES: TrainerLogEntry[] = [
    // Will be populated from Firebase when connected
];

export function TrainerLog() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Trainer Log</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        View all attendance submissions by trainers
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {MOCK_ENTRIES.map((entry) => {
                    const isExpanded = expandedId === entry.id;
                    const attendanceRate = Math.round((entry.presentStudents.length / entry.totalStudents) * 100);

                    return (
                        <div
                            key={entry.id}
                            className="border-2 border-border rounded-xl bg-card overflow-hidden transition-all hover:shadow-md"
                        >
                            {/* Header - Always Visible */}
                            <button
                                onClick={() => toggleExpand(entry.id)}
                                className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        {/* Trainer Name */}
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="font-semibold text-foreground">{entry.trainerName}</span>
                                        </div>

                                        {/* Batch Name */}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{entry.batchName}</span>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {format(new Date(entry.submittedAt), "h:mm a")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="font-medium text-foreground">
                                                    {entry.presentStudents.length}/{entry.totalStudents}
                                                </span>
                                                <span className="text-muted-foreground">present</span>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${attendanceRate >= 70 ? 'bg-green-500/10 text-green-600' :
                                                attendanceRate >= 50 ? 'bg-yellow-500/10 text-yellow-600' :
                                                    'bg-red-500/10 text-red-600'
                                                }`}>
                                                {attendanceRate}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="flex-shrink-0">
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Content - Student List */}
                            {isExpanded && (
                                <div className="border-t border-border bg-muted/30 p-4">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">
                                        Students Present ({entry.presentStudents.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {entry.presentStudents.map((studentName, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border"
                                            >
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-primary">
                                                        {studentName.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-foreground">{studentName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State (hidden when there are entries) */}
            {MOCK_ENTRIES.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance submissions yet</p>
                </div>
            )}
        </div>
    );
}
