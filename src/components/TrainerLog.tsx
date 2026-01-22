import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Clock, User, Users, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { storage } from "@/lib/storage";

interface TrainerLogEntry {
    id: string;
    trainerName: string;
    batchName: string;
    submittedAt: string; // ISO String
    presentStudents: string[]; // Names of present students
    totalStudents: number;
    date: string;
}

export function TrainerLog() {
    const [entries, setEntries] = useState<TrainerLogEntry[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            setIsLoading(true);
            try {
                // Fetch Data
                const allRecords = await storage.getAttendance();
                const allStudents = await storage.getStudents();

                // Group Configs to look up batch names if needed
                const allGroups = storage.getGroups(); // Sync, but need courtId?
                // Actually storage.getGroups requires courtId. 
                // We can infer batch name from courtId + groupId mapping or just use groupId if not found.
                // Better approach: Iterate all courts to build a group map
                const groupMap: Record<string, string> = {};
                ["court-1", "court-2", "court-3", "court-4", "court-5"].forEach(court => {
                    const groups = storage.getGroups(court);
                    groups.forEach(g => {
                        groupMap[g.id] = g.name;
                    });
                });

                const loadedEntries: TrainerLogEntry[] = allRecords.map(record => {
                    // Get Names of Present Students
                    const presentNames = allStudents
                        .filter(s => record.presentStudentIds.includes(s.id))
                        .map(s => s.name);

                    // We might not have names if students were deleted, so fall back to ID if name missing
                    // or filter them out.
                    const finalPresentNames = presentNames.length > 0 ? presentNames : record.presentStudentIds;

                    // Calculate Total Students for this batch at that time (approximate based on current students)
                    // Or if it's 'others', it's flexible.
                    let total = 0;
                    if (record.groupId === 'others') {
                        total = record.presentStudentIds.length; // 100% for events
                    } else {
                        // Count current students in this group
                        total = allStudents.filter(s => s.groupId === record.groupId).length;
                        // Avoid >100% if students moved groups
                        if (total < record.presentStudentIds.length) total = record.presentStudentIds.length;
                    }

                    return {
                        id: record.id,
                        trainerName: record.trainerName,
                        batchName: record.eventName || groupMap[record.groupId] || "Unknown Batch",
                        submittedAt: record.date, // We treat date as submission time as we don't store exact timestamp yet, or use CreatedAt if available? 
                        // Note: Our Appwrite Record has 'date' string (YYYY-MM-DD). 
                        // We don't have exact time. We'll verify this.
                        presentStudents: finalPresentNames,
                        totalStudents: total,
                        date: record.date
                    };
                });

                setEntries(loadedEntries);
            } catch (error) {
                console.error("Failed to load trainer logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLogs();
        const interval = setInterval(loadLogs, 10000); // Auto refresh
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading && entries.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">Loading logs...</div>;
    }

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
                {entries.map((entry) => {
                    const isExpanded = expandedId === entry.id;
                    const attendanceRate = entry.totalStudents > 0
                        ? Math.round((entry.presentStudents.length / entry.totalStudents) * 100)
                        : 0;

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
                                                    {entry.date}
                                                    {/* We only have date, not time, unless we add createdAt to record model */}
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

            {/* Empty State */}
            {!isLoading && entries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance submissions yet</p>
                </div>
            )}
        </div>
    );
}
