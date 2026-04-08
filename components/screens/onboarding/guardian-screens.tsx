"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { BloomButton, BloomInput, HelperText, BloomCard, CardTitle } from "@/components/bloom-ui";
import { ArrowLeft, Users, Link2, Copy, Check, Heart, QrCode, Share2 } from "lucide-react";

// Guardian Connect Screen - for guardians joining
export function GuardianConnectScreen() {
  const { navigate, completeOnboarding } = useApp();
  const [inviteCode, setInviteCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
    completeOnboarding();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <button
          onClick={() => navigate("role-selection")}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-medium text-foreground">Connect as Guardian</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Join a pregnancy journey</h2>
          <HelperText>Enter the invite code shared by the mother to connect</HelperText>
        </div>

        {/* Illustration */}
        <div className="flex justify-center my-8">
          <div className="w-32 h-32 rounded-3xl bg-sage/20 flex items-center justify-center">
            <Users className="w-16 h-16 text-sage-foreground" />
          </div>
        </div>

        {/* Code Input */}
        <div className="flex flex-col gap-4">
          <BloomInput
            label="Invite Code"
            placeholder="Enter 6-digit code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="text-center text-2xl tracking-[0.5em] font-mono"
          />

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <BloomButton variant="secondary" icon={QrCode}>
            Scan QR Code
          </BloomButton>
        </div>

        {/* Info Card */}
        <div className="mt-8 px-4 py-4 bg-emotional/10 rounded-2xl">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-emotional-foreground italic leading-relaxed">
              {"As a guardian, you'll be able to follow the pregnancy journey, receive updates, and offer your support."}
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
          onClick={handleConnect}
          disabled={inviteCode.length < 6 || isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </BloomButton>
      </div>
    </div>
  );
}

// Guardian Invite Screen - for mothers to invite guardians
export function GuardianInviteScreen() {
  const { goBack } = useApp();
  const [copied, setCopied] = useState(false);
  const inviteCode = "ABC123";
  const inviteLink = `bloom.app/invite/${inviteCode}`;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <h1 className="text-lg font-medium text-foreground">Invite Guardian</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Share your journey</h2>
          <HelperText>Invite your partner, family, or friends to follow along</HelperText>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center my-6">
          <div className="w-48 h-48 rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">QR Code</span>
            </div>
          </div>
        </div>

        {/* Invite Code */}
        <BloomCard className="mb-4">
          <div className="flex flex-col gap-3">
            <CardTitle>Invite Code</CardTitle>
            <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
              <span className="text-2xl font-mono tracking-[0.3em] text-foreground">{inviteCode}</span>
              <button
                onClick={() => handleCopy(inviteCode)}
                className="w-10 h-10 rounded-xl bg-card flex items-center justify-center hover:bg-card/80 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </BloomCard>

        {/* Invite Link */}
        <BloomCard className="mb-6">
          <div className="flex flex-col gap-3">
            <CardTitle>Invite Link</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-xl px-4 py-3 overflow-hidden">
                <span className="text-sm text-muted-foreground truncate block">{inviteLink}</span>
              </div>
              <button
                onClick={() => handleCopy(inviteLink)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0"
              >
                <Link2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </BloomCard>

        {/* Share Buttons */}
        <div className="flex gap-3">
          <BloomButton variant="secondary" className="flex-1" icon={Share2}>
            Share
          </BloomButton>
        </div>

        {/* Info */}
        <div className="mt-8 px-4 py-4 bg-sage/10 rounded-2xl">
          <p className="text-sm text-sage-foreground leading-relaxed">
            Guardians can view your weekly updates, see appointment reminders, and send supportive messages. They cannot edit your data.
          </p>
        </div>
      </div>
    </div>
  );
}
