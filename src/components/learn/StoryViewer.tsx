import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Volume2, VolumeX, Type } from "lucide-react";
import type { Story } from "./storyData";
import StoryScene from "./StoryScene";

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

type TextSizeOption = "normal" | "large" | "extra";
const textSizes: { id: TextSizeOption; label: string; bodyClass: string; titleClass: string }[] = [
  { id: "normal", label: "A", bodyClass: "text-sm", titleClass: "text-base" },
  { id: "large", label: "A", bodyClass: "text-base", titleClass: "text-lg" },
  { id: "extra", label: "A", bodyClass: "text-lg", titleClass: "text-xl" },
];

const StoryViewer = ({ story, onClose }: StoryViewerProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [textSize, setTextSize] = useState<TextSizeOption>("normal");
  const [readAloud, setReadAloud] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const step = story.steps[stepIndex];
  const sizeConfig = textSizes.find((s) => s.id === textSize) || textSizes[0];
  const isLast = stepIndex === story.steps.length - 1;
  const isFirst = stepIndex === 0;

  // Cancel speech on unmount or step change
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Read aloud when toggled or when step changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    if (readAloud && step) {
      const text = `${step.title}. ${step.description}`;
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.85;
      utt.pitch = 1.0;
      utteranceRef.current = utt;
      // Small delay for fade transition
      setTimeout(() => window.speechSynthesis?.speak(utt), 400);
    }
  }, [readAloud, stepIndex, step]);

  const goTo = useCallback((next: number) => {
    window.speechSynthesis?.cancel();
    setTransitioning(true);
    setTimeout(() => {
      setStepIndex(next);
      setTransitioning(false);
    }, 250);
  }, []);

  const handleClose = useCallback(() => {
    window.speechSynthesis?.cancel();
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-muted-foreground p-2 -ml-2 rounded-xl hover:bg-card hover:text-foreground transition-all duration-300"
          aria-label="Back to stories"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Text size selector */}
          {textSizes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setTextSize(s.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                textSize === s.id
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-card"
              }`}
              aria-label={`Text size ${s.id}`}
            >
              <Type size={i === 0 ? 14 : i === 1 ? 17 : 20} strokeWidth={2} />
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-border mx-1" />

          {/* Read aloud toggle */}
          <button
            onClick={() => setReadAloud((v) => !v)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              readAloud
                ? "bg-primary/12 text-primary"
                : "text-muted-foreground hover:bg-card"
            }`}
            aria-label={readAloud ? "Turn off read aloud" : "Read aloud"}
          >
            {readAloud ? <Volume2 size={17} strokeWidth={2} /> : <VolumeX size={17} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Story title */}
      <div className="text-center px-6 pb-2">
        <h2 className="text-lg font-display font-semibold text-foreground">{story.title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Step {stepIndex + 1} of {story.steps.length}
        </p>
      </div>

      {/* Step indicator dots */}
      <div className="flex justify-center gap-1.5 pb-4 px-6">
        {story.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === stepIndex ? "w-7 bg-primary" : i < stepIndex ? "w-3 bg-primary/30" : "w-1.5 bg-border"
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Scene content — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div
          className={`max-w-md mx-auto transition-all duration-250 ease-out ${
            transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Illustrated scene */}
          <StoryScene
            icon={step.icon}
            sceneColor={step.sceneColor}
            storyColor={story.color}
            title={step.title}
          />

          {/* Dialogue bubble */}
          {step.dialogue && (
            <div className="mt-4 mx-4">
              <div className="relative bg-card border border-border/50 rounded-2xl px-5 py-3.5">
                {/* Speech triangle */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-card border-l border-t border-border/50 rotate-45" />
                <p className={`${sizeConfig.bodyClass} text-foreground/80 leading-relaxed italic relative z-10`}>
                  "{step.dialogue}"
                </p>
              </div>
            </div>
          )}

          {/* Step text content */}
          <div className="mt-5 px-1">
            <h3 className={`${sizeConfig.titleClass} font-display font-semibold text-foreground mb-2`}>
              {step.title}
            </h3>
            <p className={`${sizeConfig.bodyClass} text-foreground/70 leading-relaxed`}>
              {step.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom navigation — fixed, high z-index to sit above BottomNav */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-background border-t border-border/30 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex gap-3 max-w-md mx-auto">
          {!isFirst && (
            <button
              onClick={() => goTo(stepIndex - 1)}
              className="flex-1 py-3.5 rounded-xl bg-card border border-border text-foreground font-medium text-sm transition-all duration-300 hover:bg-muted active:scale-[0.97]"
            >
              ← Previous
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => goTo(stepIndex + 1)}
              className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
            >
              ✓ Finished
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
