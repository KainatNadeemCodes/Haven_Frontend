import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePreparation } from "@/services/preparationService";
import type { PrepMode, PrepResult } from "./types";
import PrepModeSelector from "./PrepModeSelector";
import PrepInputForm from "./PrepInputForm";
import PrepResultView from "./PrepResultView";

type Step = "mode" | "input" | "loading" | "result";

const PrepareTab = () => {
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<PrepMode>("prepare");
  const [result, setResult] = useState<PrepResult | null>(null);
  const { toast } = useToast();

  const handleModeSelect = (m: PrepMode) => {
    setMode(m);
    setStep("input");
  };

  const handleSubmit = async (situation: string, details: string, age: string) => {
    setStep("loading");
    try {
      const data = await generatePreparation({ mode, situation, details, age });
      setResult(data);
      setStep("result");
    } catch (e: any) {
      toast({
        title: "Something went wrong",
        description: e.message || "Could not generate the plan. Please try again.",
        variant: "destructive",
      });
      setStep("input");
    }
  };

  const handleBack = () => {
    if (step === "input") setStep("mode");
    else if (step === "result") setStep("input");
  };

  const handleReset = () => {
    setResult(null);
    setStep("mode");
  };

  return (
    <div className="flex flex-col px-6 pt-4 pb-32">
      {/* Header with back button */}
      {step !== "mode" && step !== "loading" && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 self-start"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}

      {step === "mode" && (
        <div className="animate-fade-up">
          <div className="text-center mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-1.5">
              Preparation Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose how you would like to prepare
            </p>
          </div>
          <PrepModeSelector onSelect={handleModeSelect} />
        </div>
      )}

      {step === "input" && (
        <div className="animate-fade-up">
          <PrepInputForm mode={mode} onSubmit={handleSubmit} />
        </div>
      )}

      {step === "loading" && (
        <div
          className="flex flex-col items-center justify-center py-20 animate-fade-up"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 size={36} className="text-primary animate-spin mb-4" aria-hidden="true" />
          <p className="text-foreground font-display font-medium">Creating your plan</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
          <span className="sr-only">Generating your preparation plan, please wait.</span>
        </div>
      )}

      {step === "result" && result && (
        <div className="animate-fade-up">
          <PrepResultView mode={mode} result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
};

export default PrepareTab;
