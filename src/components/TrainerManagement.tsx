import { useState } from "react";
import { UserPlus, UserMinus, Key, User } from "lucide-react";
import { Trainer } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface TrainerManagementProps {
    trainers: Trainer[];
    courtId: string;
    onAddTrainer: (name: string, passcode: string) => void;
    onRemoveTrainer: (trainerId: string) => void;
    onUpdatePasscode: (trainerId: string, newPasscode: string) => void;
}

export function TrainerManagement({
    trainers,
    courtId,
    onAddTrainer,
    onRemoveTrainer,
    onUpdatePasscode,
}: TrainerManagementProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

    // Add Trainer Form
    const [newTrainerName, setNewTrainerName] = useState("");
    const [newTrainerPasscode, setNewTrainerPasscode] = useState("");

    // Edit Passcode Form
    const [newPasscode, setNewPasscode] = useState("");

    const courtTrainers = trainers.filter(t => t.courtId === courtId);

    const handleAddSubmit = () => {
        if (!newTrainerName.trim() || !newTrainerPasscode.trim()) {
            return;
        }
        onAddTrainer(newTrainerName.trim(), newTrainerPasscode.trim());
        setNewTrainerName("");
        setNewTrainerPasscode("");
        setIsAddModalOpen(false);
    };

    const handleEditSubmit = () => {
        if (!selectedTrainer || !newPasscode.trim()) return;
        onUpdatePasscode(selectedTrainer.id, newPasscode.trim());
        setNewPasscode("");
        setSelectedTrainer(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Trainers ({courtTrainers.length})
                </h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                >
                    <UserPlus className="h-4 w-4" />
                    Add Trainer
                </button>
            </div>

            {/* Trainers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courtTrainers.map((trainer) => (
                    <div
                        key={trainer.id}
                        className="p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-foreground">{trainer.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Passcode: {trainer.passcode}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedTrainer(trainer);
                                    setIsEditModalOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-all"
                            >
                                <Key className="h-4 w-4" />
                                Change Passcode
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm(`Remove ${trainer.name}?`)) {
                                        onRemoveTrainer(trainer.id);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-all"
                            >
                                <UserMinus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {courtTrainers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No trainers assigned to this court</p>
                    <p className="text-sm">Click "Add Trainer" to get started</p>
                </div>
            )}

            {/* Add Trainer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl border shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Add New Trainer</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                    Trainer Name
                                </label>
                                <input
                                    type="text"
                                    value={newTrainerName}
                                    onChange={(e) => setNewTrainerName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    placeholder="Enter name"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                    Passcode (4 digits)
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={newTrainerPasscode}
                                    onChange={(e) => setNewTrainerPasscode(e.target.value.replace(/\D/g, ""))}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    placeholder="1234"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setNewTrainerName("");
                                        setNewTrainerPasscode("");
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSubmit}
                                    disabled={!newTrainerName.trim() || newTrainerPasscode.length !== 4}
                                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Passcode Modal */}
            {isEditModalOpen && selectedTrainer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl border shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Change Passcode for {selectedTrainer.name}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                    Current Passcode
                                </label>
                                <input
                                    type="text"
                                    value={selectedTrainer.passcode}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                    New Passcode (4 digits)
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={newPasscode}
                                    onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, ""))}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    placeholder="1234"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setSelectedTrainer(null);
                                        setNewPasscode("");
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    disabled={newPasscode.length !== 4}
                                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
