import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight, Eye, Ear, Hand, Wind as Nose, Utensils, AlertTriangle, CheckCircle2, Shield, MessageCircle } from "lucide-react";
import type { PrepMode, PrepResult, PrepareResult, PracticeResult, UnderstandResult, PlanResult } from "./types";

interface Props {
  mode: PrepMode;
  result: PrepResult;
  onReset: () => void;
}

const senseIcons: Record<string, typeof Eye> = {
  Sight: Eye,
  Sound: Ear,
  Touch: Hand,
  Smell: Nose,
  Taste: Utensils,
};

const intensityColor: Record<string, string> = {
  low: "text-primary",
  medium: "text-secondary",
  high: "text-destructive",
};

const PrepResultView = ({ mode, result, onReset }: Props) => {
  return (
    <div className="max-w-sm mx-auto">
      {mode === "prepare" && <PrepareView result={result as PrepareResult} />}
      {mode === "practice" && <PracticeView result={result as PracticeResult} />}
      {mode === "understand" && <UnderstandView result={result as UnderstandResult} />}
      {mode === "plan" && <PlanView result={result as PlanResult} />}

      <div className="mt-8 mb-4 flex flex-col gap-3">
        <p className="text-xs text-center text-muted-foreground">
          Please have a caregiver review this plan before using it
        </p>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border/50 bg-card text-foreground font-medium transition-colors hover:border-border"
        >
          <RotateCcw size={16} />
          <span className="text-sm">Start over</span>
        </button>
      </div>
    </div>
  );
};

// ---- Prepare (Social Story) ----
const PrepareView = ({ result }: { result: PrepareResult }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = result.steps || [];
  const step = steps[currentStep];

  if (!step) return null;

  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-foreground text-center mb-1">{result.title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">{result.summary}</p>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <h4 className="text-base font-display font-semibold text-foreground">{step.title}</h4>
        <p className="text-sm text-foreground leading-relaxed">{step.description}</p>

        <div className="rounded-xl bg-sage/20 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">What you might notice</p>
          <p className="text-sm text-foreground">{step.sensory}</p>
        </div>

        <div className="rounded-xl bg-calm-blue/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Helpful strategy</p>
          <p className="text-sm text-foreground">{step.coping}</p>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground italic">{step.reassurance}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-border/40 bg-card text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ---- Practice (Dialogue Simulation) ----
const PracticeView = ({ result }: { result: PracticeResult }) => {
  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-foreground text-center mb-1">{result.title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">{result.context}</p>

      <div className="space-y-3">
        {result.exchanges?.map((ex, i) => (
          <div key={i} className={`flex ${ex.speaker === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              ex.speaker === "You"
                ? "bg-primary/12 border border-primary/20"
                : "bg-card border border-border/40"
            }`}>
              <p className="text-xs font-medium text-muted-foreground mb-1">{ex.speaker}</p>
              <p className="text-sm text-foreground leading-relaxed">"{ex.dialogue}"</p>
              {ex.note && <p className="text-xs text-muted-foreground mt-2 italic">{ex.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {result.tips && result.tips.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border/40 bg-card p-5">
          <p className="text-sm font-display font-semibold text-foreground mb-3">Helpful tips</p>
          <ul className="space-y-2">
            {result.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-sm text-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ---- Understand (Explanation) ----
const UnderstandView = ({ result }: { result: UnderstandResult }) => {
  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-foreground text-center mb-6">{result.title}</h3>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border/40 bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground mb-1">What it is</p>
          <p className="text-sm text-foreground leading-relaxed">{result.whatItIs}</p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground mb-1">Why it happens</p>
          <p className="text-sm text-foreground leading-relaxed">{result.whyItHappens}</p>
        </div>

        {result.whatToExpect?.length > 0 && (
          <div className="rounded-2xl border border-border/40 bg-card p-5">
            <p className="text-sm font-display font-semibold text-foreground mb-3">What to expect</p>
            <div className="space-y-3">
              {result.whatToExpect.map((item, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-foreground">{item.aspect}</p>
                  <p className="text-sm text-muted-foreground">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.socialRules?.length > 0 && (
          <div className="rounded-2xl border border-border/40 bg-card p-5">
            <p className="text-sm font-display font-semibold text-foreground mb-3">Social expectations</p>
            <ul className="space-y-2">
              {result.socialRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-1" />
                  <span className="text-sm text-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.commonQuestions?.length > 0 && (
          <div className="rounded-2xl border border-border/40 bg-card p-5">
            <p className="text-sm font-display font-semibold text-foreground mb-3">Common questions</p>
            <div className="space-y-3">
              {result.commonQuestions.map((q, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Plan (Sensory & Coping) ----
const PlanView = ({ result }: { result: PlanResult }) => {
  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-foreground text-center mb-6">{result.title}</h3>

      {result.sensoryExpectations?.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-display font-semibold text-foreground mb-3">Sensory expectations</p>
          <div className="space-y-2">
            {result.sensoryExpectations.map((s, i) => {
              const SenseIcon = senseIcons[s.sense] || Eye;
              return (
                <div key={i} className="rounded-2xl border border-border/40 bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SenseIcon size={16} className="text-foreground/60" />
                    <span className="text-sm font-medium text-foreground">{s.sense}</span>
                    <span className={`text-xs font-medium ml-auto ${intensityColor[s.intensity] || "text-muted-foreground"}`}>
                      {s.intensity}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{s.expectation}</p>
                  <p className="text-xs text-muted-foreground">{s.strategy}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.copingStrategies?.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-display font-semibold text-foreground mb-3">Coping strategies</p>
          <div className="space-y-2">
            {result.copingStrategies.map((c, i) => (
              <div key={i} className="rounded-2xl border border-border/40 bg-card p-4">
                <p className="text-sm font-medium text-foreground mb-1">{c.strategy}</p>
                <p className="text-xs text-muted-foreground mb-1">When: {c.when}</p>
                <p className="text-xs text-muted-foreground">How: {c.how}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.exitPlan && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <p className="text-sm font-display font-semibold text-foreground">Exit plan</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Signal for a break</p>
              <p className="text-sm text-foreground">{result.exitPlan.signal}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Safe space</p>
              <p className="text-sm text-foreground">{result.exitPlan.safeSpace}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Recovery</p>
              <p className="text-sm text-foreground">{result.exitPlan.recovery}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepResultView;
