"use client";

import { useApp } from "@/lib/app-context";
import { BloomButton } from "@/components/bloom-ui";
import { Calendar, Heart, Bell, Baby, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
  illustration: React.ReactNode;
}

const slides: OnboardingSlide[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Track Your Journey",
    description: "Follow your baby's growth week by week with detailed development updates and size comparisons",
    illustration: (
      <div className="w-48 h-48 rounded-3xl bg-sage/20 flex items-center justify-center">
        <Baby className="w-24 h-24 text-sage-foreground" />
      </div>
    ),
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Care for Yourself",
    description: "Log your symptoms, moods, and daily health to better understand your body during pregnancy",
    illustration: (
      <div className="w-48 h-48 rounded-3xl bg-emotional/20 flex items-center justify-center">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>
    ),
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Stay Organized",
    description: "Never miss an appointment or supplement with gentle reminders tailored to your schedule",
    illustration: (
      <div className="w-48 h-48 rounded-3xl bg-lavender/20 flex items-center justify-center">
        <Users className="w-24 h-24 text-lavender-foreground" />
      </div>
    ),
  },
];

export function OnboardingScreen1() {
  const { navigate } = useApp();
  
  return (
    <OnboardingTemplate
      slide={slides[0]}
      currentStep={1}
      totalSteps={3}
      onNext={() => navigate("onboarding-2")}
      onSkip={() => navigate("pregnancy-setup")}
    />
  );
}

export function OnboardingScreen2() {
  const { navigate } = useApp();
  
  return (
    <OnboardingTemplate
      slide={slides[1]}
      currentStep={2}
      totalSteps={3}
      onNext={() => navigate("onboarding-3")}
      onSkip={() => navigate("pregnancy-setup")}
    />
  );
}

export function OnboardingScreen3() {
  const { navigate } = useApp();
  
  return (
    <OnboardingTemplate
      slide={slides[2]}
      currentStep={3}
      totalSteps={3}
      onNext={() => navigate("pregnancy-setup")}
      onSkip={() => navigate("pregnancy-setup")}
      isLast
    />
  );
}

function OnboardingTemplate({
  slide,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
  isLast = false,
}: {
  slide: OnboardingSlide;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background px-6 pb-8 pt-12">
      {/* Skip Button */}
      <div className="flex justify-end">
        <button
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center py-8">
        {slide.illustration}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
          {slide.icon}
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground">{slide.title}</h2>
        <p className="text-muted-foreground leading-relaxed max-w-xs">
          {slide.description}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 my-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i + 1 === currentStep
                ? "w-8 bg-primary"
                : i + 1 < currentStep
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            )}
          />
        ))}
      </div>

      {/* Actions */}
      <BloomButton
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onNext}
      >
        {isLast ? "Get Started" : "Next"}
      </BloomButton>
    </div>
  );
}
