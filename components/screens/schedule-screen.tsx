"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import {
  AppHeader,
  SectionTitle,
  BloomCard,
  CardTitle,
  HelperText,
  HospitalScheduleCard,
  SupplementCard,
  SegmentedControl,
  FloatingActionButton,
  EmptyState,
  ProgressCard,
} from "@/components/bloom-ui";
import { Plus, Calendar, Pill, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample appointments
const appointments = [
  {
    id: 1,
    date: "2026-04-15",
    time: "10:30 AM",
    type: "Prenatal Checkup",
    location: "Seoul Women's Hospital",
  },
  {
    id: 2,
    date: "2026-04-28",
    time: "2:00 PM",
    type: "Ultrasound",
    location: "Seoul Women's Hospital",
  },
  {
    id: 3,
    date: "2026-05-10",
    time: "11:00 AM",
    type: "Glucose Test",
    location: "Seoul Medical Center",
  },
];

// Sample supplements
const supplements = [
  { id: 1, name: "Folic Acid", dosage: "400mcg", time: "Morning", taken: true },
  { id: 2, name: "Iron", dosage: "30mg", time: "Afternoon", taken: true },
  { id: 3, name: "Vitamin D", dosage: "1000IU", time: "Morning", taken: false },
  { id: 4, name: "DHA/Omega-3", dosage: "200mg", time: "Evening", taken: false },
];

export function ScheduleScreen() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState("appointments");
  const [supplementList, setSupplementList] = useState(supplements);

  const toggleSupplement = (id: number) => {
    setSupplementList(prev =>
      prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s)
    );
  };

  const takenCount = supplementList.filter(s => s.taken).length;

  return (
    <div className="flex flex-col pb-24 relative">
      <AppHeader 
        title="Schedule" 
        subtitle="Appointments & supplements"
      />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {/* Tab Selector */}
        <SegmentedControl
          options={[
            { value: "appointments", label: "Appointments" },
            { value: "supplements", label: "Supplements" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "appointments" ? (
          <>
            {/* Upcoming Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <SectionTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming
                </SectionTitle>
                <HelperText>{appointments.length} visits</HelperText>
              </div>

              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <HospitalScheduleCard
                    key={apt.id}
                    date={new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    time={apt.time}
                    type={apt.type}
                    location={apt.location}
                    onReminder={() => {}}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No upcoming appointments"
                  description="Schedule your next prenatal visit"
                  actionLabel="Add Appointment"
                  onAction={() => navigate("create-schedule")}
                />
              )}
            </div>

            {/* Quick Tips */}
            <BloomCard className="bg-sage/10">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-sage-foreground">Appointment Tips</CardTitle>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-foreground">•</span>
                    Write down questions before your visit
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-foreground">•</span>
                    Bring your pregnancy log to share
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-foreground">•</span>
                    {"Don't hesitate to ask about any concerns"}
                  </li>
                </ul>
              </div>
            </BloomCard>

            {/* Calendar View Hint */}
            <BloomCard interactive className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Full Calendar</CardTitle>
                  <HelperText>View all scheduled events</HelperText>
                </div>
              </div>
            </BloomCard>
          </>
        ) : (
          <>
            {/* Today's Progress */}
            <ProgressCard
              title="Today's Supplements"
              current={takenCount}
              total={supplementList.length}
              color="lavender"
            />

            {/* Supplement List */}
            <div className="flex flex-col gap-3">
              <SectionTitle className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-lavender-foreground" />
                {"Today's Schedule"}
              </SectionTitle>

              {supplementList.map((supplement) => (
                <SupplementCard
                  key={supplement.id}
                  name={supplement.name}
                  dosage={supplement.dosage}
                  time={supplement.time}
                  taken={supplement.taken}
                  onToggle={() => toggleSupplement(supplement.id)}
                />
              ))}
            </div>

            {/* Completion Message */}
            {takenCount === supplementList.length && (
              <BloomCard className="bg-success/10 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <CardTitle className="text-success">All done for today!</CardTitle>
                  <HelperText>{"Great job taking care of yourself and your baby"}</HelperText>
                </div>
              </BloomCard>
            )}

            {/* Reminder Settings */}
            <BloomCard interactive className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lavender/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-lavender-foreground" />
                </div>
                <div>
                  <CardTitle>Reminder Settings</CardTitle>
                  <HelperText>Set daily supplement reminders</HelperText>
                </div>
              </div>
            </BloomCard>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={Plus} 
        onClick={() => navigate("create-schedule")}
      />
    </div>
  );
}
