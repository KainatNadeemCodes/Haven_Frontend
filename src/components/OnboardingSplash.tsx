import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";

interface OnboardingSplashProps {
  onComplete: () => void;
}

const OnboardingSplash = ({ onComplete }: OnboardingSplashProps) => {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 translate-y-6 scale-95"
            : phase === "visible"
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
        }`}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-primary/12 flex items-center justify-center mb-8">
          <Leaf size={36} className="text-primary" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground mb-2">
          Haven
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-[240px] leading-relaxed">
          A quiet space designed for comfort
        </p>

        {/* Subtle loader */}
        <div className="mt-10 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={onComplete}
        className="absolute bottom-12 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-300"
      >
        Tap to continue
      </button>
    </div>
  );
};

export default OnboardingSplash;
