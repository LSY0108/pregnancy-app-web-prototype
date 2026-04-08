"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { BloomButton, BloomInput, HelperText, SegmentedControl } from "@/components/bloom-ui";
import { ArrowLeft, Calendar, Baby, Heart } from "lucide-react";

type SetupMethod = "due-date" | "last-period" | "conception";

export function PregnancySetupScreen() {
  const { navigate, completeOnboarding, updatePregnancyInfo } = useApp();
  const [method, setMethod] = useState<SetupMethod>("due-date");
  const [dueDate, setDueDate] = useState("");
  const [lastPeriod, setLastPeriod] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [babyNickname, setBabyNickname] = useState("");

  const calculateWeeks = () => {
    // Simplified calculation - in real app would be more precise
    const today = new Date();
    let targetDate: Date | null = null;
    
    if (method === "due-date" && dueDate) {
      targetDate = new Date(dueDate);
      const daysUntilDue = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const totalPregnancyDays = 280;
      const daysPregnant = totalPregnancyDays - daysUntilDue;
      const weeks = Math.floor(daysPregnant / 7);
      const days = daysPregnant % 7;
      return { weeks, days, daysRemaining: daysUntilDue };
    }
    
    return { weeks: 0, days: 0, daysRemaining: 280 };
  };

  const handleComplete = () => {
    const { weeks, days, daysRemaining } = calculateWeeks();
    updatePregnancyInfo({
      dueDate: dueDate || null,
      currentWeek: weeks || 24,
      currentDay: days || 3,
      daysRemaining: daysRemaining || 112,
      babyNickname: babyNickname || "Little Bean",
    });
    completeOnboarding();
  };

  const canContinue = 
    (method === "due-date" && dueDate) ||
    (method === "last-period" && lastPeriod) ||
    (method === "conception" && conceptionDate);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <button
          onClick={() => navigate("onboarding-3")}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-medium text-foreground">Pregnancy Setup</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-foreground">{"Let's calculate your timeline"}</h2>
          <HelperText>This helps us show you the right information for your stage</HelperText>
        </div>

        {/* Method Selection */}
        <div className="mb-6">
          <SegmentedControl
            options={[
              { value: "due-date", label: "Due Date" },
              { value: "last-period", label: "Last Period" },
              { value: "conception", label: "Conception" },
            ]}
            value={method}
            onChange={(v) => setMethod(v as SetupMethod)}
          />
        </div>

        {/* Date Input based on method */}
        <div className="flex flex-col gap-6">
          {method === "due-date" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">When is your due date?</span>
              </div>
              <BloomInput
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                helper="Your estimated due date from your healthcare provider"
              />
            </div>
          )}

          {method === "last-period" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">First day of your last period?</span>
              </div>
              <BloomInput
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                helper="We'll calculate your estimated due date"
              />
            </div>
          )}

          {method === "conception" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Approximate conception date?</span>
              </div>
              <BloomInput
                type="date"
                value={conceptionDate}
                onChange={(e) => setConceptionDate(e.target.value)}
                helper="If you know when conception occurred"
              />
            </div>
          )}

          {/* Baby Nickname */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Baby className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Give your baby a nickname</span>
            </div>
            <BloomInput
              type="text"
              placeholder="Little Bean, Peanut, etc."
              value={babyNickname}
              onChange={(e) => setBabyNickname(e.target.value)}
              helper="Optional - we'll use this throughout the app"
            />
          </div>

          {/* Encouragement Card */}
          <div className="mt-4 px-4 py-4 bg-emotional/10 rounded-2xl">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-emotional-foreground italic leading-relaxed">
                {"This is just the beginning of an amazing journey. We're honored to be part of it with you."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <BloomButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleComplete}
          disabled={!canContinue}
        >
          Complete Setup
        </BloomButton>
      </div>
    </div>
  );
}
