import { useState, useRef, useEffect } from "react";
import { Play, Pause, Repeat, Trash2, Pencil, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { CustomSound } from "./types";

interface CustomSoundCardProps {
  sound: CustomSound;
  onUpdate: (updates: Partial<CustomSound>) => void;
  onDelete: () => void;
}

const CustomSoundCard = ({ sound, onUpdate, onDelete }: CustomSoundCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(sound.name);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceCreatedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(sound.audioUrl);
    audio.loop = sound.loop;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioCtxRef.current?.close();
    };
  }, [sound.audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = sound.loop;
  }, [sound.loop]);

  const ensureAudioCtx = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const gain = ctx.createGain();
    gain.gain.value = sound.volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;
    sourceCreatedRef.current = true;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    ensureAudioCtx();
    if (sound.isPlaying) {
      if (sound.fadeOut && gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.6);
        setTimeout(() => {
          audioRef.current?.pause();
          if (gainNodeRef.current) gainNodeRef.current.gain.value = sound.volume;
        }, 600);
      } else {
        audioRef.current.pause();
      }
      onUpdate({ isPlaying: false });
    } else {
      if (sound.fadeIn && gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.value = 0;
        gainNodeRef.current.gain.linearRampToValueAtTime(sound.volume, audioCtxRef.current.currentTime + 0.6);
      }
      audioRef.current.play();
      onUpdate({ isPlaying: true });
    }
  };

  const handleVolume = (val: number[]) => {
    const v = val[0];
    onUpdate({ volume: v });
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v;
  };

  const commitRename = () => {
    onUpdate({ name: editName.trim() || sound.name });
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        sound.isPlaying
          ? "border-primary/30 bg-primary/[0.04] shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.12)]"
          : "border-border/40 bg-card"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${
            sound.isPlaying
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          aria-label={sound.isPlaying ? "Pause" : "Play"}
        >
          {sound.isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => e.key === "Enter" && commitRename()}
              className="w-full text-sm font-medium bg-transparent border-b border-primary/30 outline-none text-foreground pb-0.5"
            />
          ) : (
            <p className="text-sm font-medium text-foreground truncate">{sound.name}</p>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
          aria-label="Sound settings"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-4 animate-fade-in">
          {/* Volume */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-14 shrink-0">Volume</span>
            <Slider
              value={[sound.volume]}
              onValueChange={handleVolume}
              min={0}
              max={1}
              step={0.01}
              className="flex-1"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Repeat size={13} /> Loop
              </span>
              <Switch
                checked={sound.loop}
                onCheckedChange={(v) => onUpdate({ loop: v })}
                className="scale-[0.85]"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              Fade in
              <Switch
                checked={sound.fadeIn}
                onCheckedChange={(v) => onUpdate({ fadeIn: v })}
                className="scale-[0.85]"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              Fade out
              <Switch
                checked={sound.fadeOut}
                onCheckedChange={(v) => onUpdate({ fadeOut: v })}
                className="scale-[0.85]"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { setIsEditing(true); setEditName(sound.name); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Pencil size={13} /> Rename
            </button>
            <div className="flex-1" />
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-xs text-destructive/70 hover:text-destructive transition-colors duration-200"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSoundCard;
