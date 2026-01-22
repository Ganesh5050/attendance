import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Rename to avoid conflict with Icon
import { format, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { storage, Group, Student, getCourtName } from "@/lib/storage";

export default function AttendanceDashboard() {
  const { courtId } = useParams<{ courtId: string }>();

  // Get current trainer from session
  const currentTrainer = useMemo(() => {
    const trainerData = sessionStorage.getItem("currentTrainer");
    return trainerData ? JSON.parse(trainerData) : null;
  }, []);

  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  // Allow date flexibility - Default to today
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // "Others" specific state
  const [eventName, setEventName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedGroups = storage.getGroups(courtId);
    const loadedStudents = storage.getStudents();
    console.log(`[AttendanceDashboard] Court: ${courtId}, Loaded ${loadedStudents.length} students:`, loadedStudents.map(s => `${s.id} (${s.groupId})`));
    setGroups(loadedGroups);
    setStudents(loadedStudents);
    if (loadedGroups.length > 0) {
      setSelectedGroupId(loadedGroups[0].id);
    }
  }, [courtId]);

  // Filter & Sort students
  const filteredStudents = useMemo(() => {
    console.log(`[Filter] courtId: ${courtId}, selectedGroupId: ${selectedGroupId}, total students: ${students.length}`);

    if (selectedGroupId === "others") {
      // Show ALL students, filtered by search query
      return students
        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Determine the expected groupId based on courtId
    const courtGroupId = courtId === "court-1" ? "gkp-all" :
      courtId === "court-2" ? "kal-all" :
        courtId === "court-3" ? "orch-all" :
          courtId === "court-4" ? "addr-all" :
            courtId === "court-5" ? "micl-all" : "";

    // If this court uses the "all students" model, show all students for that court
    if (courtGroupId && students.some(s => s.groupId === courtGroupId)) {
      return students
        .filter((s) => s.groupId === courtGroupId)
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Normal group behavior for other courts (future courts with specific groups)
    return students
      .filter((s) => s.groupId === selectedGroupId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedGroupId, searchQuery, courtId]);

  // Check if session is active
  const isSessionActive = useMemo(() => {
    if (selectedGroupId === "others") return true;

    // Find the current group config
    const currentGroup = groups.find(g => g.id === selectedGroupId);
    if (!currentGroup || !currentGroup.days) return true; // Default to allow if no restriction

    const currentDay = getDay(selectedDate); // 0=Sun, 1=Mon...
    return currentGroup.days.includes(currentDay);
  }, [selectedDate, selectedGroupId, groups]);

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
      toast.error("This group has no session scheduled for today.");
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
        date: format(selectedDate, "yyyy-MM-dd"),
        courtId: courtId || "",
        groupId: selectedGroupId,
        trainerId: currentTrainer?.id || "unknown",
        trainerName: currentTrainer?.name || "Unknown",
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
      <Header
        title={`Attendance - ${getCourtName(courtId || "")}`}
        showBack
        backTo="/court-selection/attendance"
      />

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

          {/* Date Selector */}
          <div className={selectedGroupId === "others" ? "opacity-70" : ""}>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Date
            </label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "dropdown-trigger w-full flex items-center gap-2 text-left font-normal transition-colors",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false);
                    }
                  }}
                  initialFocus
                  className="rounded-md border shadow-md bg-card"
                />
              </PopoverContent>
            </Popover>
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
                  Session not scheduled for this day
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
