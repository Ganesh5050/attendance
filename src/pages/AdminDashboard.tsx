import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Users, UserPlus, UserMinus, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StudentDetailModal } from "@/components/StudentDetailModal";
import { AddStudentModal } from "@/components/AddStudentModal";
import { RemoveStudentModal } from "@/components/RemoveStudentModal";
import { DailyAttendanceReport } from "@/components/DailyAttendanceReport";
import { TrainerManagement } from "@/components/TrainerManagement";
import { TrainerAttendance } from "@/components/TrainerAttendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isSameMonth, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { storage, Group, Student, AttendanceRecord, Trainer, getCourtName } from "@/lib/storage";

// Extended student type for display
interface StudentStats extends Student {
  sessionsAttended: number;
  sessionsMissed: number;
  totalSessions: number;
}

type AdminTab = "trainers" | "trainer-attendance" | "students";

export default function AdminDashboard() {
  const { courtId } = useParams<{ courtId: string }>();
  const [activeTab, setActiveTab] = useState<AdminTab>("students");

  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Load Data
  const loadData = () => {
    setGroups(storage.getGroups());
    setStudents(storage.getStudents());
    setAttendanceRecords(storage.getAttendance());
    setTrainers(storage.getTrainers());
  };

  useEffect(() => {
    loadData();
    // Refresh interval to catch updates from other tabs/sessions
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate Stats
  const studentStats: StudentStats[] = useMemo(() => {
    // 1. Filter students by group
    const filteredStudents = selectedGroupId === "all"
      ? students
      : students.filter(s => s.groupId === selectedGroupId);

    // Sort Alphabetically
    filteredStudents.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Filter attendance records by month
    const monthRecords = attendanceRecords.filter(r =>
      isSameMonth(parseISO(r.date), selectedDate)
    );

    // 3. Map stats
    return filteredStudents.map(student => {
      // Find all sessions relevant to this student's group
      const groupSessions = monthRecords.filter(r => r.groupId === student.groupId);

      const attendedCount = groupSessions.filter(r =>
        r.presentStudentIds.includes(student.id)
      ).length;

      const totalSessions = groupSessions.length;

      return {
        ...student,
        sessionsAttended: attendedCount,
        sessionsMissed: totalSessions - attendedCount,
        totalSessions: totalSessions
      };
    });
  }, [students, attendanceRecords, selectedGroupId, selectedDate]);

  const totalStudents = studentStats.length;
  const avgAttendance = totalStudents > 0
    ? studentStats.reduce((acc, s) => {
      const p = s.totalSessions > 0 ? (s.sessionsAttended / s.totalSessions) * 100 : 0;
      return acc + p;
    }, 0) / totalStudents
    : 0;

  // Actions
  const handleAddStudent = (name: string, groupId: string) => {
    const newStudent = {
      id: crypto.randomUUID().slice(0, 8),
      name,
      groupId
    };
    storage.saveStudent(newStudent);
    toast.success(`Added ${name}`);
    setIsAddModalOpen(false);
    loadData();
  };

  const handleRemoveStudent = (studentId: string) => {
    storage.deleteStudent(studentId);
    toast.success("Student removed");
    setIsRemoveModalOpen(false);
    // If detail modal was open for this student, close it
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }
    loadData();
  };

  // Trainer Actions
  const handleAddTrainer = (name: string, passcode: string) => {
    const newTrainer = {
      id: crypto.randomUUID().slice(0, 8),
      name,
      courtId: courtId || "",
      passcode,
    };
    storage.saveTrainer(newTrainer);
    toast.success(`Added trainer: ${name}`);
    loadData();
  };

  const handleRemoveTrainer = (trainerId: string) => {
    storage.deleteTrainer(trainerId);
    toast.success("Trainer removed");
    loadData();
  };

  const handleUpdatePasscode = (trainerId: string, newPasscode: string) => {
    storage.updateTrainer(trainerId, { passcode: newPasscode });
    toast.success("Passcode updated");
    loadData();
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header
        title={`Admin - ${getCourtName(courtId || "")}`}
        showBack
        backTo="/admin"
      />

      <div className="container max-w-2xl mx-auto px-4 py-6 animate-slide-up">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-xl border border-border/30">
          <button
            onClick={() => setActiveTab("students")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "students"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("trainer-attendance")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "trainer-attendance"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Attendance Log
          </button>
          <button
            onClick={() => setActiveTab("trainers")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "trainers"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Trainers
          </button>
        </div>

        {/* Students Tab */}
        {activeTab === "students" && (
          <div>
            {/* Filter Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Group Selector */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Group
                </label>
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
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
                  </SelectContent>
                </Select>
              </div>

              {/* Month Picker */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Month
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="dropdown-trigger w-full">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(selectedDate, "MMMM yyyy")}</span>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Student Management Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Student Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-card border border-border/50 text-foreground font-medium transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
                >
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span>Add Student</span>
                </button>
                <button
                  onClick={() => setIsRemoveModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-card border border-border/50 text-foreground font-medium transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
                >
                  <UserMinus className="h-5 w-5 text-muted-foreground" />
                  <span>Remove Student</span>
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard
                label="Total Students"
                value={totalStudents}
                icon={Users}
              />
              <StatCard
                label="Avg. Attendance"
                value={`${isNaN(avgAttendance) ? 0 : avgAttendance.toFixed(0)}%`}
                trend={avgAttendance >= 80 ? "up" : avgAttendance >= 50 ? "neutral" : "down"}
              />
            </div>

            {/* Daily Attendance Report */}
            <DailyAttendanceReport
              courtId={courtId || ""}
              students={students}
              attendanceRecords={attendanceRecords}
              groups={groups}
            />

            {/* Attendance Overview Table */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Attendance Overview
              </h2>

              {studentStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students found.</p>
              ) : (
                <>
                  {/* Mobile: Card View */}
                  <div className="space-y-3 sm:hidden">
                    {studentStats.map((student, index) => {
                      const percentage = student.totalSessions > 0 ? (student.sessionsAttended / student.totalSessions) * 100 : 0;
                      return (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className="w-full text-left p-4 rounded-xl bg-card border border-border/50 transition-all hover:border-primary/30 hover:shadow-md animate-slide-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {student.sessionsAttended} / {student.totalSessions} sessions
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <ProgressBar value={percentage} showLabel={false} size="sm" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop: Table View */}
                  <div className="hidden sm:block overflow-hidden rounded-xl border border-border/50 bg-card">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Student
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                            Attended
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                            Missed
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentStats.map((student, index) => {
                          const percentage = student.totalSessions > 0 ? (student.sessionsAttended / student.totalSessions) * 100 : 0;
                          return (
                            <tr
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className="border-b border-border/30 last:border-0 cursor-pointer transition-colors hover:bg-muted/30"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    {student.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-foreground">
                                    {student.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center text-foreground">
                                {student.sessionsAttended}
                              </td>
                              <td className="px-4 py-4 text-center text-foreground">
                                {student.sessionsMissed}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-3">
                                  <div className="w-20">
                                    <ProgressBar value={percentage} showLabel={false} size="sm" />
                                  </div>
                                  <span className={cn(
                                    "text-sm font-medium w-12 text-right",
                                    percentage >= 80 && "text-success",
                                    percentage < 80 && percentage >= 50 && "text-warning",
                                    percentage < 50 && "text-destructive"
                                  )}>
                                    {percentage.toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Trainer Attendance Tab */}
        {activeTab === "trainer-attendance" && (
          <TrainerAttendance
            courtId={courtId || ""}
            attendanceRecords={attendanceRecords}
            trainers={trainers}
            groups={groups}
          />
        )}

        {/* Trainers Tab */}
        {activeTab === "trainers" && (
          <TrainerManagement
            trainers={trainers}
            courtId={courtId || ""}
            onAddTrainer={handleAddTrainer}
            onRemoveTrainer={handleRemoveTrainer}
            onUpdatePasscode={handleUpdatePasscode}
          />
        )}

      </div>

      {/* Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
        groups={groups}
      />

      {/* Remove Student Modal */}
      <RemoveStudentModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onRemove={handleRemoveStudent}
        groups={groups}
        students={students}
      />
    </div>
  );
}
