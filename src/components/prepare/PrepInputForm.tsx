import { useState } from "react";
import type { PrepMode } from "./types";

const modeLabels: Record<PrepMode, string> = {
  prepare: "What situation do you want to prepare for?",
  practice: "What conversation do you want to practice?",
  understand: "What event or situation do you want to understand?",
  plan: "What situation do you need a coping plan for?",
};

const modeExamples: Record<PrepMode, string> = {
  prepare: "e.g. Going to the dentist for a check-up",
  practice: "e.g. Ordering food at a restaurant",
  understand: "e.g. A fire drill at school",
  plan: "e.g. Attending a birthday party",
};

interface Props {
  mode: PrepMode;
  onSubmit: (situation: string, details: string, age: string) => void;
}

const PrepInputForm = ({ mode, onSubmit }: Props) => {
  const [situation, setSituation] = useState("");
  const [details, setDetails] = useState("");
  const [age, setAge] = useState("child");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    onSubmit(situation.trim(), details.trim(), age);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground capitalize">{mode}</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {modeLabels[mode]}
        </label>
        <input
          type="text"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={modeExamples[mode]}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors text-base"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Additional details (optional)
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Any specific concerns, triggers, or things to include"
          className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors text-base min-h-[80px] resize-none"
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Age group
        </label>
        <div className="flex gap-2">
          {["child", "teen", "adult"].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAge(a)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors capitalize ${
                age === a
                  ? "bg-primary/12 border-primary/30 text-primary"
                  : "bg-card border-border/40 text-muted-foreground hover:border-border"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!situation.trim()}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Generate {mode === "prepare" ? "Story" : mode === "practice" ? "Dialogue" : mode === "understand" ? "Explanation" : "Plan"}
      </button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Results should be reviewed by a caregiver before use
      </p>
    </form>
  );
};

export default PrepInputForm;
