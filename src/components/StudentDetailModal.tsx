import { useState, useMemo } from "react";
import { X, Calendar, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { storage } from "@/lib/storage";
import { isSameWeek, isSameMonth, parseISO } from "date-fns";

interface StudentDetailModalProps {
  student: {
    id: string;
    name: string;
    groupId: string;
  };
  onClose: () => void;
}

type TimeRange = "week" | "month" | "all";

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const stats = useMemo(() => {
    const allRecords = storage.getAttendance();
    const now = new Date();

    // Filter records for this student's group
    // And also by time range
    const filteredRecords = allRecords.filter(r => {
      if (r.groupId !== student.groupId) return false;
      const recordDate = parseISO(r.date);

      if (timeRange === "week") {
        return isSameWeek(recordDate, now);
      }
      if (timeRange === "month") {
        return isSameMonth(recordDate, now);
      }
      return true; // defined by "all"
    });

    const total = filteredRecords.length;
    const attended = filteredRecords.filter(r => r.presentStudentIds.includes(student.id)).length;

    return {
      total,
      attended,
      missed: total - attended,
      percentage: total > 0 ? (attended / total) * 100 : 0
    };
  }, [student, timeRange]);


  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up shadow-soft-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-semibold">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{student.name}</h2>
              <p className="text-sm text-muted-foreground">ID: {student.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition-all hover:bg-muted/80"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTimeRange("week")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${timeRange === "week" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${timeRange === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${timeRange === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All Time
          </button>
        </div>

        {/* Progress */}
        <div className="bg-muted/50 rounded-2xl p-5 mb-6">
          <ProgressBar value={stats.percentage} size="lg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            label="Total Sessions"
            value={stats.total}
            icon={Calendar}
          />
          <StatCard
            label="Attended"
            value={stats.attended}
            icon={CheckCircle2}
          />
          <StatCard
            label="Missed"
            value={stats.missed}
            icon={XCircle}
          />
          <StatCard
            label="Rate"
            value={`${stats.percentage.toFixed(0)}%`}
            icon={TrendingUp}
            trend={stats.percentage >= 80 ? "up" : stats.percentage >= 50 ? "neutral" : "down"}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-muted text-foreground font-medium transition-all hover:bg-muted/80"
        >
          Close
        </button>
      </div>
    </div>
  );
}
