"use client";

import { Home, Calendar, PenLine, CalendarClock, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "weekly" | "log" | "schedule" | "profile";

interface MobileShellProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: LucideIcon; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "weekly", icon: Calendar, label: "Weekly" },
  { id: "log", icon: PenLine, label: "Log" },
  { id: "schedule", icon: CalendarClock, label: "Schedule" },
  { id: "profile", icon: User, label: "Profile" },
];

export function MobileShell({ children, activeTab, onTabChange }: MobileShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Safe area top */}
      <div className="h-[env(safe-area-inset-top)]" />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-transform duration-200", 
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive && "text-primary"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
