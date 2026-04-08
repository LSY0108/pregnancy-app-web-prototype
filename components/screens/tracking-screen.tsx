"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Scale, Droplets, Moon, Smile, Meh, Frown, Plus, Check } from "lucide-react"
import { useState } from "react"

const moods = [
  { icon: Smile, label: "Happy", color: "text-green-500 bg-green-50" },
  { icon: Smile, label: "Good", color: "text-emerald-500 bg-emerald-50" },
  { icon: Meh, label: "Okay", color: "text-amber-500 bg-amber-50" },
  { icon: Meh, label: "Tired", color: "text-orange-500 bg-orange-50" },
  { icon: Frown, label: "Anxious", color: "text-rose-500 bg-rose-50" },
]

const symptoms = [
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "fatigue", label: "Fatigue", emoji: "😴" },
  { id: "backache", label: "Back pain", emoji: "💆" },
  { id: "heartburn", label: "Heartburn", emoji: "🔥" },
  { id: "swelling", label: "Swelling", emoji: "🦶" },
  { id: "cramps", label: "Cramps", emoji: "💫" },
  { id: "headache", label: "Headache", emoji: "🤕" },
  { id: "insomnia", label: "Insomnia", emoji: "😵" },
]

const waterGoal = 8
const sleepGoal = 8

export function TrackingScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>("Good")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["fatigue", "backache"])
  const [waterIntake, setWaterIntake] = useState(6)
  const [sleepHours, setSleepHours] = useState(7)
  const [weight, setWeight] = useState("62.5")

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Daily Record</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </header>

      {/* Mood Tracker */}
      <section className="mb-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
          <Heart className="h-4 w-4 text-primary" />
          How are you feeling today?
        </h3>
        <Card className="border-0 p-4 shadow-sm">
          <div className="flex justify-between gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon
              const isSelected = selectedMood === mood.label
              return (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                    isSelected ? mood.color + " ring-2 ring-offset-2 ring-primary/30" : "bg-secondary"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? mood.color.split(" ")[0] : "text-muted-foreground"}`} />
                  <span className={`text-[10px] font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {mood.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Symptoms */}
      <section className="mb-5">
        <h3 className="mb-3 font-semibold text-foreground">Any symptoms today?</h3>
        <Card className="border-0 p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`relative flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                    isSelected ? "bg-primary/10 ring-1 ring-primary/30" : "bg-secondary"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-xl">{symptom.emoji}</span>
                  <span className="text-[10px] text-muted-foreground">{symptom.label}</span>
                </button>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Quick Stats */}
      <section className="mb-5 grid grid-cols-2 gap-3">
        {/* Water Intake */}
        <Card className="border-0 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium text-foreground">Water</span>
            </div>
            <span className="text-xs text-muted-foreground">{waterIntake}/{waterGoal} cups</span>
          </div>
          <div className="flex justify-center gap-1">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWaterIntake(i + 1)}
                className={`h-8 w-3 rounded-full transition-all ${
                  i < waterIntake ? "bg-sky-400" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Sleep */}
        <Card className="border-0 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-foreground">Sleep</span>
            </div>
            <span className="text-xs text-muted-foreground">{sleepHours}h</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              -
            </button>
            <span className="w-12 text-center text-lg font-semibold text-foreground">{sleepHours}h</span>
            <button 
              onClick={() => setSleepHours(Math.min(12, sleepHours + 0.5))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              +
            </button>
          </div>
        </Card>
      </section>

      {/* Weight */}
      <section className="mb-5">
        <Card className="border-0 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Scale className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Weight</p>
                <p className="text-xs text-muted-foreground">Last recorded: Today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">{weight}</span>
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="range"
              min="40"
              max="100"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-2 w-full appearance-none rounded-full bg-secondary accent-primary"
            />
          </div>
        </Card>
      </section>

      {/* Notes */}
      <section className="mb-5">
        <Card className="border-0 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Add a note</span>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <textarea
            placeholder="How are you feeling? Any special moments today?"
            className="w-full resize-none rounded-xl bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
            rows={3}
          />
        </Card>
      </section>

      {/* Save Button */}
      <Button className="w-full rounded-xl py-6 text-base font-medium">
        Save Today&apos;s Record
      </Button>

      {/* Encouragement */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Tracking helps you understand your body better 💪
      </p>
    </div>
  )
}
