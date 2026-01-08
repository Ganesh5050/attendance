import { useState } from "react";
import { X, UserPlus, Users } from "lucide-react";
import { Group } from "@/lib/storage";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AddStudentModalProps {
    groups: Group[];
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, groupId: string) => void;
}

export function AddStudentModal({ groups, isOpen, onClose, onAdd }: AddStudentModalProps) {
    const [groupId, setGroupId] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupId) {
            setError("Please select a group");
            return;
        }
        if (!name.trim()) {
            setError("Please enter a name");
            return;
        }

        onAdd(name.trim(), groupId);
        // Reset and close handled by parent or effect, but here we can reset local state if needed
        setName("");
        setError("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-card rounded-2xl border shadow-lg animate-scale-in p-6">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                    <h2 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Add Student
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Enter details to add a new student.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Group
                        </label>
                        <Select value={groupId} onValueChange={(val) => { setGroupId(val); setError(""); }}>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Student Name
                        </label>
                        <Input
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(""); }}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium transition-colors hover:bg-muted rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm"
                        >
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
