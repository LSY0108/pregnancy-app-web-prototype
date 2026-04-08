"use client";

import { useApp } from "@/lib/app-context";
import { BloomCard, CardTitle, BodyText, SectionTitle, BloomButton } from "@/components/bloom-ui";
import { 
  ArrowLeft, 
  Phone, 
  AlertTriangle, 
  Heart,
  Activity,
  Droplets,
  Eye,
  ThermometerSun,
  HeartPulse
} from "lucide-react";
import { cn } from "@/lib/utils";

const emergencySymptoms = [
  {
    icon: Droplets,
    title: "Heavy Bleeding",
    description: "Bright red bleeding, soaking more than one pad per hour",
    severity: "critical",
  },
  {
    icon: Activity,
    title: "Severe Abdominal Pain",
    description: "Intense, persistent pain that doesn't go away with rest",
    severity: "critical",
  },
  {
    icon: HeartPulse,
    title: "Reduced Baby Movement",
    description: "Noticeable decrease in baby's usual movement pattern",
    severity: "urgent",
  },
  {
    icon: Eye,
    title: "Vision Changes",
    description: "Blurry vision, seeing spots, or flashing lights",
    severity: "urgent",
  },
  {
    icon: ThermometerSun,
    title: "High Fever",
    description: "Temperature above 38°C (100.4°F) with chills",
    severity: "urgent",
  },
  {
    icon: Heart,
    title: "Chest Pain or Difficulty Breathing",
    description: "Tightness in chest, shortness of breath, or racing heart",
    severity: "critical",
  },
];

const severityColors = {
  critical: "bg-destructive/10 border-destructive/30 text-destructive",
  urgent: "bg-warning/20 border-warning/30 text-warning-foreground",
};

export function EmergencyGuideScreen() {
  const { goBack } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-medium text-foreground">Emergency Guide</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Emergency Call */}
        <BloomCard className="bg-destructive/10 border-destructive/20 mb-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center">
              <Phone className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Emergency?</CardTitle>
              <BodyText className="text-destructive/80 mt-1">
                If you&apos;re experiencing a medical emergency, call immediately
              </BodyText>
            </div>
            <BloomButton 
              variant="warning" 
              size="lg" 
              className="w-full mt-2"
              onClick={() => window.location.href = "tel:119"}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call 119
            </BloomButton>
          </div>
        </BloomCard>

        {/* Warning Signs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning-foreground" />
            <SectionTitle>Warning Signs to Watch</SectionTitle>
          </div>
          
          <div className="flex flex-col gap-3">
            {emergencySymptoms.map((symptom, index) => {
              const Icon = symptom.icon;
              return (
                <BloomCard 
                  key={index}
                  className={cn(
                    "border",
                    severityColors[symptom.severity as keyof typeof severityColors]
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      symptom.severity === "critical" ? "bg-destructive/20" : "bg-warning/30"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        symptom.severity === "critical" ? "text-destructive" : "text-warning-foreground"
                      )} />
                    </div>
                    <div>
                      <CardTitle className={
                        symptom.severity === "critical" ? "text-destructive" : "text-warning-foreground"
                      }>
                        {symptom.title}
                      </CardTitle>
                      <BodyText className="text-muted-foreground mt-0.5">
                        {symptom.description}
                      </BodyText>
                    </div>
                  </div>
                </BloomCard>
              );
            })}
          </div>
        </div>

        {/* When to Call */}
        <BloomCard className="bg-sage/10 mb-6">
          <CardTitle className="mb-2">When in Doubt</CardTitle>
          <BodyText className="text-muted-foreground leading-relaxed">
            Trust your instincts. If something feels wrong, it&apos;s always better to call your 
            healthcare provider and check. You know your body best.
          </BodyText>
        </BloomCard>

        {/* Your Contacts */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-3">Your Healthcare Contacts</SectionTitle>
          <BloomCard>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">OB/GYN</p>
                  <p className="text-xs text-muted-foreground">Add your doctor&apos;s number</p>
                </div>
                <BloomButton variant="secondary" size="sm">
                  Add
                </BloomButton>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Hospital</p>
                  <p className="text-xs text-muted-foreground">Add hospital number</p>
                </div>
                <BloomButton variant="secondary" size="sm">
                  Add
                </BloomButton>
              </div>
            </div>
          </BloomCard>
        </div>

        {/* Reassurance */}
        <div className="px-4 py-4 bg-emotional/10 rounded-2xl">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-emotional-foreground italic leading-relaxed">
              Having this guide doesn&apos;t mean something will go wrong. It&apos;s simply about being 
              prepared, so you can feel more confident throughout your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
