import { useState, useEffect, useRef, useCallback } from "react";
import { Wind, CloudRain, Bird, Waves, Cloud } from "lucide-react";
import CustomSoundscapeSection from "./soundscape/CustomSoundscapeSection";

type BreathPhase = "idle" | "inhale" | "hold" | "exhale";

const sounds = [
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "white", label: "White Noise", icon: Wind },
  { id: "birds", label: "Birds", icon: Bird },
  { id: "ocean", label: "Ocean", icon: Waves },
];

const createNoiseNode = (ctx: AudioContext, type: string): AudioNode => {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  } else if (type === "ocean") {
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }
  } else if (type === "rain") {
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = w * (0.3 + 0.7 * Math.random() * Math.random());
    }
  } else {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = 0.15;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = type === "birds" ? 800 : type === "rain" ? 3000 : 8000;

  source.connect(filter);
  filter.connect(gain);
  source.start();

  return gain;
};

const CalmTab = () => {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [breathText, setBreathText] = useState("Tap to begin");
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodeRef = useRef<AudioNode | null>(null);
  const breathingRef = useRef(false);

  const runBreathCycle = useCallback(() => {
    if (!breathingRef.current) return;
    setPhase("inhale");
    setBreathText("Inhale");

    timerRef.current = setTimeout(() => {
      if (!breathingRef.current) return;
      setPhase("hold");
      setBreathText("Hold");

      timerRef.current = setTimeout(() => {
        if (!breathingRef.current) return;
        setPhase("exhale");
        setBreathText("Exhale");

        timerRef.current = setTimeout(() => {
          if (breathingRef.current) runBreathCycle();
        }, 4000);
      }, 2000);
    }, 4000);
  }, []);

  const toggleBreathing = () => {
    if (breathingRef.current) {
      breathingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("idle");
      setBreathText("Tap to begin");
    } else {
      breathingRef.current = true;
      runBreathCycle();
    }
  };

  const toggleSound = (soundId: string) => {
    if (audioNodeRef.current) {
      audioNodeRef.current.disconnect();
      audioNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (activeSound === soundId) {
      setActiveSound(null);
      return;
    }
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const node = createNoiseNode(ctx, soundId);
    node.connect(ctx.destination);
    audioNodeRef.current = node;
    setActiveSound(soundId);
  };

  useEffect(() => {
    return () => {
      breathingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioNodeRef.current) audioNodeRef.current.disconnect();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const bubbleClass =
    phase === "inhale"
      ? "breathe-in"
      : phase === "exhale"
      ? "breathe-out"
      : phase === "hold"
      ? "scale-100 opacity-100"
      : "scale-[0.65] opacity-50";

  return (
    <div className="flex flex-col items-center px-6 pt-4 pb-32">
      {/* Breathing circle — large prominent ring like reference */}
      <div className="relative flex items-center justify-center mb-6 mt-2 animate-fade-up">
        {/* Outer glow ring */}
        <div
          className={`absolute w-56 h-56 rounded-full transition-all duration-[4000ms] ease-in-out ${
            phase !== "idle"
              ? "bg-primary/6 shadow-[0_0_60px_20px_hsl(var(--primary)/0.08)]"
              : ""
          }`}
        />
        {/* Progress ring */}
        <svg className="absolute w-52 h-52 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${phase !== "idle" ? 565 : 0} 565`}
            className="transition-[stroke-dasharray] duration-[4000ms] ease-in-out"
          />
        </svg>
        {/* Inner circle with icon */}
        <button
          onClick={toggleBreathing}
          className={`relative w-40 h-40 rounded-full bg-card flex items-center justify-center transition-transform duration-[4000ms] ease-in-out shadow-[0_4px_30px_-8px_hsl(var(--shadow-color)/0.08)] border border-border/30 ${bubbleClass}`}
          aria-label="Toggle breathing exercise"
        >
          <Cloud size={56} className="text-primary" strokeWidth={1.5} />
        </button>
      </div>

      {/* Phase label */}
      <div className="text-center mb-2 animate-fade-up-delay-1">
        <p className="text-lg font-display font-semibold text-foreground tracking-tight">
          {phase !== "idle" ? breathText : "Breathe"}
        </p>
      </div>

      {/* Sub-label */}
      <p className="text-sm text-muted-foreground mb-8 animate-fade-up-delay-1">
        {phase === "idle" ? "Tap the circle to start" : "Follow the rhythm"}
      </p>

      {/* Soundboard — horizontal cards like reference */}
      <div className="w-full max-w-sm animate-fade-up-delay-2">
        <div className="grid grid-cols-2 gap-3">
          {sounds.map((sound) => {
            const Icon = sound.icon;
            const isActive = activeSound === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`premium-card flex flex-row items-center gap-3 p-4 rounded-2xl border ${
                  isActive
                    ? "border-primary/30 bg-primary/8 shadow-[0_4px_20px_-6px_hsl(var(--primary)/0.15)]"
                    : "border-border/40 bg-card hover:border-border"
                }`}
                aria-label={`${isActive ? "Stop" : "Play"} ${sound.label}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-primary/20" : "bg-sage/60"
                }`}>
                  <Icon size={22} className={isActive ? "text-primary" : "text-foreground/70"} strokeWidth={1.8} />
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                  {sound.label}
                </span>
                {isActive && (
                  <div className="flex gap-0.5 ml-auto">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Soundscape */}
      <CustomSoundscapeSection />
    </div>
  );
};

export default CalmTab;
