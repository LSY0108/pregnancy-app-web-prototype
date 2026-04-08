"use client";

import { useState } from "react";
import {
  AppHeader,
  BabyGrowthCard,
  WeeklyInfoCard,
  ProgressCard,
  SectionTitle,
  SegmentedControl,
  HelperText,
  BloomCard,
  Caption,
} from "@/components/bloom-ui";
import { Baby, Heart, Brain, Eye, Ear, Hand, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const weekData: Record<number, {
  babySize: string;
  babyEmoji: string;
  babyLength: string;
  babyWeight: string;
  milestone: string;
  babyDevelopment: { icon: string; title: string; description: string }[];
  motherChanges: { title: string; description: string }[];
  tips: string[];
}> = {
  24: {
    babySize: "Corn",
    babyEmoji: "🌽",
    babyLength: "30 cm",
    babyWeight: "600 g",
    milestone: "Baby's inner ear is now fully developed, giving them a sense of balance. They can tell if they're upside down!",
    babyDevelopment: [
      { icon: "ear", title: "Hearing", description: "Can hear sounds from outside the womb" },
      { icon: "brain", title: "Brain", description: "Taste buds are developing" },
      { icon: "eye", title: "Eyes", description: "Facial features are becoming more defined" },
      { icon: "hand", title: "Lungs", description: "Developing branches for breathing" },
    ],
    motherChanges: [
      { title: "Stretch Marks", description: "You may notice stretch marks appearing on your belly" },
      { title: "Backaches", description: "Backaches might become more common as baby grows" },
      { title: "Belly Button", description: "Your belly button may start to pop out" },
      { title: "Appetite", description: "Increased appetite as baby continues to grow" },
    ],
    tips: [
      "Talk and sing to your baby - they can hear you!",
      "Stay hydrated with at least 8 glasses of water",
      "Consider prenatal yoga for flexibility and relaxation",
    ],
  },
};

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ear: Ear,
  brain: Brain,
  eye: Eye,
  hand: Hand,
};

export function WeeklyScreen() {
  const [currentWeek, setCurrentWeek] = useState(24);
  const [activeTab, setActiveTab] = useState("baby");
  
  const data = weekData[24];
  const trimester = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;
  const weeksInTrimester = trimester === 1 ? 12 : trimester === 2 ? 15 : 13;
  const weekInTrimester = trimester === 1 ? currentWeek : trimester === 2 ? currentWeek - 12 : currentWeek - 27;

  const handlePrevWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    if (currentWeek < 40) setCurrentWeek(currentWeek + 1);
  };

  return (
    <div className="flex flex-col pb-6">
      <AppHeader 
        title="Weekly Development" 
        subtitle="Track your baby&apos;s growth journey"
      />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {/* Week Selector */}
        <BloomCard className="bg-secondary/50">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePrevWeek}
              disabled={currentWeek <= 1}
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <Caption>Trimester {trimester}</Caption>
              <div className="flex items-baseline gap-1 justify-center mt-1">
                <span className="text-3xl font-semibold text-primary">Week {currentWeek}</span>
              </div>
              <HelperText>of 40</HelperText>
            </div>
            <button 
              onClick={handleNextWeek}
              disabled={currentWeek >= 40}
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Trimester Progress */}
          <div className="mt-4 flex gap-1">
            {[1, 2, 3].map((t) => {
              const startWeek = (t - 1) * 13 + 1;
              const endWeek = t === 3 ? 40 : t * 13;
              const isCurrentTrimester = currentWeek >= startWeek && currentWeek <= endWeek;
              return (
                <div 
                  key={t}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${isCurrentTrimester ? "bg-primary" : "bg-muted"}`}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex justify-between px-1">
            <HelperText>1st Trimester</HelperText>
            <HelperText>2nd Trimester</HelperText>
            <HelperText>3rd Trimester</HelperText>
          </div>
        </BloomCard>

        {/* Trimester Progress Card */}
        <ProgressCard
          title={`Trimester ${trimester} Progress`}
          current={weekInTrimester}
          total={weeksInTrimester}
          unit="weeks"
          color="primary"
        />

        {/* Baby Growth Highlight */}
        <BabyGrowthCard
          week={currentWeek}
          size={data.babySize}
          weight={data.babyWeight}
          length={data.babyLength}
          milestone={data.milestone}
        />

        {/* Tabs */}
        <SegmentedControl
          options={[
            { value: "baby", label: "Baby" },
            { value: "mother", label: "Your Body" },
            { value: "tips", label: "Tips" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "baby" && (
          <div className="flex flex-col gap-3">
            <SectionTitle className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-primary" />
              Baby Development
            </SectionTitle>
            {data.babyDevelopment.map((dev, index) => {
              const IconComponent = IconMap[dev.icon] || Baby;
              return (
                <BloomCard key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-sage-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{dev.title}</span>
                    <HelperText>{dev.description}</HelperText>
                  </div>
                </BloomCard>
              );
            })}
          </div>
        )}

        {activeTab === "mother" && (
          <div className="flex flex-col gap-3">
            <SectionTitle className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Your Body This Week
            </SectionTitle>
            {data.motherChanges.map((change, index) => (
              <WeeklyInfoCard
                key={index}
                icon={Heart}
                title={change.title}
                description={change.description}
                variant="lavender"
              />
            ))}
          </div>
        )}

        {activeTab === "tips" && (
          <div className="flex flex-col gap-3">
            <SectionTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Tips for This Week
            </SectionTitle>
            {data.tips.map((tip, index) => (
              <BloomCard key={index} className="bg-accent/10">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{tip}</span>
                </div>
              </BloomCard>
            ))}
          </div>
        )}

        {/* Quick Week Navigation */}
        <div className="flex flex-col gap-2">
          <HelperText className="text-center">Quick Navigation</HelperText>
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                className={`w-9 h-9 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  week === currentWeek
                    ? "bg-primary text-primary-foreground"
                    : week <= currentWeek
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
