import { useState, useEffect, useRef } from "react";
import { PauseCircle, Utensils, GlassWater, VolumeX, LifeBuoy, CheckCircle2, X } from "lucide-react";

export interface TalkPhrase {
  id: string;
  text: string;
  iconName: string;
  bgClass: string;
}

const defaultPhrases: TalkPhrase[] = [
  { id: "help", text: "I need help", iconName: "LifeBuoy", bgClass: "bg-talk-help" },
  { id: "hungry", text: "I am hungry", iconName: "Utensils", bgClass: "bg-talk-hungry" },
  { id: "thirsty", text: "I am thirsty", iconName: "GlassWater", bgClass: "bg-calm-blue" },
  { id: "break", text: "I need a break", iconName: "PauseCircle", bgClass: "bg-talk-break" },
  { id: "loud", text: "Too loud", iconName: "VolumeX", bgClass: "bg-talk-loud" },
  { id: "done", text: "All done", iconName: "CheckCircle2", bgClass: "bg-sage" },
];

const iconMap: Record<string, React.ElementType> = {
  PauseCircle,
  Utensils,
  GlassWater,
  VolumeX,
  LifeBuoy,
  CheckCircle2,
};

interface TalkTabProps {
  phrases?: TalkPhrase[];
}

const TalkTab = ({ phrases: customPhrases }: TalkTabProps) => {
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const dismissTimer = useRef<NodeJS.Timeout | null>(null);

  const phrases = customPhrases ?? (() => {
    try {
      const stored = localStorage.getItem("haven-talk-phrases");
      return stored ? JSON.parse(stored) : defaultPhrases;
    } catch {
      return defaultPhrases;
    }
  })();

  const selectedData = phrases.find((p: TalkPhrase) => p.id === selectedPhrase);

  useEffect(() => {
    if (selectedPhrase) {
      dismissTimer.current = setTimeout(() => setSelectedPhrase(null), 3000);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [selectedPhrase]);

  if (selectedData) {
    const Icon = iconMap[selectedData.iconName] || LifeBuoy;
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 glass-surface p-8"
        onClick={() => setSelectedPhrase(null)}
        role="dialog"
        aria-label={selectedData.text}
      >
        <button
          onClick={() => setSelectedPhrase(null)}
          className="absolute top-6 right-6 p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300"
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>
        <div className="animate-fade-up flex flex-col items-center">
          <div className={`w-24 h-24 rounded-3xl ${selectedData.bgClass} flex items-center justify-center mb-8`}>
            <Icon size={48} className="text-foreground" strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl font-display font-semibold text-foreground text-center leading-tight mb-4">
            {selectedData.text}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Tap anywhere to dismiss
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 pt-6 pb-32">
      {/* Section header */}
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="text-xl font-display font-semibold text-foreground mb-1.5">
          Say Something
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap a card to express how you feel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {phrases.map((phrase: TalkPhrase, index: number) => {
          const Icon = iconMap[phrase.iconName] || LifeBuoy;
          return (
            <button
              key={phrase.id}
              onClick={() => setSelectedPhrase(phrase.id)}
              className={`premium-card flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-border/30 min-h-[120px] ${phrase.bgClass}`}
              aria-label={phrase.text}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <Icon size={32} className="text-foreground/80" strokeWidth={1.8} />
              <span className="text-sm font-medium text-foreground text-center leading-snug">
                {phrase.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { defaultPhrases, iconMap };
export default TalkTab;
