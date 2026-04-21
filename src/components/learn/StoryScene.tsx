import type { LucideIcon } from "lucide-react";

interface StorySceneProps {
  icon: LucideIcon;
  sceneColor: string;
  storyColor: string;
  title: string;
}

/**
 * Renders a soft pastel illustrated scene card with the step icon
 * and gentle decorative elements. Designed for sensory safety.
 */
const StoryScene = ({ icon: Icon, sceneColor, storyColor, title }: StorySceneProps) => {
  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-2xl ${sceneColor} overflow-hidden flex items-center justify-center`}
      aria-label={`Illustration for: ${title}`}
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft cloud-like shapes */}
        <div className="absolute top-4 left-6 w-20 h-10 rounded-full bg-background/40" />
        <div className="absolute top-6 left-14 w-14 h-8 rounded-full bg-background/30" />
        <div className="absolute top-3 right-8 w-16 h-8 rounded-full bg-background/25" />

        {/* Ground element */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-background/20 rounded-t-[40%]" />

        {/* Gentle dots decoration */}
        <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-primary/15" />
        <div className="absolute bottom-12 left-14 w-1.5 h-1.5 rounded-full bg-primary/10" />
        <div className="absolute bottom-6 right-12 w-2.5 h-2.5 rounded-full bg-primary/12" />
        <div className="absolute top-12 right-16 w-1.5 h-1.5 rounded-full bg-primary/10" />
      </div>

      {/* Central character / icon */}
      <div className="relative flex flex-col items-center gap-3">
        {/* Character body (soft rounded shape) */}
        <div className={`w-24 h-24 rounded-3xl ${storyColor} flex items-center justify-center shadow-sm`}>
          <Icon size={40} className="text-foreground/70" strokeWidth={1.5} />
        </div>
        {/* Character shadow */}
        <div className="w-16 h-2 rounded-full bg-foreground/5" />
      </div>
    </div>
  );
};

export default StoryScene;
