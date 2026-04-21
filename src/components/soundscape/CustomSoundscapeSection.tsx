import { useState, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import EnvironmentBuilder from "./EnvironmentBuilder";
import EnvironmentCard from "./EnvironmentCard";
import type { CustomSound, SoundEnvironment } from "./types";

const CustomSoundscapeSection = () => {
  const [environments, setEnvironments] = useState<SoundEnvironment[]>([]);
  const [building, setBuilding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Audio refs for playback: envId → soundId → { audio, gain, ctx }
  const playbackRef = useRef<
    Map<string, Map<string, { audio: HTMLAudioElement; gain: GainNode; ctx: AudioContext }>>
  >(new Map());

  const stopEnvironment = useCallback((envId: string) => {
    const map = playbackRef.current.get(envId);
    if (!map) return;
    map.forEach(({ audio, gain, ctx }) => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        audio.pause();
        audio.src = "";
        ctx.close();
      }, 500);
    });
    playbackRef.current.delete(envId);
  }, []);

  const playEnvironment = useCallback((env: SoundEnvironment) => {
    const map = new Map<string, { audio: HTMLAudioElement; gain: GainNode; ctx: AudioContext }>();
    env.sounds.forEach((sound) => {
      const audio = new Audio(sound.audioUrl);
      audio.loop = sound.loop;
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(gain);
      gain.connect(ctx.destination);
      // Fade in
      gain.gain.linearRampToValueAtTime(sound.volume, ctx.currentTime + (sound.fadeIn ? 0.6 : 0.01));
      audio.play();
      map.set(sound.id, { audio, gain, ctx });
    });
    playbackRef.current.set(env.id, map);
  }, []);

  const togglePlay = (envId: string) => {
    setEnvironments((prev) => {
      const target = prev.find((e) => e.id === envId);
      if (!target) return prev;

      if (target.isPlaying) {
        stopEnvironment(envId);
      } else {
        // Stop all others first
        prev.forEach((e) => {
          if (e.isPlaying) stopEnvironment(e.id);
        });
        playEnvironment(target);
      }

      return prev.map((e) =>
        e.id === envId ? { ...e, isPlaying: !e.isPlaying } : { ...e, isPlaying: false }
      );
    });
  };

  const saveEnvironment = (env: SoundEnvironment) => {
    setEnvironments((prev) => {
      const idx = prev.findIndex((e) => e.id === env.id);
      if (idx >= 0) {
        stopEnvironment(env.id);
        const next = [...prev];
        next[idx] = { ...env, isPlaying: false };
        return next;
      }
      return [...prev, env];
    });
    setBuilding(false);
    setEditingId(null);
  };

  const deleteEnvironment = (id: string) => {
    stopEnvironment(id);
    setEnvironments((prev) => prev.filter((e) => e.id !== id));
  };

  const editingEnv = editingId ? environments.find((e) => e.id === editingId) || null : null;

  if (building || editingId) {
    return (
      <div className="w-full max-w-sm animate-fade-up-delay-3">
        <EnvironmentBuilder
          initial={editingEnv}
          onSave={saveEnvironment}
          onCancel={() => { setBuilding(false); setEditingId(null); }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm animate-fade-up-delay-3">
      {/* Section divider */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">
          Create Your Own Soundscape
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <p className="text-xs text-muted-foreground text-center mb-5">
        Upload or record sounds to craft your personal environment
      </p>

      {/* Saved environments */}
      {environments.length > 0 && (
        <div className="space-y-3 mb-4">
          {environments.map((env) => (
            <EnvironmentCard
              key={env.id}
              env={env}
              onPlay={() => togglePlay(env.id)}
              onEdit={() => { setEditingId(env.id); }}
              onDelete={() => deleteEnvironment(env.id)}
            />
          ))}
        </div>
      )}

      {/* New environment button */}
      <button
        onClick={() => setBuilding(true)}
        className="premium-card w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border/60 bg-surface/50 hover:border-primary/25 hover:bg-surface transition-colors duration-300"
      >
        <Plus size={18} className="text-primary" strokeWidth={1.8} />
        <span className="text-sm font-medium text-foreground">New Environment</span>
      </button>
    </div>
  );
};

export default CustomSoundscapeSection;
