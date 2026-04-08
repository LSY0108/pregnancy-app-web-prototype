"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { 
  BloomButton, 
  BloomInput, 
  BloomTextarea,
  HelperText, 
  SectionTitle,
  SegmentedControl,
  BloomCard
} from "@/components/bloom-ui";
import { ArrowLeft, Calendar, Clock, MapPin, Bell, Pill, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

type ScheduleType = "appointment" | "supplement";

const appointmentTypes = [
  "Regular Checkup",
  "Ultrasound",
  "Blood Test",
  "Glucose Test",
  "Specialist Visit",
  "Other"
];

const reminderOptions = [
  { value: "none", label: "None" },
  { value: "15min", label: "15 min" },
  { value: "1hour", label: "1 hour" },
  { value: "1day", label: "1 day" },
];

export function CreateScheduleScreen() {
  const { goBack } = useApp();
  const [scheduleType, setScheduleType] = useState<ScheduleType>("appointment");
  const [appointmentType, setAppointmentType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState("1hour");
  
  // Supplement specific
  const [supplementName, setSupplementName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const handleSave = () => {
    // Save schedule entry
    goBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Add Schedule</h1>
        </div>
        <BloomButton variant="primary" size="sm" onClick={handleSave}>
          Save
        </BloomButton>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Type Selection */}
        <div className="mb-6">
          <SegmentedControl
            options={[
              { value: "appointment", label: "Appointment" },
              { value: "supplement", label: "Supplement" },
            ]}
            value={scheduleType}
            onChange={(v) => setScheduleType(v as ScheduleType)}
          />
        </div>

        {scheduleType === "appointment" ? (
          <>
            {/* Appointment Type */}
            <div className="mb-6">
              <SectionTitle className="mb-4">Appointment Type</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {appointmentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setAppointmentType(type)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all",
                      appointmentType === type
                        ? "bg-sage/20 text-sage-foreground ring-2 ring-sage"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Stethoscope className="w-4 h-4" />
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="mb-6">
              <SectionTitle className="mb-4">Date & Time</SectionTitle>
              <div className="flex gap-3">
                <div className="flex-1">
                  <BloomInput
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    label="Date"
                  />
                </div>
                <div className="flex-1">
                  <BloomInput
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    label="Time"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <BloomInput
                label="Location"
                placeholder="Hospital or clinic name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Reminder */}
            <div className="mb-6">
              <SectionTitle className="mb-4">Reminder</SectionTitle>
              <div className="flex gap-2">
                {reminderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setReminder(option.value)}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      reminder === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Supplement Name */}
            <div className="mb-6">
              <BloomInput
                label="Supplement Name"
                placeholder="e.g., Folic Acid, Iron, Vitamin D"
                value={supplementName}
                onChange={(e) => setSupplementName(e.target.value)}
              />
            </div>

            {/* Dosage */}
            <div className="mb-6">
              <BloomInput
                label="Dosage"
                placeholder="e.g., 400mcg, 1 tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            {/* Frequency */}
            <div className="mb-6">
              <SectionTitle className="mb-4">Frequency</SectionTitle>
              <SegmentedControl
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "twice", label: "Twice" },
                  { value: "weekly", label: "Weekly" },
                ]}
                value={frequency}
                onChange={setFrequency}
              />
            </div>

            {/* Time */}
            <div className="mb-6">
              <BloomInput
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                label="Reminder Time"
              />
            </div>
          </>
        )}

        {/* Notes */}
        <div className="mb-6">
          <BloomTextarea
            label="Notes (optional)"
            placeholder="Any additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
