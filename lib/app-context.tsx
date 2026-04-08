"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// App screens type
export type AppScreen =
  // Auth flows
  | "welcome"
  | "login"
  | "signup"
  | "role-selection"
  // Onboarding
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "pregnancy-setup"
  | "guardian-connect"
  // Main tabs
  | "home"
  | "weekly"
  | "log"
  | "schedule"
  | "profile"
  // Modal/overlay flows
  | "create-log"
  | "create-schedule"
  | "guardian-invite"
  | "settings"
  | "notification-preferences"
  | "emergency-guide";

export type UserRole = "mother" | "guardian" | null;

export interface PregnancyInfo {
  dueDate: string | null;
  currentWeek: number;
  currentDay: number;
  daysRemaining: number;
  babyNickname: string;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  avatar?: string;
  linkedGuardians: Array<{
    id: string;
    name: string;
    relationship: string;
    status: "connected" | "pending";
  }>;
}

interface AppState {
  currentScreen: AppScreen;
  previousScreen: AppScreen | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile;
  pregnancyInfo: PregnancyInfo;
  activeTab: "home" | "weekly" | "log" | "schedule" | "profile";
}

interface AppContextType extends AppState {
  navigate: (screen: AppScreen) => void;
  goBack: () => void;
  setTab: (tab: "home" | "weekly" | "log" | "schedule" | "profile") => void;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  setUserRole: (role: UserRole) => void;
  updatePregnancyInfo: (info: Partial<PregnancyInfo>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const defaultPregnancyInfo: PregnancyInfo = {
  dueDate: "2026-09-15",
  currentWeek: 24,
  currentDay: 3,
  daysRemaining: 112,
  babyNickname: "Little Bean",
};

const defaultUserProfile: UserProfile = {
  name: "",
  role: null,
  linkedGuardians: [],
};

const initialState: AppState = {
  currentScreen: "welcome",
  previousScreen: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  userProfile: defaultUserProfile,
  pregnancyInfo: defaultPregnancyInfo,
  activeTab: "home",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const navigate = useCallback((screen: AppScreen) => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: prev.previousScreen || "home",
      previousScreen: null,
    }));
  }, []);

  const setTab = useCallback((tab: "home" | "weekly" | "log" | "schedule" | "profile") => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      currentScreen: tab,
    }));
  }, []);

  const login = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      currentScreen: prev.hasCompletedOnboarding ? "home" : "role-selection",
    }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentScreen: "welcome",
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      currentScreen: "home",
    }));
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setState((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, role },
    }));
  }, []);

  const updatePregnancyInfo = useCallback((info: Partial<PregnancyInfo>) => {
    setState((prev) => ({
      ...prev,
      pregnancyInfo: { ...prev.pregnancyInfo, ...info },
    }));
  }, []);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile },
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        setTab,
        login,
        logout,
        completeOnboarding,
        setUserRole,
        updatePregnancyInfo,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
