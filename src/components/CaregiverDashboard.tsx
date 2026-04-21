import { useState } from "react";
import { X, Save, Type, Volume2, VolumeX, Eye, Zap, Settings } from "lucide-react";
import { defaultPhrases, iconMap, type TalkPhrase } from "./TalkTab";
import CaregiverPinEntry from "./CaregiverPinEntry";

interface CaregiverDashboardProps {
  onClose: () => void;
}

type TextSize = "small" | "medium" | "large";

const CaregiverDashboard = ({ onClose }: CaregiverDashboardProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<"settings" | "cards">("settings");

  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem("haven-text-size") as TextSize) || "medium";
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("haven-sound") !== "off";
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("haven-contrast") === "high";
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("haven-motion") === "reduced";
  });

  const [phrases, setPhrases] = useState<TalkPhrase[]>(() => {
    try {
      const stored = localStorage.getItem("haven-talk-phrases");
      return stored ? JSON.parse(stored) : defaultPhrases;
    } catch {
      return defaultPhrases;
    }
  });

  if (!authenticated) {
    return (
      <CaregiverPinEntry
        onSuccess={() => setAuthenticated(true)}
        onClose={onClose}
      />
    );
  }

  const handleToggle = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const handleSavePhrases = () => {
    localStorage.setItem("haven-talk-phrases", JSON.stringify(phrases));
  };

  const sections = [
    { id: "settings" as const, label: "Settings" },
    { id: "cards" as const, label: "Edit Cards" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-5 border-b border-border/50 animate-fade-up">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Caregiver Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300"
            aria-label="Close dashboard"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize Haven for comfort and accessibility. You can adjust these anytime.
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 px-6 pt-5 pb-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeSection === s.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeSection === "settings" && (
          <div className="flex flex-col gap-4 max-w-lg mx-auto">
            <SettingCard
              icon={<Type size={20} strokeWidth={1.8} />}
              title="Text Size"
              helper="Adjust text size to improve readability."
            >
              <div className="flex gap-2 mt-3">
                {(["small", "medium", "large"] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setTextSize(size);
                      handleToggle("haven-text-size", size);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
                      textSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </SettingCard>

            <SettingCard
              icon={soundEnabled ? <Volume2 size={20} strokeWidth={1.8} /> : <VolumeX size={20} strokeWidth={1.8} />}
              title="Sound"
              helper="Enable or disable ambient sounds."
            >
              <ToggleSwitch
                enabled={soundEnabled}
                onToggle={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  handleToggle("haven-sound", next ? "on" : "off");
                }}
                label={soundEnabled ? "Enabled" : "Disabled"}
              />
            </SettingCard>

            <SettingCard
              icon={<Eye size={20} strokeWidth={1.8} />}
              title="Contrast"
              helper="Higher contrast can improve visibility."
            >
              <ToggleSwitch
                enabled={highContrast}
                onToggle={() => {
                  const next = !highContrast;
                  setHighContrast(next);
                  handleToggle("haven-contrast", next ? "high" : "standard");
                }}
                label={highContrast ? "High" : "Standard"}
              />
            </SettingCard>

            <SettingCard
              icon={<Zap size={20} strokeWidth={1.8} />}
              title="Motion"
              helper="Minimize animations for a calmer experience."
            >
              <ToggleSwitch
                enabled={reducedMotion}
                onToggle={() => {
                  const next = !reducedMotion;
                  setReducedMotion(next);
                  handleToggle("haven-motion", next ? "reduced" : "full");
                }}
                label={reducedMotion ? "Reduced" : "Full"}
              />
            </SettingCard>
          </div>
        )}

        {activeSection === "cards" && (
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground mb-2">
              Edit the text on each communication card. Changes are saved when you tap the button below.
            </p>
            {phrases.map((phrase) => {
              const Icon = iconMap[phrase.iconName] || Settings;
              return (
                <div
                  key={phrase.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50"
                >
                  <div className={`w-10 h-10 rounded-xl ${phrase.bgClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className="text-foreground/70" strokeWidth={1.8} />
                  </div>
                  <input
                    type="text"
                    value={phrase.text}
                    onChange={(e) =>
                      setPhrases((prev) =>
                        prev.map((p) =>
                          p.id === phrase.id ? { ...p, text: e.target.value } : p
                        )
                      )
                    }
                    className="flex-1 bg-transparent rounded-lg px-3 py-2 text-foreground font-medium text-sm border-none outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card"
                  />
                </div>
              );
            })}
            <button
              onClick={() => {
                handleSavePhrases();
                const btn = document.activeElement as HTMLButtonElement;
                btn?.classList.add("success-pulse");
                setTimeout(() => btn?.classList.remove("success-pulse"), 800);
              }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.97] mt-2"
            >
              <Save size={16} strokeWidth={2} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Sub-components --- */

const SettingCard = ({
  icon,
  title,
  helper,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  helper: string;
  children: React.ReactNode;
}) => (
  <div className="p-4 rounded-2xl bg-card border border-border/50">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-xs mt-0.5">{helper}</p>
        {children}
      </div>
    </div>
  </div>
);

const ToggleSwitch = ({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <div className="flex items-center justify-between mt-3">
    <span className="text-xs font-medium text-foreground">{label}</span>
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${
        enabled ? "bg-primary" : "bg-border"
      }`}
      aria-label={`Toggle ${label}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-background shadow-sm transition-transform duration-300 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

export default CaregiverDashboard;
