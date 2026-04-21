import { useState, useCallback } from "react";
import HavenHeader from "@/components/HavenHeader";
import BottomNav from "@/components/BottomNav";
import CalmTab from "@/components/CalmTab";
import TalkTab from "@/components/TalkTab";
import LearnTab from "@/components/LearnTab";
import PrepareTab from "@/components/prepare/PrepareTab";
import CaregiverDashboard from "@/components/CaregiverDashboard";
import OnboardingSplash from "@/components/OnboardingSplash";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"calm" | "talk" | "learn" | "prepare">("calm");
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("haven-splash-seen");
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("haven-splash-seen", "1");
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {showSplash && <OnboardingSplash onComplete={handleSplashComplete} />}
      {showDashboard && (
        <CaregiverDashboard onClose={() => setShowDashboard(false)} />
      )}
      <HavenHeader onOpenDashboard={() => setShowDashboard(true)} />
      <main>
        {activeTab === "calm" && <CalmTab />}
        {activeTab === "talk" && <TalkTab />}
        {activeTab === "learn" && <LearnTab />}
        {activeTab === "prepare" && <PrepareTab />}
      </main>
      <div className="flex justify-center pb-28 pt-4">
        <button
          onClick={() => setShowDashboard(true)}
          className="px-4 py-2 rounded-xl border border-border/50 bg-card/60 text-muted-foreground text-sm font-medium hover:bg-card hover:text-foreground hover:border-border transition-all duration-300"
        >
          Caregiver Mode
        </button>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
