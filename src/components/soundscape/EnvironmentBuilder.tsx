import { useState } from "react";
import { Plus, Save, ArrowLeft, GripVertical } from "lucide-react";
import AddSoundModal from "./AddSoundModal";
import CustomSoundCard from "./CustomSoundCard";
import type { CustomSound, SoundEnvironment } from "./types";

interface EnvironmentBuilderProps {
  initial?: SoundEnvironment | null;
  onSave: (env: SoundEnvironment) => void;
  onCancel: () => void;
}

const EnvironmentBuilder = ({ initial, onSave, onCancel }: EnvironmentBuilderProps) => {
  const [name, setName] = useState(initial?.name || "");
  const [sounds, setSounds] = useState<CustomSound[]>(initial?.sounds || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addSound = (soundName: string, audioUrl: string) => {
    setSounds((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: soundName,
        audioUrl,
        isPlaying: false,
        volume: 0.5,
        loop: true,
        fadeIn: true,
        fadeOut: true,
      },
    ]);
  };

  const updateSound = (id: string, updates: Partial<CustomSound>) => {
    setSounds((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSound = (id: string) => {
    setSounds((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setSounds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const handleSave = () => {
    if (!name.trim() || sounds.length === 0) return;
    onSave({
      id: initial?.id || crypto.randomUUID(),
      name: name.trim(),
      sounds: sounds.map((s) => ({ ...s, isPlaying: false })),
      isPlaying: false,
    });
  };

  const canSave = name.trim().length > 0 && sounds.length > 0;

  return (
    <div className="w-full max-w-sm space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h3 className="text-base font-display font-semibold text-foreground">
            {initial ? "Edit Environment" : "New Environment"}
          </h3>
          <p className="text-xs text-muted-foreground">
            Craft a space that feels right for you
          </p>
        </div>
      </div>

      {/* Name input */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Environment Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Evening Calm, Focus Mode"
          className="w-full text-sm font-medium bg-surface rounded-xl border border-border/40 px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 transition-colors duration-300"
        />
      </div>

      {/* Sound list */}
      {sounds.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Sounds ({sounds.length})
          </p>
          {sounds.map((sound, idx) => (
            <div
              key={sound.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-1 transition-opacity duration-200 ${
                dragIdx === idx ? "opacity-50" : ""
              }`}
            >
              <div className="pt-5 cursor-grab text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                <GripVertical size={14} />
              </div>
              <div className="flex-1">
                <CustomSoundCard
                  sound={sound}
                  onUpdate={(updates) => updateSound(sound.id, updates)}
                  onDelete={() => deleteSound(sound.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add sound */}
      <button
        onClick={() => setModalOpen(true)}
        className="premium-card w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-border/60 bg-surface/50 hover:border-primary/25 hover:bg-surface transition-colors duration-300"
      >
        <Plus size={16} className="text-primary" strokeWidth={1.8} />
        <span className="text-sm font-medium text-foreground">Add Sound</span>
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          canSave
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.25)]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        <Save size={16} />
        {initial ? "Update Environment" : "Save Environment"}
      </button>

      <AddSoundModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addSound}
      />
    </div>
  );
};

export default EnvironmentBuilder;
