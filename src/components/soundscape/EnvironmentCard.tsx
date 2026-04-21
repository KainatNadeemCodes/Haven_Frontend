import { Play, Pause, Pencil, Trash2, Music } from "lucide-react";
import type { SoundEnvironment } from "./types";

interface EnvironmentCardProps {
  env: SoundEnvironment;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EnvironmentCard = ({ env, onPlay, onEdit, onDelete }: EnvironmentCardProps) => {
  return (
    <div
      className={`premium-card rounded-xl border transition-all duration-300 ${
        env.isPlaying
          ? "border-primary/30 bg-primary/[0.04] shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.12)]"
          : "border-border/40 bg-card"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Play / Pause */}
        <button
          onClick={onPlay}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${
            env.isPlaying
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          aria-label={env.isPlaying ? "Pause environment" : "Play environment"}
        >
          {env.isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{env.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Music size={11} className="text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground truncate">
              {env.sounds.map((s) => s.name).join(", ") || "No sounds"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onEdit}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Edit environment"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors duration-200"
          aria-label="Delete environment"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Playing indicator */}
      {env.isPlaying && (
        <div className="px-4 pb-3 flex gap-1 items-center">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
          <span className="text-xs text-primary ml-1.5">Playing</span>
        </div>
      )}
    </div>
  );
};

export default EnvironmentCard;
