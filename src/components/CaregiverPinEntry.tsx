import { useState, useCallback } from "react";
import { ShieldCheck, Delete } from "lucide-react";

interface CaregiverPinEntryProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CORRECT_PIN = "1234";

const CaregiverPinEntry = ({ onSuccess, onClose }: CaregiverPinEntryProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return;
      const next = pin + digit;
      setError(false);
      setPin(next);

      if (next.length === 4) {
        if (next === CORRECT_PIN) {
          setSuccess(true);
          setTimeout(onSuccess, 600);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 800);
        }
      }
    },
    [pin, onSuccess]
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  const dots = Array.from({ length: 4 }, (_, i) => {
    const filled = i < pin.length;
    return (
      <div
        key={i}
        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
          error
            ? "border-destructive/40 bg-destructive/8"
            : success
            ? "border-primary/40 bg-primary/8"
            : filled
            ? "border-primary/30 bg-primary/8"
            : "border-border bg-card"
        }`}
      >
        {filled && (
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              error ? "bg-destructive" : success ? "bg-primary" : "bg-primary"
            }`}
          />
        )}
      </div>
    );
  });

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="animate-fade-up flex flex-col items-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <ShieldCheck size={28} className="text-primary" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-display font-semibold text-foreground mb-1.5">
          Caregiver Access
        </h2>
        <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
          Enter your PIN to continue
        </p>

        {/* PIN dots */}
        <div className="flex gap-3 mb-6">{dots}</div>

        {/* Error */}
        <div className="h-5 mb-4">
          {error && (
            <p className="text-destructive text-xs font-medium">
              That PIN wasn't right. Try again.
            </p>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px]">
          {keys.map((key, i) => {
            if (key === "") return <div key={i} />;
            if (key === "del") {
              return (
                <button
                  key={i}
                  onClick={handleDelete}
                  className="h-14 rounded-xl bg-card text-muted-foreground flex items-center justify-center transition-all duration-300 hover:bg-muted active:scale-95"
                  aria-label="Delete"
                >
                  <Delete size={20} strokeWidth={1.8} />
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => handleDigit(key)}
                className="h-14 rounded-xl bg-card text-foreground text-lg font-medium transition-all duration-300 hover:bg-muted active:scale-95"
              >
                {key}
              </button>
            );
          })}
        </div>

        <p className="text-muted-foreground text-sm mt-8 bg-card/80 border border-border/50 rounded-lg px-4 py-2">
          Demo PIN: <span className="font-semibold text-foreground tracking-widest">1234</span>
        </p>
      </div>
    </div>
  );
};

export default CaregiverPinEntry;
