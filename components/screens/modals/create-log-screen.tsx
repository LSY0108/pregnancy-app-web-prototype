"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { 
  BloomButton, 
  BloomTextarea, 
  HelperText, 
  SectionTitle,
  Chip,
  BloomCard
} from "@/components/bloom-ui";
import { ArrowLeft, Smile, Meh, Frown, CloudRain, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const moods = [
  { id: "great", label: "Great", icon: Sparkles, color: "bg-success/20 text-success" },
  { id: "good", label: "Good", icon: Smile, color: "bg-sage/20 text-sage-foreground" },
  { id: "okay", label: "Okay", icon: Meh, color: "bg-accent/20 text-accent-foreground" },
  { id: "low", label: "Low", icon: Frown, color: "bg-warning/20 text-warning-foreground" },
  { id: "difficult", label: "Difficult", icon: CloudRain, color: "bg-lavender/20 text-lavender-foreground" },
];

const symptoms = [
  "Nausea", "Fatigue", "Back Pain", "Headache", "Swelling",
  "Heartburn", "Insomnia", "Cramps", "Dizziness", "Mood Swings",
  "Food Cravings", "Breast Tenderness", "Frequent Urination", "Constipation"
];

export function CreateLogScreen() {
  const { goBack } = useApp();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("");
  const [waterIntake, setWaterIntake] = useState(4);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    // Save log entry
    goBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Daily Log</h1>
        </div>
        <BloomButton variant="primary" size="sm" onClick={handleSave}>
          Save
        </BloomButton>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Date */}
        <div className="mb-6">
          <HelperText className="text-center">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </HelperText>
        </div>

        {/* Mood Section */}
        <div className="mb-8">
          <SectionTitle className="mb-4">How are you feeling today?</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl transition-all",
                    isSelected 
                      ? `${mood.color} ring-2 ring-current ring-offset-2` 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="mb-8">
          <SectionTitle className="mb-4">Any symptoms?</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all",
                    isSelected
                      ? "bg-primary/15 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground border-2 border-transparent"
                  )}
                >
                  {symptom}
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight Section */}
        <div className="mb-8">
          <SectionTitle className="mb-4">Weight (optional)</SectionTitle>
          <BloomCard>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 text-2xl font-medium bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
              <span className="text-muted-foreground">kg</span>
            </div>
          </BloomCard>
        </div>

        {/* Water Intake */}
        <div className="mb-8">
          <SectionTitle className="mb-4">Water intake</SectionTitle>
          <BloomCard>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterIntake(i + 1)}
                    className={cn(
                      "w-8 h-10 rounded-lg transition-all",
                      i < waterIntake ? "bg-primary/80" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-foreground">{waterIntake} cups</span>
            </div>
          </BloomCard>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <SectionTitle className="mb-4">Notes</SectionTitle>
          <BloomTextarea
            placeholder="How was your day? Any thoughts to capture..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
