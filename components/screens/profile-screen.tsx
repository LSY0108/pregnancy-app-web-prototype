"use client";

import { useApp } from "@/lib/app-context";
import {
  AppHeader,
  SectionTitle,
  BloomCard,
  BloomButton,
  GuardianShareCard,
  HelperText,
  Caption,
} from "@/components/bloom-ui";
import { 
  User, 
  Baby, 
  Heart, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  Settings, 
  Share2,
  UserPlus,
  LogOut,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

const guardians: { id: string; name: string; relation: string; status: "connected" | "pending" | "invite" }[] = [
  { id: "1", name: "Minhyuk", relation: "Husband", status: "connected" },
  { id: "2", name: "Mom", relation: "Mother", status: "pending" },
];

export function ProfileScreen() {
  const { navigate, logout, pregnancyInfo, userProfile } = useApp();

  const menuItems: { icon: LucideIcon; label: string; description: string; screen?: string }[] = [
    { icon: Baby, label: "Pregnancy Details", description: "Due date, baby info" },
    { icon: Heart, label: "Health Records", description: "Medical history, allergies" },
    { icon: Bell, label: "Notifications", description: "Reminders and alerts", screen: "notification-preferences" },
    { icon: AlertTriangle, label: "Emergency Guide", description: "Warning signs to know", screen: "emergency-guide" },
    { icon: Shield, label: "Privacy & Security", description: "Data protection settings" },
    { icon: HelpCircle, label: "Help & Support", description: "FAQ, contact us" },
    { icon: Settings, label: "Settings", description: "Language, theme, units", screen: "settings" },
  ];

  return (
    <div className="flex flex-col pb-6">
      <AppHeader 
        title="Profile" 
        subtitle="Manage your account and share with loved ones"
      />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {/* User Card */}
        <BloomCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{userProfile.name || "Your Name"}</h2>
              <HelperText>{userProfile.role === "mother" ? "Mother" : "Guardian"}</HelperText>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Week {pregnancyInfo.currentWeek}
                </span>
              </div>
            </div>
            <BloomButton variant="secondary" size="sm">
              Edit
            </BloomButton>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted p-3">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{pregnancyInfo.currentWeek}</p>
              <Caption>Weeks</Caption>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{pregnancyInfo.daysRemaining}</p>
              <Caption>Days Left</Caption>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">85</p>
              <Caption>Records</Caption>
            </div>
          </div>
        </BloomCard>

        {/* Guardian Sharing */}
        <div className="flex flex-col gap-3">
          <SectionTitle className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Share with Guardians
          </SectionTitle>

          <BloomCard className="bg-secondary/30">
            <HelperText className="mb-3">
              Let your partner or family stay updated on your pregnancy journey
            </HelperText>
            <div className="flex flex-col gap-2">
              {guardians.map((guardian) => (
                <GuardianShareCard
                  key={guardian.id}
                  name={guardian.name}
                  relationship={guardian.relation}
                  status={guardian.status}
                  onAction={() => {}}
                />
              ))}
            </div>
            <BloomButton 
              variant="secondary" 
              icon={UserPlus} 
              className="w-full mt-3"
              onClick={() => navigate("guardian-invite")}
            >
              Invite Guardian
            </BloomButton>
          </BloomCard>
        </div>

        {/* What Guardians Can See */}
        <BloomCard className="bg-gradient-to-r from-primary/5 to-accent/5">
          <h4 className="text-sm font-medium text-foreground mb-2">What guardians can see:</h4>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <HelperText>Weekly pregnancy progress and baby development</HelperText>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <HelperText>Upcoming appointments and reminders</HelperText>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <HelperText>Your mood and how you&apos;re feeling (if shared)</HelperText>
            </li>
          </ul>
        </BloomCard>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <BloomCard 
                key={item.label}
                interactive
                className="flex items-center gap-3"
                onClick={() => item.screen && navigate(item.screen as any)}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <HelperText>{item.description}</HelperText>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </BloomCard>
            );
          })}
        </div>

        {/* Sign Out */}
        <BloomButton variant="ghost" icon={LogOut} className="justify-start" onClick={logout}>
          Sign Out
        </BloomButton>

        {/* App Info */}
        <div className="text-center pt-4">
          <HelperText>Bloom v1.0.0</HelperText>
          <HelperText className="text-primary">Made with love for mothers everywhere</HelperText>
        </div>
      </div>
    </div>
  );
}
