"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import {
  AppHeader,
  SectionTitle,
  BloomCard,
  CardTitle,
  BodyText,
  HelperText,
  StatPill,
  FloatingActionButton,
  EmptyState,
} from "@/components/bloom-ui";
import { Plus, Calendar, Smile, Meh, Frown, Sparkles, CloudRain, ChevronLeft, ChevronRight, Scale, Droplets, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const moodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  great: Sparkles,
  good: Smile,
  okay: Meh,
  low: Frown,
  difficult: CloudRain,
};

const moodColors: Record<string, string> = {
  great: "bg-success/20 text-success",
  good: "bg-sage/20 text-sage-foreground",
  okay: "bg-accent/20 text-accent-foreground",
  low: "bg-warning/20 text-warning-foreground",
  difficult: "bg-lavender/20 text-lavender-foreground",
};

// Sample log entries
const sampleLogs = [
  {
    date: "2026-04-08",
    mood: "good",
    symptoms: ["Back Pain", "Fatigue"],
    weight: "62.5",
    water: 6,
    sleep: 7.5,
    notes: "Feeling pretty good today. Baby has been very active!",
  },
  {
    date: "2026-04-07",
    mood: "okay",
    symptoms: ["Nausea", "Fatigue", "Heartburn"],
    weight: "62.3",
    water: 5,
    sleep: 6,
    notes: "",
  },
  {
    date: "2026-04-06",
    mood: "great",
    symptoms: [],
    weight: "62.4",
    water: 8,
    sleep: 8,
    notes: "Had a wonderful day. Felt lots of kicks!",
  },
];

export function LogScreen() {
  const { navigate } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const currentLog = sampleLogs.find(log => log.date === formatDate(selectedDate));

  const goToPrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  return (
    <div className="flex flex-col pb-24 relative">
      <AppHeader 
        title="Daily Log" 
        subtitle="Track your daily wellness"
      />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {/* Date Selector */}
        <BloomCard className="bg-secondary/50">
          <div className="flex items-center justify-between">
            <button 
              onClick={goToPrevDay}
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center transition-opacity hover:bg-card/80"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {selectedDate.toLocaleDateString("en-US", { 
                    weekday: "short",
                    month: "short", 
                    day: "numeric" 
                  })}
                </span>
              </div>
              {isToday && <HelperText className="text-primary">Today</HelperText>}
            </div>
            <button 
              onClick={goToNextDay}
              disabled={isToday}
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-card/80"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Week View */}
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              const dateStr = formatDate(date);
              const hasLog = sampleLogs.some(log => log.date === dateStr);
              const isSelected = formatDate(selectedDate) === dateStr;
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-center transition-all",
                    isSelected ? "bg-primary text-primary-foreground" : hasLog ? "bg-sage/20" : "bg-muted"
                  )}
                >
                  <p className={cn(
                    "text-[10px] uppercase",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                  </p>
                  <p className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {date.getDate()}
                  </p>
                </button>
              );
            })}
          </div>
        </BloomCard>

        {currentLog ? (
          <>
            {/* Mood */}
            <div className="flex flex-col gap-3">
              <SectionTitle>Mood</SectionTitle>
              <BloomCard>
                <div className="flex items-center gap-4">
                  {(() => {
                    const MoodIcon = moodIcons[currentLog.mood];
                    return (
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        moodColors[currentLog.mood]
                      )}>
                        <MoodIcon className="w-7 h-7" />
                      </div>
                    );
                  })()}
                  <div>
                    <CardTitle className="capitalize">{currentLog.mood}</CardTitle>
                    <HelperText>Logged at 9:30 AM</HelperText>
                  </div>
                </div>
              </BloomCard>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              {currentLog.weight && (
                <StatPill icon={Scale} label="Weight" value={`${currentLog.weight}kg`} />
              )}
              <StatPill icon={Droplets} label="Water" value={`${currentLog.water} cups`} variant="primary" />
              <StatPill icon={Moon} label="Sleep" value={`${currentLog.sleep}h`} />
            </div>

            {/* Symptoms */}
            {currentLog.symptoms.length > 0 && (
              <div className="flex flex-col gap-3">
                <SectionTitle>Symptoms</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {currentLog.symptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {currentLog.notes && (
              <div className="flex flex-col gap-3">
                <SectionTitle>Notes</SectionTitle>
                <BloomCard className="bg-muted/50">
                  <BodyText className="text-muted-foreground italic">
                    {`"${currentLog.notes}"`}
                  </BodyText>
                </BloomCard>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No log for this day"
            description="You haven't recorded anything for this day yet."
            actionLabel="Create Log"
            onAction={() => navigate("create-log")}
          />
        )}

        {/* Log History Summary */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between">
            <SectionTitle>Recent Logs</SectionTitle>
            <button className="text-sm text-primary font-medium">See all</button>
          </div>
          {sampleLogs.slice(0, 3).map((log, index) => {
            const MoodIcon = moodIcons[log.mood];
            const logDate = new Date(log.date);
            return (
              <BloomCard 
                key={index} 
                interactive
                onClick={() => setSelectedDate(logDate)}
                className="flex items-center gap-3"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  moodColors[log.mood]
                )}>
                  <MoodIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {logDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <HelperText>
                    {log.symptoms.length > 0 ? log.symptoms.slice(0, 2).join(", ") : "No symptoms"}
                  </HelperText>
                </div>
              </BloomCard>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={Plus} 
        onClick={() => navigate("create-log")}
      />
    </div>
  );
}
