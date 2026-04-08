"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Heart,
  Calendar,
  Pill,
  Baby,
  Users,
  ChevronRight,
  Plus,
  Check,
  X,
  Bell,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPOGRAPHY COMPONENTS
// ============================================

export function AppTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("text-2xl font-semibold tracking-tight text-foreground", className)}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-medium text-foreground", className)}>
      {children}
    </h2>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-medium text-foreground", className)}>
      {children}
    </h3>
  );
}

export function BodyText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function HelperText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] text-muted-foreground uppercase tracking-wide", className)}>
      {children}
    </span>
  );
}

export function EmotionalText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-emotional-foreground italic leading-relaxed", className)}>
      {children}
    </p>
  );
}

// ============================================
// BUTTON COMPONENTS
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "warning" | "emotional" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export function BloomButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    tertiary: "text-primary hover:bg-primary/10",
    warning: "bg-destructive text-destructive-foreground hover:opacity-90",
    emotional: "bg-emotional text-emotional-foreground hover:opacity-90 shadow-sm",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
    </button>
  );
}

// ============================================
// INPUT COMPONENTS
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export function BloomInput({ label, helper, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        className={cn(
          "h-11 px-4 rounded-xl bg-input border border-border text-foreground text-sm",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-all duration-200",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {helper && !error && <HelperText>{helper}</HelperText>}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
}

export function BloomTextarea({ label, helper, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <textarea
        className={cn(
          "min-h-[100px] px-4 py-3 rounded-xl bg-input border border-border text-foreground text-sm",
          "placeholder:text-muted-foreground resize-none",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-all duration-200",
          className
        )}
        {...props}
      />
      {helper && <HelperText>{helper}</HelperText>}
    </div>
  );
}

// ============================================
// SEGMENTED CONTROL
// ============================================

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex bg-muted p-1 rounded-xl gap-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200",
            value === option.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// CHIP / TAG COMPONENTS
// ============================================

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "sage" | "lavender" | "emotional";
  className?: string;
}

export function Chip({ children, selected, onClick, variant = "default", className }: ChipProps) {
  const variants = {
    default: selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
    sage: selected ? "bg-sage text-sage-foreground" : "bg-sage/30 text-sage-foreground",
    lavender: selected ? "bg-lavender text-lavender-foreground" : "bg-lavender/30 text-lavender-foreground",
    emotional: selected ? "bg-emotional text-emotional-foreground" : "bg-emotional/30 text-emotional-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
        "transition-all duration-200 active:scale-[0.97]",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function SymptomTag({ 
  children, 
  selected, 
  onClick,
  icon: Icon,
}: { 
  children: React.ReactNode; 
  selected?: boolean; 
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm",
        "transition-all duration-200 active:scale-[0.97]",
        selected
          ? "bg-primary/15 text-primary border-2 border-primary"
          : "bg-muted text-muted-foreground border-2 border-transparent"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {selected && <Check className="w-3.5 h-3.5 ml-1" />}
    </button>
  );
}

// ============================================
// CARD COMPONENTS
// ============================================

interface BloomCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function BloomCard({ children, className, onClick, interactive }: BloomCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl p-4 border border-border/50",
        interactive && "cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Daily Summary Card
export function DailySummaryCard({
  week,
  day,
  daysLeft,
  babySize,
  className,
}: {
  week: number;
  day: number;
  daysLeft: number;
  babySize: string;
  className?: string;
}) {
  return (
    <BloomCard className={cn("bg-gradient-to-br from-primary/10 via-card to-accent/10", className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Caption>Today</Caption>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-foreground">{week}</span>
            <span className="text-lg text-muted-foreground">weeks</span>
            <span className="text-lg text-muted-foreground">+{day}d</span>
          </div>
          <HelperText>D-{daysLeft} until due date</HelperText>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Baby className="w-8 h-8 text-primary" />
          </div>
          <HelperText>{babySize}</HelperText>
        </div>
      </div>
    </BloomCard>
  );
}

// Weekly Info Card
export function WeeklyInfoCard({
  title,
  description,
  icon: Icon,
  variant = "default",
  className,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "sage" | "lavender" | "accent";
  className?: string;
}) {
  const variants = {
    default: "bg-card",
    sage: "bg-sage/20",
    lavender: "bg-lavender/20",
    accent: "bg-accent/20",
  };

  return (
    <BloomCard className={cn(variants[variant], className)}>
      <div className="flex gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          <BodyText className="text-muted-foreground">{description}</BodyText>
        </div>
      </div>
    </BloomCard>
  );
}

// Emotional Check-in Card
export function EmotionalCheckInCard({
  title,
  message,
  onAction,
  actionLabel,
  className,
}: {
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <BloomCard className={cn("bg-emotional/10 border-emotional/20", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <EmotionalText>{message}</EmotionalText>
        {onAction && actionLabel && (
          <BloomButton variant="emotional" size="sm" onClick={onAction}>
            {actionLabel}
          </BloomButton>
        )}
      </div>
    </BloomCard>
  );
}

// Hospital Schedule Card
export function HospitalScheduleCard({
  date,
  time,
  type,
  location,
  onReminder,
  className,
}: {
  date: string;
  time: string;
  type: string;
  location?: string;
  onReminder?: () => void;
  className?: string;
}) {
  return (
    <BloomCard className={cn("", className)} interactive>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-sage-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <CardTitle>{type}</CardTitle>
            <HelperText>{date} at {time}</HelperText>
            {location && <HelperText className="text-primary">{location}</HelperText>}
          </div>
        </div>
        {onReminder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReminder();
            }}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </BloomCard>
  );
}

// Supplement Reminder Card
export function SupplementCard({
  name,
  dosage,
  time,
  taken,
  onToggle,
  className,
}: {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <BloomCard className={cn(taken && "opacity-60", className)}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            taken ? "bg-success/20" : "bg-lavender/20"
          )}>
            <Pill className={cn("w-5 h-5", taken ? "text-success" : "text-lavender-foreground")} />
          </div>
          <div className="flex flex-col gap-0.5">
            <CardTitle className={taken ? "line-through" : ""}>{name}</CardTitle>
            <HelperText>{dosage} - {time}</HelperText>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            taken
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/20"
          )}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </BloomCard>
  );
}

// Guardian Share Card
export function GuardianShareCard({
  name,
  relationship,
  status,
  onAction,
  className,
}: {
  name: string;
  relationship: string;
  status: "connected" | "pending" | "invite";
  onAction: () => void;
  className?: string;
}) {
  const statusConfig = {
    connected: { label: "Connected", color: "text-success" },
    pending: { label: "Pending", color: "text-warning-foreground" },
    invite: { label: "Invite", color: "text-primary" },
  };

  return (
    <BloomCard className={className}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <CardTitle>{name || "Add Guardian"}</CardTitle>
            <HelperText>{relationship}</HelperText>
          </div>
        </div>
        <button
          onClick={onAction}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            status === "invite"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {status === "invite" ? <Plus className="w-4 h-4" /> : statusConfig[status].label}
        </button>
      </div>
    </BloomCard>
  );
}

// Baby Growth Highlight Card
export function BabyGrowthCard({
  week,
  size,
  weight,
  length,
  milestone,
  className,
}: {
  week: number;
  size: string;
  weight: string;
  length: string;
  milestone: string;
  className?: string;
}) {
  return (
    <BloomCard className={cn("bg-gradient-to-br from-accent/20 to-card", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Caption>Week {week}</Caption>
            <CardTitle className="text-lg mt-1">Your Baby is a {size}</CardTitle>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-accent-foreground" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 bg-card rounded-xl p-3 text-center">
            <HelperText>Weight</HelperText>
            <p className="text-base font-medium text-foreground mt-0.5">{weight}</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 text-center">
            <HelperText>Length</HelperText>
            <p className="text-base font-medium text-foreground mt-0.5">{length}</p>
          </div>
        </div>
        <BodyText className="text-muted-foreground">{milestone}</BodyText>
      </div>
    </BloomCard>
  );
}

// ============================================
// STAT PILL COMPONENT
// ============================================

export function StatPill({
  label,
  value,
  icon: Icon,
  variant = "default",
  className,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}) {
  const variants = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/30 text-warning-foreground",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-xl", variants[variant], className)}>
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

// ============================================
// PROGRESS CARD COMPONENT
// ============================================

export function ProgressCard({
  title,
  current,
  total,
  unit,
  color = "primary",
  className,
}: {
  title: string;
  current: number;
  total: number;
  unit?: string;
  color?: "primary" | "success" | "sage" | "lavender";
  className?: string;
}) {
  const percentage = Math.min((current / total) * 100, 100);
  
  const colors = {
    primary: "bg-primary",
    success: "bg-success",
    sage: "bg-sage",
    lavender: "bg-lavender",
  };

  return (
    <BloomCard className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <HelperText>{title}</HelperText>
          <span className="text-sm font-medium text-foreground">
            {current}{unit && ` ${unit}`} / {total}{unit && ` ${unit}`}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", colors[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </BloomCard>
  );
}

// ============================================
// BANNER COMPONENT
// ============================================

export function Banner({
  title,
  message,
  variant = "default",
  onDismiss,
  action,
  className,
}: {
  title?: string;
  message: string;
  variant?: "default" | "success" | "warning" | "emotional";
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  const variants = {
    default: "bg-muted border-border",
    success: "bg-success/15 border-success/30",
    warning: "bg-warning/30 border-warning/50",
    emotional: "bg-emotional/15 border-emotional/30",
  };

  return (
    <div className={cn("p-4 rounded-2xl border", variants[variant], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {title && <CardTitle>{title}</CardTitle>}
          <BodyText className="text-muted-foreground">{message}</BodyText>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-primary mt-1 hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center text-center py-12 px-6", className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}
      <SectionTitle className="mb-2">{title}</SectionTitle>
      <BodyText className="text-muted-foreground max-w-xs mb-4">{description}</BodyText>
      {actionLabel && onAction && (
        <BloomButton variant="primary" onClick={onAction}>
          {actionLabel}
        </BloomButton>
      )}
    </div>
  );
}

// ============================================
// MOOD SELECTOR COMPONENT
// ============================================

const moodOptions = [
  { value: "great", emoji: "radiant", label: "Great", color: "bg-success/20 text-success" },
  { value: "good", emoji: "happy", label: "Good", color: "bg-sage/30 text-sage-foreground" },
  { value: "okay", emoji: "neutral", label: "Okay", color: "bg-accent/30 text-accent-foreground" },
  { value: "low", emoji: "sad", label: "Low", color: "bg-lavender/30 text-lavender-foreground" },
  { value: "anxious", emoji: "worried", label: "Anxious", color: "bg-warning/30 text-warning-foreground" },
];

export function MoodSelector({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-between gap-2", className)}>
      {moodOptions.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200",
            value === mood.value
              ? `${mood.color} ring-2 ring-offset-2 ring-primary/30`
              : "bg-muted hover:bg-muted/80"
          )}
        >
          <span className="text-2xl">
            {mood.emoji === "radiant" && "✨"}
            {mood.emoji === "happy" && "😊"}
            {mood.emoji === "neutral" && "😐"}
            {mood.emoji === "sad" && "😔"}
            {mood.emoji === "worried" && "😰"}
          </span>
          <span className="text-xs font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// NUMERIC INPUT COMPONENT
// ============================================

export function NumericInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <span className="text-lg font-medium text-foreground">-</span>
        </button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <span className="text-lg font-medium text-foreground">+</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// DATE INPUT COMPONENT
// ============================================

export function DateInput({
  label,
  value,
  onChange,
  helper,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 px-4 rounded-xl bg-input border border-border text-foreground text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-all duration-200"
        )}
      />
      {helper && <HelperText>{helper}</HelperText>}
    </div>
  );
}

// ============================================
// FLOATING ACTION BUTTON
// ============================================

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  className,
}: {
  icon: LucideIcon;
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 flex items-center gap-2 px-5 py-4 rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-200 hover:shadow-xl active:scale-95",
        className
      )}
    >
      <Icon className="w-5 h-5" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

// ============================================
// APP HEADER COMPONENT
// ============================================

export function AppHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  className,
}: {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center justify-between px-4 py-3 bg-background", className)}>
      <div className="flex items-center gap-3">
        {leftAction}
        <div>
          <AppTitle>{title}</AppTitle>
          {subtitle && <HelperText>{subtitle}</HelperText>}
        </div>
      </div>
      {rightAction}
    </header>
  );
}

// ============================================
// BOTTOM SHEET (Modal) COMPONENT
// ============================================

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 pb-8",
          "animate-in slide-in-from-bottom duration-300",
          className
        )}
      >
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        {title && <SectionTitle className="mb-4">{title}</SectionTitle>}
        {children}
      </div>
    </div>
  );
}

// ============================================
// CHECKLIST ITEM COMPONENT
// ============================================

export function ChecklistItem({
  label,
  checked,
  onChange,
  className,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200",
        checked ? "bg-success/10" : "bg-muted hover:bg-muted/80",
        className
      )}
    >
      <div className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
        checked 
          ? "bg-success border-success" 
          : "border-muted-foreground"
      )}>
        {checked && <Check className="w-4 h-4 text-success-foreground" />}
      </div>
      <span className={cn(
        "text-sm font-medium",
        checked ? "text-muted-foreground line-through" : "text-foreground"
      )}>
        {label}
      </span>
    </button>
  );
}

// Export all mood options for use in other components
export { moodOptions };
