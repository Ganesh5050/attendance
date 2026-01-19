import { useState, useMemo } from "react";
import { Calendar, Users, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Group, Student, AttendanceRecord } from "@/lib/storage";

interface DailyAttendanceReportProps {
    courtId: string;
    students: Student[];
    attendanceRecords: AttendanceRecord[];
    groups: Group[];
}

export function DailyAttendanceReport({
    courtId,
    students,
    attendanceRecords,
    groups
}: DailyAttendanceReportProps) {
    const [reportDate, setReportDate] = useState<Date>(new Date());
    const [reportGroupId, setReportGroupId] = useState<string>("all");

    // Get attendance record for selected date and group
    const dailyReport = useMemo(() => {
        const dateStr = format(reportDate, "yyyy-MM-dd");

        // Filter students by group
        const groupStudents = reportGroupId === "all"
            ? students
            : students.filter(s => s.groupId === reportGroupId);

        // Find attendance records for this date
        const dayRecords = attendanceRecords.filter(r => r.date === dateStr);

        // Separate present and absent students
        const present: Student[] = [];
        const absent: Student[] = [];

        groupStudents.forEach(student => {
            // Check if student was marked present in any record for this date
            const wasPresent = dayRecords.some(record =>
                record.presentStudentIds.includes(student.id) &&
                (reportGroupId === "all" || record.groupId === reportGroupId)
            );

            if (wasPresent) {
                present.push(student);
            } else {
                absent.push(student);
            }
        });

        // Sort alphabetically
        present.sort((a, b) => a.name.localeCompare(b.name));
        absent.sort((a, b) => a.name.localeCompare(b.name));

        return {
            present,
            absent,
            total: groupStudents.length,
            attendanceRate: groupStudents.length > 0
                ? (present.length / groupStudents.length) * 100
                : 0,
            hasRecord: dayRecords.length > 0
        };
    }, [reportDate, reportGroupId, students, attendanceRecords]);

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                    Daily Attendance Report
                </h2>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Date Picker */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Select Date
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="dropdown-trigger w-full">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{format(reportDate, "PPP")}</span>
                                </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={reportDate}
                                onSelect={(date) => date && setReportDate(date)}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Group Filter */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Group
                    </label>
                    <Select value={reportGroupId} onValueChange={setReportGroupId}>
                        <SelectTrigger className="dropdown-trigger">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            <SelectItem value="all">All Groups</SelectItem>
                            {groups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="others">Others (Events)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Report Card */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Header */}
                <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                {format(reportDate, "EEEE, MMMM d, yyyy")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {reportGroupId === "all"
                                    ? "All Groups"
                                    : groups.find(g => g.id === reportGroupId)?.name || "Others"}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                                {dailyReport.attendanceRate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Attendance Rate</div>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {!dailyReport.hasRecord && (
                    <div className="px-6 py-4 bg-muted/20 border-b border-border/30">
                        <p className="text-sm text-muted-foreground text-center">
                            ⚠️ No attendance record found for this date
                        </p>
                    </div>
                )}

                {/* Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Present Students */}
                    <div className="p-6 border-r border-border/30">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                            <h4 className="font-semibold text-foreground">
                                Present ({dailyReport.present.length})
                            </h4>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {dailyReport.present.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No students present
                                </p>
                            ) : (
                                dailyReport.present.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success text-sm font-medium">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-foreground">{student.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Absent Students */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle className="h-5 w-5 text-destructive" />
                            <h4 className="font-semibold text-foreground">
                                Absent ({dailyReport.absent.length})
                            </h4>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {dailyReport.absent.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    All students present! 🎉
                                </p>
                            ) : (
                                dailyReport.absent.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-foreground">{student.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
