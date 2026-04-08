"use client";

import { useApp } from "@/lib/app-context";
import { 
  AppHeader,
  DailySummaryCard, 
  EmotionalCheckInCard, 
  HospitalScheduleCard,
  WeeklyInfoCard,
  Banner,
  StatPill,
  SectionTitle,
  HelperText,
  BodyText,
  BloomCard,
} from "@/components/bloom-ui";
import { Droplets, Moon, Scale, Heart, Sparkles, Bell, AlertTriangle } from "lucide-react";

const quickStats = [
  { icon: Heart, label: "Mood", value: "Good", variant: "primary" as const },
  { icon: Scale, label: "Weight", value: "62.5kg", variant: "default" as const },
  { icon: Droplets, label: "Water", value: "6 cups", variant: "default" as const },
  { icon: Moon, label: "Sleep", value: "7.5h", variant: "default" as const },
];

const babySizeByWeek: Record<number, { name: string; emoji: string; weight: string; length: string }> = {
  24: { name: "Corn", emoji: "🌽", weight: "600g", length: "30cm" },
  25: { name: "Cauliflower", emoji: "🥬", weight: "660g", length: "34cm" },
  26: { name: "Lettuce", emoji: "🥗", weight: "760g", length: "35cm" },
};

const todayTips = [
  "Your baby can now hear your voice clearly",
  "Remember to do your pelvic floor exercises",
  "Take a short walk after meals for better digestion",
];

export function HomeScreen() {
  const { navigate, pregnancyInfo, userProfile } = useApp();
  
  const babySize = babySizeByWeek[pregnancyInfo.currentWeek] || babySizeByWeek[24];
  const userName = userProfile.name || "there";

  return (
    <div className="flex flex-col pb-6">
      <AppHeader 
        title="Bloom" 
        subtitle={`Good morning, ${userName}`}
        rightAction={
          <button className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute right-1.5 top-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        }
      />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {/* Daily Summary */}
        <DailySummaryCard
          week={pregnancyInfo.currentWeek}
          day={pregnancyInfo.currentDay}
          daysLeft={pregnancyInfo.daysRemaining}
          babySize={babySize.name}
        />

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2">
          {quickStats.map((stat) => (
            <StatPill
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Baby Size Card */}
        <BloomCard className="flex items-center gap-4" interactive onClick={() => navigate("weekly")}>
          <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center text-2xl">
            {babySize.emoji}
          </div>
          <div className="flex-1">
            <HelperText>{pregnancyInfo.babyNickname} is now the size of a</HelperText>
            <p className="font-semibold text-foreground capitalize">{babySize.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{babySize.length}</p>
            <HelperText>{babySize.weight}</HelperText>
          </div>
        </BloomCard>

        {/* Today's Tips */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <SectionTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {"Today's Tips"}
            </SectionTitle>
            <button className="text-sm text-primary font-medium">See all</button>
          </div>
          <div className="flex flex-col gap-2">
            {todayTips.map((tip, index) => (
              <BloomCard key={index} interactive className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <BodyText className="flex-1">{tip}</BodyText>
              </BloomCard>
            ))}
          </div>
        </div>

        {/* Emotional Check-in */}
        <EmotionalCheckInCard
          title="How are you feeling?"
          message="Taking a moment to check in with yourself is important. Your emotions matter, and we're here to support you through every feeling."
          actionLabel="Log My Mood"
          onAction={() => navigate("create-log")}
        />

        {/* Weekly Highlights */}
        <div className="flex flex-col gap-3">
          <SectionTitle>{"This Week's Highlights"}</SectionTitle>
          <WeeklyInfoCard
            icon={Sparkles}
            title="Baby Development"
            description="Baby's lungs are developing surfactant, preparing for breathing outside the womb."
            variant="sage"
          />
          <WeeklyInfoCard
            icon={Heart}
            title="Your Body"
            description="You might experience Braxton Hicks contractions. These practice contractions are normal."
            variant="lavender"
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <SectionTitle>Upcoming Visits</SectionTitle>
            <button 
              className="text-sm text-primary font-medium"
              onClick={() => navigate("schedule")}
            >
              View calendar
            </button>
          </div>
          <HospitalScheduleCard
            date="Apr 15"
            time="10:30 AM"
            type="Prenatal Checkup"
            location={"Seoul Women's Hospital"}
            onReminder={() => {}}
          />
        </div>

        {/* Emergency Guide Quick Access */}
        <BloomCard 
          className="bg-warning/10 border-warning/20" 
          interactive
          onClick={() => navigate("emergency-guide")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Emergency Guide</p>
              <HelperText>Know the warning signs</HelperText>
            </div>
          </div>
        </BloomCard>

        {/* Daily Tip Banner */}
        <Banner
          variant="emotional"
          title="Daily Affirmation"
          message={`"You're doing amazing. Take a moment to breathe and connect with your little one today."`}
        />

        {/* Encouraging Message */}
        <BloomCard className="bg-gradient-to-r from-primary/10 to-accent/10 text-center">
          <BodyText className="text-foreground font-medium mb-1">
            {pregnancyInfo.daysRemaining} days until you meet your baby
          </BodyText>
          <HelperText>
            Due date: {pregnancyInfo.dueDate ? new Date(pregnancyInfo.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not set"}
          </HelperText>
        </BloomCard>
      </div>
    </div>
  );
}
