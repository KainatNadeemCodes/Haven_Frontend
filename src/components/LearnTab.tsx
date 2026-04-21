import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { stories } from "./learn/storyData";
import StoryViewer from "./learn/StoryViewer";

const LearnTab = () => {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const activeStory = stories.find((s) => s.id === activeStoryId);

  if (activeStory) {
    return (
      <StoryViewer
        story={activeStory}
        onClose={() => setActiveStoryId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center px-6 pt-6 pb-32">
      {/* Section header */}
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="text-xl font-display font-semibold text-foreground mb-1.5">
          Social Stories
        </h2>
        <p className="text-sm text-muted-foreground">
          Gentle guides for everyday moments
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {stories.map((s, index) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStoryId(s.id)}
              className="premium-card flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 text-left"
              aria-label={s.title}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                <Icon size={22} className="text-foreground/80" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50">{s.steps.length} steps</span>
                <ArrowLeft size={16} className="rotate-180 text-muted-foreground/40" strokeWidth={2} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LearnTab;
