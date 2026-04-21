import { Cloud, MessageCircle, BookOpen, Sparkles } from "lucide-react";

interface BottomNavProps {
  activeTab: "calm" | "talk" | "learn" | "prepare";
  onTabChange: (tab: "calm" | "talk" | "learn" | "prepare") => void;
}

const tabs = [
  { id: "calm" as const, label: "Calm", icon: Cloud },
  { id: "talk" as const, label: "Talk", icon: MessageCircle },
  { id: "learn" as const, label: "Learn", icon: BookOpen },
  { id: "prepare" as const, label: "Prepare", icon: Sparkles },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-4 mb-4 rounded-2xl bg-card/90 glass-surface border border-border/40 shadow-[0_-2px_20px_-8px_hsl(var(--shadow-color)/0.06)]">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ease-out min-w-[64px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={tab.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} fill={isActive ? "hsl(var(--primary))" : "none"} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
