import { useState, useMemo } from "react";
import { X, UserMinus, Users, Search, Check } from "lucide-react";
import { Group, Student } from "@/lib/storage";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RemoveStudentModalProps {
    groups: Group[];
    students: Student[];
    isOpen: boolean;
    onClose: () => void;
    onRemove: (studentId: string) => void;
}

export function RemoveStudentModal({ groups, students, isOpen, onClose, onRemove }: RemoveStudentModalProps) {
    const [groupId, setGroupId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");

    // Filter students by group first
    const groupStudents = useMemo(() => {
        if (!groupId) return [];
        return students.filter(s => s.groupId === groupId);
    }, [students, groupId]);

    // Then filter by search query
    const filteredStudents = useMemo(() => {
        if (!searchQuery) return groupStudents;
        return groupStudents.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [groupStudents, searchQuery]);

    // Early return MUST be after all hooks
    if (!isOpen) return null;

    const handleRemove = () => {
        if (selectedStudentId) {
            onRemove(selectedStudentId);
            // Reset logic
            setSelectedStudentId("");
            setSearchQuery("");
            // Group selection persists for easier bulk removal or resets if desired
            // setGroupId(""); 
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-card rounded-2xl border shadow-lg animate-scale-in p-6 flex flex-col max-h-[85vh]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                    <h2 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                        <UserMinus className="h-5 w-5 text-destructive" />
                        Remove Student
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Select group and search for student to remove.
                    </p>
                </div>

                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Step 1: Select Group */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            1. Select Group
                        </label>
                        <Select value={groupId} onValueChange={(val) => {
                            setGroupId(val);
                            setSelectedStudentId("");
                            setSearchQuery("");
                        }}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Select Group" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2: Search & Select */}
                    {groupId && (
                        <div className="space-y-2 flex-1 flex flex-col min-h-0">
                            <label className="text-sm font-medium leading-none">
                                2. Select Student ({groupStudents.length})
                            </label>

                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            <div className="border rounded-md flex-1 overflow-y-auto min-h-[150px] max-h-[250px] p-1">
                                {filteredStudents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        {searchQuery ? "No matching students" : "No students in this group"}
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredStudents.map(student => (
                                            <button
                                                key={student.id}
                                                onClick={() => setSelectedStudentId(student.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm transition-colors",
                                                    selectedStudentId === student.id
                                                        ? "bg-secondary text-secondary-foreground font-medium"
                                                        : "hover:bg-muted text-foreground"
                                                )}
                                            >
                                                <span>{student.name}</span>
                                                {selectedStudentId === student.id && (
                                                    <Check className="h-4 w-4 opacity-100" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium transition-colors hover:bg-muted rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRemove}
                            disabled={!selectedStudentId}
                            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Remove Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
