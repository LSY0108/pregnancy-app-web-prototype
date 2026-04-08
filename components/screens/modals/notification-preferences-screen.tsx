"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { BloomCard, SectionTitle, HelperText } from "@/components/bloom-ui";
import { ArrowLeft, Bell, Calendar, Pill, Baby, Heart, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-12 h-7 rounded-full p-0.5 transition-colors",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full bg-card shadow-sm transition-transform",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

interface NotificationItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function NotificationItem({ icon, label, description, enabled, onChange }: NotificationItemProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
  );
}

export function NotificationPreferencesScreen() {
  const { goBack } = useApp();
  
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    appointments: true,
    supplements: true,
    weeklyUpdate: true,
    emotionalCheckIn: true,
    waterReminder: false,
  });

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
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
        <h1 className="text-lg font-medium text-foreground">Notifications</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <HelperText className="px-2 mb-6">
          Choose which notifications you&apos;d like to receive. We&apos;ll always respect your preferences.
        </HelperText>

        {/* Daily & Weekly */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Daily & Weekly</SectionTitle>
          <BloomCard className="p-2">
            <NotificationItem
              icon={<Bell className="w-5 h-5 text-primary" />}
              label="Daily Reminder"
              description="Gentle reminder to log your day"
              enabled={notifications.dailyReminder}
              onChange={(v) => updateNotification("dailyReminder", v)}
            />
            <NotificationItem
              icon={<Baby className="w-5 h-5 text-primary" />}
              label="Weekly Update"
              description="New baby development info each week"
              enabled={notifications.weeklyUpdate}
              onChange={(v) => updateNotification("weeklyUpdate", v)}
            />
          </BloomCard>
        </div>

        {/* Health & Care */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Health & Care</SectionTitle>
          <BloomCard className="p-2">
            <NotificationItem
              icon={<Calendar className="w-5 h-5 text-sage-foreground" />}
              label="Appointments"
              description="Reminders for upcoming visits"
              enabled={notifications.appointments}
              onChange={(v) => updateNotification("appointments", v)}
            />
            <NotificationItem
              icon={<Pill className="w-5 h-5 text-lavender-foreground" />}
              label="Supplements"
              description="Daily supplement reminders"
              enabled={notifications.supplements}
              onChange={(v) => updateNotification("supplements", v)}
            />
            <NotificationItem
              icon={<Droplets className="w-5 h-5 text-primary" />}
              label="Water Reminder"
              description="Stay hydrated throughout the day"
              enabled={notifications.waterReminder}
              onChange={(v) => updateNotification("waterReminder", v)}
            />
          </BloomCard>
        </div>

        {/* Emotional */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Emotional Support</SectionTitle>
          <BloomCard className="p-2">
            <NotificationItem
              icon={<Heart className="w-5 h-5 text-emotional-foreground" />}
              label="Emotional Check-in"
              description="Supportive messages and mood prompts"
              enabled={notifications.emotionalCheckIn}
              onChange={(v) => updateNotification("emotionalCheckIn", v)}
            />
          </BloomCard>
        </div>

        {/* Note */}
        <div className="px-4 py-4 bg-muted/50 rounded-2xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            You can change these settings anytime. Critical health alerts will always be delivered regardless of these preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
