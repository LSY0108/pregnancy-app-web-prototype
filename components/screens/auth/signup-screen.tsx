"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { BloomButton, BloomInput, HelperText } from "@/components/bloom-ui";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";

export function SignupScreen() {
  const { navigate, login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = () => {
    // In a real app, this would create an account
    login();
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <button
          onClick={() => navigate("welcome")}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-medium text-foreground">Create Account</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Join Bloom</h2>
          <HelperText>Create your account to start your journey</HelperText>
        </div>

        <div className="flex flex-col gap-4">
          <BloomInput
            label="Your Name"
            type="text"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <BloomInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <BloomInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          {password.length > 0 && (
            <div className="flex flex-col gap-1.5 pl-1">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? "bg-success" : "bg-muted"
                  }`}>
                    {req.met && <Check className="w-2.5 h-2.5 text-success-foreground" />}
                  </div>
                  <span className={`text-xs ${req.met ? "text-success" : "text-muted-foreground"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 mt-4">
            <button
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreeTerms 
                  ? "bg-primary text-primary-foreground" 
                  : "border-2 border-border"
              }`}
            >
              {agreeTerms && <Check className="w-3 h-3" />}
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <button className="text-primary font-medium">Terms of Service</button>
              {" "}and{" "}
              <button className="text-primary font-medium">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <BloomButton 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={handleSignup}
          disabled={!agreeTerms || !name || !email || password.length < 8}
        >
          Create Account
        </BloomButton>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <button 
            className="text-primary font-medium"
            onClick={() => navigate("login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
