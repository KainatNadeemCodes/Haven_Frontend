import { Leaf, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HavenHeaderProps {
  onOpenDashboard: () => void;
}

const HavenHeader = ({ onOpenDashboard }: HavenHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 pt-8 pb-4 animate-fade-up">
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
          Haven
        </h1>
        <Leaf size={18} className="text-primary" strokeWidth={2.2} />
      </div>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenDashboard}
                className="relative p-2.5 rounded-xl text-muted-foreground transition-all duration-300 ease-out hover:bg-card hover:text-foreground active:scale-95 select-none"
                aria-label="Open caregiver dashboard"
              >
                <Settings size={20} strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Caregiver Dashboard
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default HavenHeader;
