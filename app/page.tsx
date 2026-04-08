"use client";

import { AppProvider, useApp } from "@/lib/app-context";
import { MobileShell } from "@/components/mobile-shell";

// Auth Screens
import { WelcomeScreen } from "@/components/screens/auth/welcome-screen";
import { LoginScreen } from "@/components/screens/auth/login-screen";
import { SignupScreen } from "@/components/screens/auth/signup-screen";

// Onboarding Screens
import { RoleSelectionScreen } from "@/components/screens/onboarding/role-selection-screen";
import { OnboardingScreen1, OnboardingScreen2, OnboardingScreen3 } from "@/components/screens/onboarding/onboarding-screens";
import { PregnancySetupScreen } from "@/components/screens/onboarding/pregnancy-setup-screen";
import { GuardianConnectScreen, GuardianInviteScreen } from "@/components/screens/onboarding/guardian-screens";

// Main Tab Screens
import { HomeScreen } from "@/components/screens/home-screen";
import { WeeklyScreen } from "@/components/screens/weekly-screen";
import { LogScreen } from "@/components/screens/log-screen";
import { ScheduleScreen } from "@/components/screens/schedule-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";

// Modal/Overlay Screens
import { CreateLogScreen } from "@/components/screens/modals/create-log-screen";
import { CreateScheduleScreen } from "@/components/screens/modals/create-schedule-screen";
import { SettingsScreen } from "@/components/screens/modals/settings-screen";
import { NotificationPreferencesScreen } from "@/components/screens/modals/notification-preferences-screen";
import { EmergencyGuideScreen } from "@/components/screens/modals/emergency-guide-screen";

function AppContent() {
  const { currentScreen, activeTab, setTab } = useApp();

  // Render auth/onboarding screens (full screen, no bottom nav)
  const authScreens = {
    welcome: <WelcomeScreen />,
    login: <LoginScreen />,
    signup: <SignupScreen />,
    "role-selection": <RoleSelectionScreen />,
    "onboarding-1": <OnboardingScreen1 />,
    "onboarding-2": <OnboardingScreen2 />,
    "onboarding-3": <OnboardingScreen3 />,
    "pregnancy-setup": <PregnancySetupScreen />,
    "guardian-connect": <GuardianConnectScreen />,
  };

  // Render modal screens (full screen overlays)
  const modalScreens = {
    "create-log": <CreateLogScreen />,
    "create-schedule": <CreateScheduleScreen />,
    "guardian-invite": <GuardianInviteScreen />,
    settings: <SettingsScreen />,
    "notification-preferences": <NotificationPreferencesScreen />,
    "emergency-guide": <EmergencyGuideScreen />,
  };

  // Check if we're in auth/onboarding flow
  if (currentScreen in authScreens) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen">
        {authScreens[currentScreen as keyof typeof authScreens]}
      </div>
    );
  }

  // Check if we're in a modal flow
  if (currentScreen in modalScreens) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen">
        {modalScreens[currentScreen as keyof typeof modalScreens]}
      </div>
    );
  }

  // Main app with bottom navigation
  const mainScreens = {
    home: <HomeScreen />,
    weekly: <WeeklyScreen />,
    log: <LogScreen />,
    schedule: <ScheduleScreen />,
    profile: <ProfileScreen />,
  };

  return (
    <div className="mx-auto max-w-md bg-background min-h-screen">
      <MobileShell activeTab={activeTab} onTabChange={setTab}>
        {mainScreens[activeTab as keyof typeof mainScreens] || <HomeScreen />}
      </MobileShell>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
