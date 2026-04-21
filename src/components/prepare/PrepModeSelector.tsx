import { BookOpen, MessageCircle, HelpCircle, Shield } from "lucide-react";
import type { PrepMode } from "./types";

const modes: { id: PrepMode; label: string; description: string; icon: typeof BookOpen }[] = [
  {
    id: "prepare",
    label: "Prepare",
    description: "Generate a personalized social story with step-by-step guidance",
    icon: BookOpen,
  },
  {
    id: "practice",
    label: "Practice",
    description: "Controlled dialogue simulation to rehearse conversations",
    icon: MessageCircle,
  },
  {
    id: "understand",
    label: "Understand",
    description: "Clear, literal explanation of an event or situation",
    icon: HelpCircle,
  },
  {
    id: "plan",
    label: "Plan",
    description: "Sensory expectations and coping strategy generator",
    icon: Shield,
  },
];

interface Props {
  onSelect: (mode: PrepMode) => void;
}

const PrepModeSelector = ({ onSelect }: Props) => {
  return (
    <div className="grid gap-3 max-w-sm mx-auto">
      {modes.map((m) => {
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="premium-card flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-sage/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={22} className="text-foreground/70" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-base font-display font-semibold text-foreground">{m.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{m.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PrepModeSelector;
