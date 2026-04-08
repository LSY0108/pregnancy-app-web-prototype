"use client";

import { useApp } from "@/lib/app-context";
import { BloomButton, HelperText } from "@/components/bloom-ui";
import { Baby, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSelectionScreen() {
  const { navigate, setUserRole, userProfile } = useApp();

  const handleSelectRole = (role: "mother" | "guardian") => {
    setUserRole(role);
  };

  const handleContinue = () => {
    if (userProfile.role === "mother") {
      navigate("onboarding-1");
    } else {
      navigate("guardian-connect");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 pb-8 pt-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-semibold text-foreground">How will you use Bloom?</h1>
        <HelperText>Choose your role to personalize your experience</HelperText>
      </div>

      {/* Role Options */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Mother Role */}
        <button
          onClick={() => handleSelectRole("mother")}
          className={cn(
            "flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left",
            userProfile.role === "mother"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            userProfile.role === "mother" ? "bg-primary/15" : "bg-muted"
          )}>
            <Baby className={cn(
              "w-7 h-7",
              userProfile.role === "mother" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium text-foreground">{"I'm the Mother"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track your pregnancy journey, log symptoms and moods, and receive personalized care tips
            </p>
          </div>
        </button>

        {/* Guardian Role */}
        <button
          onClick={() => handleSelectRole("guardian")}
          className={cn(
            "flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left",
            userProfile.role === "guardian"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            userProfile.role === "guardian" ? "bg-primary/15" : "bg-muted"
          )}>
            <Users className={cn(
              "w-7 h-7",
              userProfile.role === "guardian" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium text-foreground">{"I'm a Guardian"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Partner, family member, or friend supporting someone through their pregnancy
            </p>
          </div>
        </button>

        {/* Emotional Support Message */}
        <div className="mt-auto px-4 py-4 bg-emotional/10 rounded-2xl">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-emotional-foreground italic leading-relaxed">
              {userProfile.role === "mother"
                ? "Every pregnancy is unique, and so is yours. We're here to support you every step of the way."
                : userProfile.role === "guardian"
                ? "Your support means the world. Being there for someone during this journey is a beautiful gift."
                : "Whoever you are, thank you for being here. This journey is better together."}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <BloomButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!userProfile.role}
        >
          Continue
        </BloomButton>
      </div>
    </div>
  );
}
