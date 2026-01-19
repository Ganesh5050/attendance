import { useMemo } from "react";
import { Calendar, User, Users, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AttendanceRecord, Trainer, Group } from "@/lib/storage";

interface TrainerAttendanceProps {
    courtId: string;
    attendanceRecords: AttendanceRecord[];
    trainers: Trainer[];
    groups: Group[];
}

export function TrainerAttendance({
    courtId,
    attendanceRecords,
    trainers,
    groups,
}: TrainerAttendanceProps) {
    // Filter records for this court and sort by date (newest first)
    const courtRecords = useMemo(() => {
        return attendanceRecords
            .filter(r => r.courtId === courtId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [attendanceRecords, courtId]);

    const getGroupName = (groupId: string) => {
        if (groupId === "others") return "Others (Event)";
        return groups.find(g => g.id === groupId)?.name || groupId;
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                    Trainer Attendance History
                </h2>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {courtRecords.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No attendance records yet</p>
                        <p className="text-sm">Records will appear here once trainers mark attendance</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {courtRecords.map((record) => (
                            <div
                                key={record.id}
                                className="p-4 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">
                                                {format(parseISO(record.date), "EEEE, MMM d, yyyy")}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <User className="h-4 w-4" />
                                            <span>Marked by: <span className="font-medium text-foreground">{record.trainerName}</span></span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Users className="h-4 w-4" />
                                            <span>Group: <span className="font-medium text-foreground">{getGroupName(record.groupId)}</span></span>
                                        </div>

                                        {record.eventName && (
                                            <div className="text-sm text-muted-foreground">
                                                Event: <span className="font-medium text-foreground">{record.eventName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-success mb-1">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm font-semibold">
                                                {record.presentStudentIds.length}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            students present
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {courtRecords.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="text-2xl font-bold text-foreground">
                            {courtRecords.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="text-2xl font-bold text-foreground">
                            {new Set(courtRecords.map(r => r.trainerId)).size}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Trainers</div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/30 sm:col-span-1 col-span-2">
                        <div className="text-2xl font-bold text-foreground">
                            {Math.round(
                                courtRecords.reduce((sum, r) => sum + r.presentStudentIds.length, 0) /
                                courtRecords.length
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg. Attendance</div>
                    </div>
                </div>
            )}
        </div>
    );
}
