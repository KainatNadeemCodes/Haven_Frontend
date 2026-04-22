import { useState, useCallback } from "react";
import { ShieldCheck, Delete, KeyRound } from "lucide-react";

interface CaregiverPinEntryProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PIN_STORAGE_KEY = "haven-caregiver-pin";

const getStoredPin = () => localStorage.getItem(PIN_STORAGE_KEY);
const savePin = (pin: string) => localStorage.setItem(PIN_STORAGE_KEY, pin);
const clearPin = () => localStorage.removeItem(PIN_STORAGE_KEY);

type Mode = "enter" | "set-new" | "confirm-new" | "reset-confirm";

const CaregiverPinEntry = ({ onSuccess, onClose }: CaregiverPinEntryProps) => {
  const isFirstTime = !getStoredPin();

  const [mode, setMode] = useState<Mode>(isFirstTime ? "set-new" : "enter");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const modeConfig = {
    "enter": {
      title: "Caregiver Access",
      subtitle: "Enter your PIN to continue",
    },
    "set-new": {
      title: "Set Your PIN",
      subtitle: "Choose a 4-digit PIN for caregiver access",
    },
    "confirm-new": {
      title: "Confirm PIN",
      subtitle: "Enter your new PIN again to confirm",
    },
    "reset-confirm": {
      title: "Reset PIN",
      subtitle: "Enter a new 4-digit PIN",
    },
  };

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return;
      const next = pin + digit;
      setError(false);
      setPin(next);

      if (next.length === 4) {
        if (mode === "enter") {
          const stored = getStoredPin();
          if (next === stored) {
            setSuccess(true);
            setTimeout(onSuccess, 600);
          } else {
            setError(true);
            setShowReset(true);
            setTimeout(() => {
              setPin("");
              setError(false);
            }, 800);
          }
        } else if (mode === "set-new") {
          // Store first entry, move to confirm
          setNewPin(next);
          setTimeout(() => {
            setPin("");
            setMode("confirm-new");
          }, 200);
        } else if (mode === "confirm-new") {
          if (next === newPin) {
            savePin(next);
            setSuccess(true);
            setTimeout(onSuccess, 600);
          } else {
            setError(true);
            setTimeout(() => {
              setPin("");
              setNewPin("");
              setError(false);
              setMode("set-new");
            }, 800);
          }
        } else if (mode === "reset-confirm") {
          setNewPin(next);
          setTimeout(() => {
            setPin("");
            setMode("confirm-new");
          }, 200);
        }
      }
    },
    [pin, mode, newPin, onSuccess]
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  const handleForgotPin = () => {
    clearPin();
    setPin("");
    setNewPin("");
    setError(false);
    setShowReset(false);
    setMode("reset-confirm");
  };

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
              error ? "bg-destructive" : "bg-primary"
            }`}
          />
        )}
      </div>
    );
  });

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  const { title, subtitle } = modeConfig[mode];

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
          {mode === "enter" ? (
            <ShieldCheck size={28} className="text-primary" strokeWidth={1.8} />
          ) : (
            <KeyRound size={28} className="text-primary" strokeWidth={1.8} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-display font-semibold text-foreground mb-1.5">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
          {subtitle}
        </p>

        {/* PIN dots */}
        <div className="flex gap-3 mb-6">{dots}</div>

        {/* Error / status messages */}
        <div className="h-5 mb-4 text-center">
          {error && mode === "enter" && (
            <p className="text-destructive text-xs font-medium">
              That PIN wasn't right. Try again.
            </p>
          )}
          {error && mode === "confirm-new" && (
            <p className="text-destructive text-xs font-medium">
              PINs didn't match. Let's start over.
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

        {/* Forgot PIN — only shown after a wrong attempt */}
        {mode === "enter" && showReset && (
          <button
            onClick={handleForgotPin}
            className="mt-6 text-xs text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors duration-200"
          >
            Forgot PIN? Reset it
          </button>
        )}

        {/* First-time helper */}
        {(mode === "set-new" || mode === "reset-confirm") && (
          <p className="text-muted-foreground text-xs mt-6 text-center max-w-[200px]">
            You'll confirm this PIN on the next screen.
          </p>
        )}
      </div>
    </div>
  );
};

export default CaregiverPinEntry;
