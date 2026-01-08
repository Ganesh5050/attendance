import { useState, useEffect, useMemo } from "react";
import { Calendar, Users, Info, CheckCircle2, Search, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StickyBottom } from "@/components/layout/StickyBottom";
import { StudentCard } from "@/components/ui/StudentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, isMonday, isWednesday, isFriday } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { storage, Group, Student } from "@/lib/storage";

export default function AttendanceDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  // Lock date to today
  const [selectedDate] = useState<Date>(new Date());

  // "Others" specific state
  const [eventName, setEventName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedGroups = storage.getGroups();
    const loadedStudents = storage.getStudents();
    setGroups(loadedGroups);
    setStudents(loadedStudents);
    if (loadedGroups.length > 0) {
      setSelectedGroupId(loadedGroups[0].id);
    }
  }, []);

  // Filter & Sort students
  const filteredStudents = useMemo(() => {
    if (selectedGroupId === "others") {
      // Show ALL students, filtered by search query
      return students
        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Normal group behavior
    return students
      .filter((s) => s.groupId === selectedGroupId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedGroupId, searchQuery]);

  // Check if session is active
  const isSessionActive = useMemo(() => {
    if (selectedGroupId === "others") return true;

    // Regular groups restricted to Mon/Wed/Fri
    return isMonday(selectedDate) || isWednesday(selectedDate) || isFriday(selectedDate);
  }, [selectedDate, selectedGroupId]);

  // Load existing attendance if available
  useEffect(() => {
    if (!selectedGroupId) return;

    // Reset logic when switching groups
    setAttendance({});
    setEventName("");
    setSearchQuery("");

    const allRecords = storage.getAttendance();
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    // Find record
    const record = allRecords.find(
      (r) => r.groupId === selectedGroupId && r.date === dateStr
    );

    if (record) {
      const newAttendance: Record<string, boolean> = {};

      if (selectedGroupId === "others") {
        if (record.eventName) setEventName(record.eventName);
        // For 'others', check if student ID is in the list
        record.presentStudentIds.forEach(id => {
          newAttendance[id] = true;
        });
      } else {
        // Only mark if the student belongs to the current group list
        students.filter(s => s.groupId === selectedGroupId).forEach(s => {
          newAttendance[s.id] = record.presentStudentIds.includes(s.id);
        });
      }
      setAttendance(newAttendance);
    }
  }, [selectedGroupId, selectedDate, students]);

  const toggleAttendance = (studentId: string, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSubmit = () => {
    if (!isSessionActive) {
      toast.error("Regular sessions are only on Mon, Wed, or Fri.");
      return;
    }

    if (selectedGroupId === "others" && !eventName.trim()) {
      toast.error("Please enter an Event Name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const presentStudentIds = Object.entries(attendance)
        .filter(([_, isPresent]) => isPresent)
        .map(([id]) => id);

      storage.saveAttendance({
        id: crypto.randomUUID(),
        date: format(selectedDate, "yyyy-MM-dd"), // Always save for TODAY
        groupId: selectedGroupId,
        eventName: selectedGroupId === "others" ? eventName.trim() : undefined,
        presentStudentIds,
      });

      // Show success popup
      setShowSuccessDialog(true);
    } catch (error) {
      toast.error("Failed to save attendance.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const attendedCount = Object.values(attendance).filter(Boolean).length;
  // Determine display name for success dialog
  const successDisplayName = selectedGroupId === "others" ? eventName : groups.find(g => g.id === selectedGroupId)?.name;

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header title="Attendance" showBack backTo="/" />

      <div className="container max-w-lg mx-auto px-4 py-6 animate-slide-up">
        {/* Control Section */}
        <div className="space-y-4 mb-6">
          {/* Group Selector */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Select Group
            </label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="dropdown-trigger">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a group" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
                {/* Special "Others" Option */}
                <SelectItem value="others">Others (Outdoor/Events)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* "Others" Special Fields */}
          {selectedGroupId === "others" && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Event Name
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. Field Trip, Workshop..."
                    className="pl-9 bg-card border-border/50"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Search Student
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    className="pl-9 bg-card border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Date Display (Locked) */}
          <div className={selectedGroupId === "others" ? "opacity-70" : ""}>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Date
            </label>
            <div className="dropdown-trigger w-full opacity-100 cursor-default bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{format(selectedDate, "PPP")}</span>
                <span className="ml-auto text-xs text-muted-foreground">(Today)</span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          {!isSessionActive && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/10">
              <Info className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  No Session Today
                </p>
                <p className="text-xs text-muted-foreground">
                  Sessions differ on Mon, Wed, Fri only
                </p>
              </div>
            </div>
          )}

          {selectedGroupId === "others" && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-accent bg-accent/50">
              <Info className="h-5 w-5 text-accent-foreground" />
              <div>
                <p className="text-sm font-medium text-accent-foreground">
                  Special Event Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Attendance is open for all students
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Student List */}
        {isSessionActive && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Students</h2>
              <span className="text-sm text-muted-foreground">
                {attendedCount} / {filteredStudents.length} present
              </span>
            </div>

            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {selectedGroupId === "others" && searchQuery
                    ? "No students match your search"
                    : "No students found"}
                </p>
              ) : (
                filteredStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="animate-slide-up"
                    // Limit animation delay for long lists in 'Others' to prevent lag
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                  >
                    <StudentCard
                      name={student.name}
                      id={student.id}
                      checked={attendance[student.id] || false}
                      onCheckedChange={(checked) =>
                        toggleAttendance(student.id, checked)
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Submit Button */}
      {isSessionActive && (
        <StickyBottom>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || filteredStudents.length === 0}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </StickyBottom>
      )}

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-xs rounded-3xl bg-card border-border shadow-2xl">
          <AlertDialogHeader className="items-center text-center pt-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold">Submitted!</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Attendance for <span className="font-semibold text-foreground">{successDisplayName}</span>
              <br />
              on <span className="font-semibold text-foreground">{format(selectedDate, "dd MMM")}</span> has been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pb-8 pt-4 px-6">
            <AlertDialogAction className="w-full h-12 rounded-xl text-base" onClick={() => setShowSuccessDialog(false)}>
              Back to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
