"use client";

import { useApp } from "@/lib/app-context";
import { BloomButton, BodyText } from "@/components/bloom-ui";
import { Heart } from "lucide-react";

export function WelcomeScreen() {
  const { navigate } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 pb-8 pt-16">
      {/* Logo and Branding */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/15 flex items-center justify-center">
          <Heart className="w-12 h-12 text-primary" />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Bloom</h1>
          <p className="text-muted-foreground mt-2 text-balance">
            Your warm companion through every moment of pregnancy
          </p>
        </div>

        {/* Emotional tagline */}
        <div className="mt-8 px-6 py-4 bg-emotional/10 rounded-2xl max-w-xs text-center">
          <p className="text-sm text-emotional-foreground italic leading-relaxed">
            {"\"You're doing amazingly. Let us walk with you on this beautiful journey.\""}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <BloomButton 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={() => navigate("login")}
        >
          Log In
        </BloomButton>
        
        <BloomButton 
          variant="secondary" 
          size="lg" 
          className="w-full"
          onClick={() => navigate("signup")}
        >
          Create Account
        </BloomButton>
        
        <BodyText className="text-center text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </BodyText>
      </div>
    </div>
  );
}
