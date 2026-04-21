import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("haven-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("haven-theme", dark ? "dark" : "light");
    const timer = setTimeout(() => root.classList.remove("theme-transitioning"), 850);
    return () => clearTimeout(timer);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="p-2.5 rounded-xl text-muted-foreground transition-all duration-300 ease-out hover:bg-card hover:text-foreground active:scale-95"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
};

export default ThemeToggle;
