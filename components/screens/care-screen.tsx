"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Pill, Clock, MapPin, Plus, Check, ChevronRight, Bell } from "lucide-react"
import { useState } from "react"

const supplements = [
  { id: "prenatal", name: "Prenatal Vitamins", time: "Morning", taken: true, emoji: "💊" },
  { id: "iron", name: "Iron Supplement", time: "After lunch", taken: true, emoji: "🔴" },
  { id: "omega3", name: "Omega-3 DHA", time: "Evening", taken: false, emoji: "🐟" },
  { id: "calcium", name: "Calcium", time: "Before bed", taken: false, emoji: "🦴" },
]

const upcomingAppointments = [
  {
    id: "1",
    title: "Prenatal Checkup",
    date: "2026-04-15",
    time: "10:30 AM",
    hospital: "Seoul Women's Hospital",
    doctor: "Dr. Kim Soyeon",
    type: "checkup",
  },
  {
    id: "2",
    title: "Glucose Tolerance Test",
    date: "2026-04-22",
    time: "9:00 AM",
    hospital: "Seoul Women's Hospital",
    doctor: "Dr. Park Jihye",
    type: "test",
  },
  {
    id: "3",
    title: "Ultrasound",
    date: "2026-05-01",
    time: "2:00 PM",
    hospital: "Seoul Women's Hospital",
    doctor: "Dr. Kim Soyeon",
    type: "ultrasound",
  },
]

const kickCounts = [
  { date: "Today", count: 12, time: "2h 15m" },
  { date: "Yesterday", count: 15, time: "1h 45m" },
  { date: "Apr 6", count: 10, time: "2h 30m" },
]

export function CareScreen() {
  const [supplementList, setSupplementList] = useState(supplements)

  const toggleSupplement = (id: string) => {
    setSupplementList(prev =>
      prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s)
    )
  }

  const takenCount = supplementList.filter(s => s.taken).length

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Care & Appointments</h1>
        <p className="text-sm text-muted-foreground">Manage your health and visits</p>
      </header>

      {/* Supplements Tracker */}
      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Pill className="h-4 w-4 text-primary" />
            Today&apos;s Supplements
          </h3>
          <span className="text-sm text-muted-foreground">
            {takenCount}/{supplementList.length} taken
          </span>
        </div>
        <Card className="border-0 p-4 shadow-sm">
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(takenCount / supplementList.length) * 100}%` }}
            />
          </div>
          <div className="space-y-3">
            {supplementList.map((supplement) => (
              <div 
                key={supplement.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg">
                    {supplement.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{supplement.name}</p>
                    <p className="text-xs text-muted-foreground">{supplement.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSupplement(supplement.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    supplement.taken 
                      ? "bg-primary text-primary-foreground" 
                      : "border-2 border-muted bg-transparent"
                  }`}
                >
                  {supplement.taken && <Check className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplement
          </Button>
        </Card>
      </section>

      {/* Upcoming Appointments */}
      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Upcoming Appointments
          </h3>
          <button className="text-sm text-primary">Add new</button>
        </div>
        <div className="space-y-3">
          {upcomingAppointments.map((apt, index) => {
            const date = new Date(apt.date)
            const isFirst = index === 0
            return (
              <Card 
                key={apt.id} 
                className={`border-0 p-4 shadow-sm ${isFirst ? "ring-1 ring-primary/20" : ""}`}
              >
                <div className="flex gap-3">
                  <div className={`flex flex-col items-center rounded-xl px-3 py-2 ${
                    isFirst ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    <span className={`text-xs font-medium ${isFirst ? "text-primary" : "text-muted-foreground"}`}>
                      {date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                    </span>
                    <span className={`text-lg font-bold ${isFirst ? "text-primary" : "text-foreground"}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{apt.title}</p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {apt.time}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {apt.hospital}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{apt.doctor}</p>
                  </div>
                </div>
                {isFirst && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 rounded-lg text-xs">
                      <Bell className="mr-1.5 h-3 w-3" />
                      Set Reminder
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">
                      Reschedule
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* Kick Counter */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Kick Counter</h3>
          <button className="text-sm text-primary">View history</button>
        </div>
        <Card className="border-0 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s kicks</p>
              <p className="text-3xl font-bold text-foreground">{kickCounts[0].count}</p>
            </div>
            <Button className="h-16 w-16 rounded-full text-2xl">
              👶
            </Button>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Activity</p>
            <div className="flex justify-between">
              {kickCounts.map((day) => (
                <div key={day.date} className="text-center">
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                  <p className="font-semibold text-foreground">{day.count}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Aim for 10 kicks within 2 hours after meals 💕
          </p>
        </Card>
      </section>
    </div>
  )
}
