"use client";

import { useApp } from "@/lib/app-context";
import { BloomCard, CardTitle, HelperText, SectionTitle } from "@/components/bloom-ui";
import { 
  ArrowLeft, 
  ChevronRight, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  FileText,
  LogOut,
  Heart,
  Baby,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  trailing?: React.ReactNode;
}

function SettingsItem({ icon, label, description, onClick, variant = "default", trailing }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-colors text-left",
        "hover:bg-muted/50",
        variant === "danger" && "text-destructive"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        variant === "danger" ? "bg-destructive/10" : "bg-muted"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium",
          variant === "danger" ? "text-destructive" : "text-foreground"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {trailing || <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
    </button>
  );
}

export function SettingsScreen() {
  const { goBack, navigate, logout, pregnancyInfo } = useApp();

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
        <h1 className="text-lg font-medium text-foreground">Settings</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Pregnancy Settings */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Pregnancy</SectionTitle>
          <BloomCard className="p-2">
            <SettingsItem
              icon={<Baby className="w-5 h-5 text-primary" />}
              label="Pregnancy Details"
              description={`Due: ${pregnancyInfo.dueDate || "Not set"}`}
            />
            <SettingsItem
              icon={<Heart className="w-5 h-5 text-primary" />}
              label="Baby Nickname"
              description={pregnancyInfo.babyNickname || "Not set"}
            />
          </BloomCard>
        </div>

        {/* App Settings */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">App Settings</SectionTitle>
          <BloomCard className="p-2">
            <SettingsItem
              icon={<Bell className="w-5 h-5 text-muted-foreground" />}
              label="Notifications"
              description="Manage alerts and reminders"
              onClick={() => navigate("notification-preferences")}
            />
            <SettingsItem
              icon={<Globe className="w-5 h-5 text-muted-foreground" />}
              label="Language"
              description="English"
            />
          </BloomCard>
        </div>

        {/* Support */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Support</SectionTitle>
          <BloomCard className="p-2">
            <SettingsItem
              icon={<HelpCircle className="w-5 h-5 text-muted-foreground" />}
              label="Help Center"
            />
            <SettingsItem
              icon={<FileText className="w-5 h-5 text-muted-foreground" />}
              label="Terms & Privacy"
            />
            <SettingsItem
              icon={<Shield className="w-5 h-5 text-muted-foreground" />}
              label="Data & Privacy"
            />
          </BloomCard>
        </div>

        {/* Danger Zone */}
        <div className="mb-6">
          <SectionTitle className="px-2 mb-2">Account</SectionTitle>
          <BloomCard className="p-2">
            <SettingsItem
              icon={<LogOut className="w-5 h-5" />}
              label="Log Out"
              variant="danger"
              onClick={logout}
            />
            <SettingsItem
              icon={<Trash2 className="w-5 h-5" />}
              label="Delete Account"
              variant="danger"
            />
          </BloomCard>
        </div>

        {/* Version */}
        <div className="text-center mt-8">
          <HelperText>Bloom v1.0.0</HelperText>
          <p className="text-xs text-muted-foreground mt-1">Made with love for mothers everywhere</p>
        </div>
      </div>
    </div>
  );
}
