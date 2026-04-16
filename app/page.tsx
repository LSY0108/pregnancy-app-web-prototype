"use client"

import { useState, useEffect, useMemo, memo } from "react"
import {
  Home,
  FileText,
  Calendar,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bell,
  MoreHorizontal,
  Heart,
  Bookmark,
  Eye,
  Send,
  Camera,
  Smile,
  Check,
  X,
  Edit3,
  Trash2,
  AlertTriangle,
  Ban,
  ChevronDown,
} from "lucide-react"

// Types
type Screen =
  | "splash"
  | "onboarding"
  | "auth"
  | "pregnancy-setup"
  | "notification-setup"
  | "home"
  | "record"
  | "schedule"
  | "community"
  | "post-detail"
  | "post-write"
  | "mypage"
  | "weekly-info"
  | "weekly-report"
  | "notifications"

type RecordTab = "today" | "history"
type WeeklyInfoTab = "baby" | "mom"
type CommunitySort = "latest" | "popular"
type PregnancyType = "single" | "multiple" | null

interface Child {
  id: string
  nickname: string
  order: string
  dueDate: Date
}

interface DailyRecord {
  date: string
  moods: string[]
  symptoms: string[]
  weight: number
  water: number
  sleep: number
  memo: string
}

interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  repeat: string
  completed: boolean
}

interface Post {
  id: string
  category: string
  title: string
  author: string
  week: number
  content: string
  likes: number
  views: number
  comments: Comment[]
  createdAt: string
  isOwn?: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface Notification {
  id: string
  content: string
  createdAt: string
  read: boolean
}

// Mock Data
const mockRecords: DailyRecord[] = [
  { date: "2025-04-07", moods: ["😊"], symptoms: ["두통", "피로"], weight: 62.0, water: 1.2, sleep: 7, memo: "오늘 기분이 좋았어요" },
  { date: "2025-04-08", moods: ["😴"], symptoms: ["부종", "허리통증"], weight: 62.1, water: 1.5, sleep: 6, memo: "조금 피곤한 하루" },
  { date: "2025-04-09", moods: ["🥰", "😊"], symptoms: ["입덧"], weight: 62.2, water: 1.8, sleep: 8, memo: "아기가 움직인 것 같아요!" },
  { date: "2025-04-10", moods: ["😤"], symptoms: ["소화불량", "불면"], weight: 62.3, water: 1.4, sleep: 5, memo: "밤에 잠을 못 잤어요" },
  { date: "2025-04-11", moods: ["😐"], symptoms: ["빈뇨"], weight: 62.3, water: 1.6, sleep: 7, memo: "" },
]

const mockEvents: ScheduleEvent[] = [
  { id: "1", title: "정기검진", date: "2025-04-15", time: "10:00", repeat: "없음", completed: false },
  { id: "2", title: "임산부 요가", date: "2025-04-17", time: "14:00", repeat: "매주", completed: false },
  { id: "3", title: "임산부 요가", date: "2025-04-10", time: "14:00", repeat: "매주", completed: true },
]

const mockPosts: Post[] = [
  {
    id: "1",
    category: "임신질문",
    title: "14주차인데 배가 콕콕 쑤시는 느낌 있으신가요?",
    author: "행복한맘",
    week: 14,
    content: "안녕하세요 14주차 맘입니다.\n\n요즘 배 아래쪽이 콕콕 쑤시는 느낌이 있는데 이게 정상인지 궁금해요.\n\n다른 분들도 이런 증상 있으신가요? 병원에 가봐야 할까요?\n\n첫 임신이라 모든 게 걱정되네요 ㅠㅠ",
    likes: 24,
    views: 156,
    comments: [
      { id: "c1", author: "봄날맘", content: "저도 그랬어요! 자궁이 커지면서 나타나는 증상이래요~", createdAt: "30분 전" },
      { id: "c2", author: "해피맘", content: "정상이에요 걱정마세요 ㅎㅎ", createdAt: "1시간 전" },
    ],
    createdAt: "2시간 전",
  },
  {
    id: "2",
    category: "출산경험",
    title: "무통분만 후기 공유해요",
    author: "아기천사맘",
    week: 38,
    content: "지난주에 출산했어요! 무통분만 선택했는데 정말 다행이었어요.\n\n후기 남겨봅니다~",
    likes: 89,
    views: 423,
    comments: [{ id: "c3", author: "예비맘", content: "후기 감사해요! 저도 무통 생각중이에요", createdAt: "5분 전" }],
    createdAt: "1일 전",
  },
  {
    id: "3",
    category: "육아템",
    title: "신생아 용품 리스트 정리했어요",
    author: "꼼꼼맘",
    week: 32,
    content: "출산 준비하면서 정리한 신생아 용품 리스트 공유합니다!\n\n필수템 위주로 정리했어요.",
    likes: 156,
    views: 892,
    comments: [],
    createdAt: "3일 전",
  },
  {
    id: "4",
    category: "자유",
    title: "오늘 날씨 너무 좋아서 산책했어요",
    author: "봄날맘",
    week: 14,
    content: "14주차 들어서 입덧이 줄어드니까 밖에 나가고 싶더라구요~\n\n오늘 공원 산책했는데 기분 최고!",
    likes: 45,
    views: 234,
    comments: [],
    createdAt: "5시간 전",
    isOwn: true,
  },
  {
    id: "5",
    category: "산후조리",
    title: "산후조리원 vs 집에서 조리 고민이에요",
    author: "고민맘",
    week: 28,
    content: "산후조리원 비용이 부담되는데... 집에서 하신 분들 후기 궁금해요!",
    likes: 67,
    views: 345,
    comments: [],
    createdAt: "6시간 전",
  },
  {
    id: "6",
    category: "임신질문",
    title: "임신 중 커피 얼마나 마셔도 되나요?",
    author: "커피러버",
    week: 12,
    content: "커피를 너무 좋아하는데... 임신 중에는 어느 정도까지 괜찮을까요?",
    likes: 33,
    views: 198,
    comments: [],
    createdAt: "8시간 전",
  },
  {
    id: "7",
    category: "육아팁",
    title: "출산가방 싸는 팁 알려드려요",
    author: "베테랑맘",
    week: 36,
    content: "3번째 출산 앞두고 있는 맘이에요. 출산가방 싸는 노하우 공유합니다!",
    likes: 124,
    views: 678,
    comments: [],
    createdAt: "1일 전",
  },
  {
    id: "8",
    category: "인기",
    title: "임신 축하 선물 뭐가 좋을까요?",
    author: "친구맘",
    week: 8,
    content: "친구가 임신했는데 선물 추천해주세요!",
    likes: 78,
    views: 412,
    comments: [],
    createdAt: "2일 전",
  },
]

const mockNotifications: Notification[] = [
  { id: "1", content: "봄날맘님이 회원님의 게시글에 댓글을 달았습니다.", createdAt: "1시간 전", read: false },
  { id: "2", content: "해피맘님이 회원님의 댓글에 공감했습니다.", createdAt: "2시간 전", read: false },
  { id: "3", content: "새로운 14주차 정보가 업데이트되었습니다.", createdAt: "1일 전", read: true },
  { id: "4", content: "예비맘님이 회원님의 게시글을 저장했습니다.", createdAt: "2일 전", read: true },
]

const categories = ["전체", "인기", "임신질문", "출산경험", "산후조리", "육아템", "육아팁", "자유"]
const moods = ["😊", "😐", "😢", "😤", "🥰", "😴"]
const moodLabels = ["좋음", "보통", "슬픔", "예민", "행복", "피곤"]
const defaultSymptoms = ["두통", "부종", "입덧", "허리통증", "소화불량", "불면", "빈뇨", "피로"]
const repeatOptions = ["안 함", "매일", "매주", "2주마다", "매월", "매년"]

// Utility functions
function calculateWeeks(dueDate: Date): { weeks: number; days: number; daysUntilDue: number } {
  const today = new Date()
  const totalDays = 280
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const daysPassed = totalDays - daysUntilDue
  const weeks = Math.floor(daysPassed / 7)
  const days = daysPassed % 7
  return { weeks: Math.max(0, weeks), days: Math.max(0, days), daysUntilDue: Math.max(0, daysUntilDue) }
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// Baby size data by week
const babySizeData: Record<number, { size: string; length: string; weight: string; development: string[]; tips: string[] }> = {
  14: {
    size: "복숭아",
    length: "약 8.7cm",
    weight: "약 43g",
    development: [
      "얼굴 근육이 발달하여 표정을 지을 수 있어요",
      "손가락, 발가락이 완전히 분리되었어요",
      "솜털이 온몸에 자라기 시작해요",
      "갑상선이 호르몬을 분비하기 시작해요",
    ],
    tips: [
      "자궁이 커지면서 배가 나오기 시작해요",
      "입덧이 줄어들기 시작하는 시기예요",
      "피부가 건조해질 수 있어 보습에 신경쓰세요",
      "철분 보충제 복용이 권장돼요",
    ],
  },
}

// Memoized Report Card Components
const MoodChartCard = memo(function MoodChartCard({ moodScores, weekDays }: { moodScores: number[]; weekDays: string[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-4">
      <h3 className="font-semibold text-foreground mb-4 break-words">감정 변화 추이</h3>
      <div className="flex items-end justify-between h-32 mb-2">
        {moodScores.map((score, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-6 bg-[#a3daff]/20 rounded-t" style={{ height: `${score * 20}%` }}>
              <div className="w-full h-full bg-[#a3daff] rounded-t" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {weekDays.map((day) => (
          <span key={day} className="flex-1 text-center">
            {day}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-3 break-words">이번 주 가장 많이 느낀 감정: 😊 행복</p>
    </div>
  )
})

const WeightChartCard = memo(function WeightChartCard({ weights, weekDays }: { weights: number[]; weekDays: string[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-4">
      <h3 className="font-semibold text-foreground mb-4 break-words">체중 변화 추이</h3>
      <div className="flex items-end justify-between h-24 mb-2">
        {weights.map((w, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-6 bg-secondary rounded-t" style={{ height: `${((w - 61.5) / 1) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {weekDays.map((day) => (
          <span key={day} className="flex-1 text-center">
            {day}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-3 break-words">이번 주 평균 체중: 62.1kg (+0.3kg)</p>
    </div>
  )
})

const SymptomsCard = memo(function SymptomsCard({ symptoms }: { symptoms: { name: string; count: number }[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-4">
      <h3 className="font-semibold text-foreground mb-4 break-words">자주 기록된 증상</h3>
      <div className="space-y-3">
        {symptoms.map((symptom) => (
          <div key={symptom.name} className="flex items-center gap-3">
            <span className="text-sm text-foreground w-16 break-words">#{symptom.name}</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#a3daff] rounded-full" style={{ width: `${(symptom.count / 7) * 100}%` }} />
            </div>
            <span className="text-sm text-muted-foreground">{symptom.count}회</span>
          </div>
        ))}
      </div>
    </div>
  )
})

const AchievementCard = memo(function AchievementCard({ achievements }: { achievements: boolean[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <h3 className="font-semibold text-foreground mb-4 break-words">이번 주 기록 달성</h3>
      <p className="text-foreground mb-3 break-words">7일 중 5일 기록 완료</p>
      <div className="flex gap-2">
        {achievements.map((filled, i) => (
          <div key={i} className={`w-8 h-8 rounded-full ${filled ? "bg-[#a3daff]" : "bg-muted"}`} />
        ))}
      </div>
    </div>
  )
})



export default function PregnancyApp() {
  // App State
  const [screen, setScreen] = useState<Screen>("splash")
  const [isFirstLaunch, setIsFirstLaunch] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [setupDone, setSetupDone] = useState(false)

  // Onboarding State
  const [onboardingIndex, setOnboardingIndex] = useState(0)

  // Pregnancy Setup State
  const [pregnancyType, setPregnancyType] = useState<PregnancyType>(null)
  const [multipleCount, setMultipleCount] = useState(2)
  const [showMultipleInfo, setShowMultipleInfo] = useState(false)
  const [setupStep, setSetupStep] = useState(1)
  const [calcMethod, setCalcMethod] = useState<"lmp" | "dueDate">("dueDate")
  const [selectedDate, setSelectedDate] = useState("2025-08-20")
  const [showResult, setShowResult] = useState(false)
  const [dueDate, setDueDate] = useState<Date>(new Date("2025-08-20"))

  // Children State
  const [children, setChildren] = useState<Child[]>([
    { id: "1", nickname: "콩이", order: "첫째", dueDate: new Date("2025-08-20") }
  ])
  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  // Notification Setup State
  const [scheduleNotif, setScheduleNotif] = useState(true)
  const [commentNotif, setCommentNotif] = useState(true)
  const [notifTime, setNotifTime] = useState("10:00")

  // Record State
  const [recordTab, setRecordTab] = useState<RecordTab>("today")
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]) // tracks selected preset symptoms
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]) // user-created symptoms (always "selected" when visible)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customSymptomInput, setCustomSymptomInput] = useState("")
  const [weight, setWeight] = useState("62.3")
  const [water, setWater] = useState("1.5")
  const [sleep, setSleep] = useState("7")
  const [memo, setMemo] = useState("")
  const [historyDate, setHistoryDate] = useState(new Date())
  const [historyMonth, setHistoryMonth] = useState(new Date())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [records, setRecords] = useState<DailyRecord[]>(mockRecords)
  const [editingRecordDate, setEditingRecordDate] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTargetDate, setDeleteTargetDate] = useState<string | null>(null)

  // Schedule State
  const [scheduleMonth, setScheduleMonth] = useState(new Date())
  const [scheduleSelectedDate, setScheduleSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>(mockEvents)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")
  const [newEventTime, setNewEventTime] = useState("10:00")
  const [newEventRepeat, setNewEventRepeat] = useState("안 함")
  const [newEventNotif, setNewEventNotif] = useState(true)
  const [showScheduleSearch, setShowScheduleSearch] = useState(false)
  const [scheduleSearchQuery, setScheduleSearchQuery] = useState("")

  // Community State
  const [communityCategory, setCommunityCategory] = useState("전체")
  const [communitySort, setCommunitySort] = useState<CommunitySort>("latest")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPostMenu, setShowPostMenu] = useState(false)
  const [showCommunitySearch, setShowCommunitySearch] = useState(false)
  const [communitySearchQuery, setCommunitySearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  // Post Write State
  const [postCategory, setPostCategory] = useState("임신질문")
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [photoCount, setPhotoCount] = useState(0)

  // Weekly Info State
  const [weeklyInfoTab, setWeeklyInfoTab] = useState<WeeklyInfoTab>("baby")
  const [selectedWeek, setSelectedWeek] = useState(14)
  const [showWeekPicker, setShowWeekPicker] = useState(false)

  // Weekly Report State
  const [reportWeek, setReportWeek] = useState(14)
  const [showReportWeekPicker, setShowReportWeekPicker] = useState(false)

  // MyPage State
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showNotifSettings, setShowNotifSettings] = useState(false)
  const [nickname, setNickname] = useState("봄날맘")
  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState("봄날맘")
  const [dndStart, setDndStart] = useState("01:00")
  const [dndEnd, setDndEnd] = useState("06:00")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [showChildEditSheet, setShowChildEditSheet] = useState(false)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [editChildNickname, setEditChildNickname] = useState("")
  const [editChildOrder, setEditChildOrder] = useState("")
  const [editChildDueDate, setEditChildDueDate] = useState("")
  const [applyToAll, setApplyToAll] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showCannotDeleteAlert, setShowCannotDeleteAlert] = useState(false)
  const [showDndPicker, setShowDndPicker] = useState(false)
  const [showNotifTimePicker, setShowNotifTimePicker] = useState(false)
  const [tempNotifTime, setTempNotifTime] = useState("10:00")
  
  // Drum roll picker state
  const [dndStartAmPm, setDndStartAmPm] = useState<"AM" | "PM">("AM")
  const [dndStartHour, setDndStartHour] = useState("01")
  const [dndStartMinute, setDndStartMinute] = useState("00")
  const [dndEndAmPm, setDndEndAmPm] = useState<"AM" | "PM">("AM")
  const [dndEndHour, setDndEndHour] = useState("06")
  const [dndEndMinute, setDndEndMinute] = useState("00")
  const [notifAmPm, setNotifAmPm] = useState<"AM" | "PM">("AM")
  const [notifHour, setNotifHour] = useState("10")
  const [notifMinute, setNotifMinute] = useState("00")

  // Pregnancy calculation
  const pregnancyInfo = useMemo(() => calculateWeeks(dueDate), [dueDate])

  // Lock body scroll when any bottom sheet is open
  useEffect(() => {
    const isAnySheetOpen = showChildEditSheet || showProfileSheet || showEventModal || showDndPicker || showNotifTimePicker || showLogoutModal || showWithdrawModal || showWeekPicker || showReportWeekPicker || showPostMenu || showMultipleInfo || showDeleteConfirm || showCannotDeleteAlert
    if (isAnySheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showChildEditSheet, showProfileSheet, showEventModal, showDndPicker, showNotifTimePicker, showLogoutModal, showWithdrawModal, showWeekPicker, showReportWeekPicker, showPostMenu, showMultipleInfo, showDeleteConfirm, showCannotDeleteAlert])

  // Splash screen logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFirstLaunch) {
        setScreen("onboarding")
      } else if (isLoggedIn && setupDone) {
        setScreen("home")
      } else if (isLoggedIn && !setupDone) {
        setScreen("pregnancy-setup")
      } else {
        setScreen("auth")
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [isFirstLaunch, isLoggedIn, setupDone])

  // Show bottom tab only after home is reached (hide on weekly-report and notifications)
  const showBottomTab = ["home", "record", "schedule", "community", "mypage"].includes(screen)

  // Handle auth (mock)
  const handleAuth = (returning: boolean) => {
    setIsLoggedIn(true)
    setIsFirstLaunch(false)
    if (returning) {
      setSetupDone(true)
      setScreen("home")
    } else {
      setScreen("pregnancy-setup")
    }
  }

  // Handle pregnancy type selection
  const handlePregnancyTypeConfirm = () => {
    if (pregnancyType === "single") {
      setChildren([{ id: "1", nickname: "미정", order: "첫째", dueDate: new Date("2025-08-20") }])
      setSetupStep(2)
    } else if (pregnancyType === "multiple") {
      setShowMultipleInfo(true)
    }
  }

  // Create multiple children
  const createMultipleChildren = () => {
    const orders = ["첫째", "둘째", "셋째", "넷째", "다섯째"]
    const newChildren: Child[] = []
    for (let i = 0; i < multipleCount; i++) {
      newChildren.push({
        id: (i + 1).toString(),
        nickname: "미정",
        order: orders[i] || `${i + 1}째`,
        dueDate: new Date("2025-08-20")
      })
    }
    setChildren(newChildren)
    setShowMultipleInfo(false)
    setSetupStep(2)
  }

  // Handle pregnancy calculation
  const handleCalculate = () => {
    const date = new Date(selectedDate)
    if (calcMethod === "lmp") {
      date.setDate(date.getDate() + 280)
    }
    setDueDate(date)
    // Update all children due dates
    setChildren(children.map(c => ({ ...c, dueDate: date })))
    setShowResult(true)
  }

  // Handle record save
  const handleSaveRecord = () => {
    const dateToSave = editingRecordDate || new Date().toISOString().split("T")[0]
    const newRecord: DailyRecord = {
      date: dateToSave,
      moods: selectedMoods,
      symptoms: [...selectedPresets, ...customSymptoms], // combine preset + custom
      weight: parseFloat(weight),
      water: parseFloat(water),
      sleep: parseFloat(sleep),
      memo,
    }
    setRecords([...records.filter((r) => r.date !== dateToSave), newRecord])
    // Reset form
    setSelectedMoods([])
    setSelectedPresets([])
    setMemo("")
    setEditingRecordDate(null)
    setRecordTab("history")
  }

  // Handle record edit
  const handleEditRecord = (record: DailyRecord) => {
    setEditingRecordDate(record.date)
    setSelectedMoods(record.moods)
    // Split symptoms into presets vs custom
    const presets = record.symptoms.filter(s => defaultSymptoms.includes(s))
    const custom = record.symptoms.filter(s => !defaultSymptoms.includes(s))
    setSelectedPresets(presets)
    setCustomSymptoms(custom)
    setWeight(record.weight.toString())
    setWater(record.water.toString())
    setSleep(record.sleep.toString())
    setMemo(record.memo)
    setRecordTab("today")
  }

  // Handle record delete
  const handleDeleteRecord = () => {
    if (deleteTargetDate) {
      setRecords(records.filter(r => r.date !== deleteTargetDate))
      setDeleteTargetDate(null)
      setShowDeleteConfirm(false)
    }
  }

  // Handle event save
  const handleSaveEvent = () => {
    if (!newEventTitle.trim()) return
    const newEvent: ScheduleEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: newEventTitle,
      date: newEventDate || scheduleSelectedDate.toISOString().split("T")[0],
      time: newEventTime,
      repeat: newEventRepeat,
      completed: false,
    }
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? newEvent : e)))
    } else {
      setEvents([...events, newEvent])
    }
    resetEventForm()
  }

  const resetEventForm = () => {
    setShowEventModal(false)
    setEditingEvent(null)
    setNewEventTitle("")
    setNewEventDate("")
    setNewEventTime("10:00")
    setNewEventRepeat("안 함")
  }

  // Get record for specific date
  const getRecordForDate = (date: Date): DailyRecord | null => {
    const dateStr = date.toISOString().split("T")[0]
    return records.find((r) => r.date === dateStr) || null
  }

  // Get events for specific date
  const getEventsForDate = (date: Date): ScheduleEvent[] => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((e) => e.date === dateStr)
  }

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = mockPosts
    if (communityCategory !== "전체" && communityCategory !== "인기") {
      filtered = filtered.filter((p) => p.category === communityCategory)
    }
    if (communityCategory === "인기") {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes)
    } else if (communitySort === "popular") {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes)
    }
    // Apply search filter
    if (communitySearchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(communitySearchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(communitySearchQuery.toLowerCase())
      )
    }
    return filtered
  }, [communityCategory, communitySort, communitySearchQuery])

  // Filter events by search
  const filteredEvents = useMemo(() => {
    if (!scheduleSearchQuery) return events
    return events.filter(e => 
      e.title.toLowerCase().includes(scheduleSearchQuery.toLowerCase())
    )
  }, [events, scheduleSearchQuery])

  // Add custom symptom (immediately added as a visible custom chip)
  const addCustomSymptom = () => {
    if (customSymptomInput.trim() && !defaultSymptoms.includes(customSymptomInput.trim()) && !customSymptoms.includes(customSymptomInput.trim())) {
      const newSymptom = customSymptomInput.trim()
      setCustomSymptoms([...customSymptoms, newSymptom])
      setCustomSymptomInput("")
      setShowCustomInput(false)
    }
  }

  // Delete custom symptom (removes entirely)
  const deleteCustomSymptom = (symptom: string) => {
    setCustomSymptoms(customSymptoms.filter(s => s !== symptom))
  }

  // Toggle preset symptom selection
  const togglePreset = (symptom: string) => {
    setSelectedPresets(
      selectedPresets.includes(symptom)
        ? selectedPresets.filter(s => s !== symptom)
        : [...selectedPresets, symptom]
    )
  }

  // Handle child edit
  const openChildEdit = (child: Child) => {
    setEditingChildId(child.id)
    setEditChildNickname(child.nickname)
    setEditChildOrder(child.order)
    setEditChildDueDate(child.dueDate.toISOString().split("T")[0])
    setApplyToAll(false)
    setShowChildEditSheet(true)
  }

  // Save child edit
  const saveChildEdit = () => {
    if (editingChildId) {
      const newDueDate = new Date(editChildDueDate)
      setChildren(children.map(c => {
        if (c.id === editingChildId) {
          return { ...c, nickname: editChildNickname, order: editChildOrder, dueDate: newDueDate }
        }
        if (applyToAll && children.length > 1) {
          return { ...c, dueDate: newDueDate }
        }
        return c
      }))
      // Update main due date if first child
      if (editingChildId === "1" || applyToAll) {
        setDueDate(newDueDate)
      }
      setShowChildEditSheet(false)
    }
  }

  // Delete child
  const deleteChild = () => {
    if (children.length <= 1) {
      setShowCannotDeleteAlert(true)
      return
    }
    setChildren(children.filter(c => c.id !== editingChildId))
    setShowChildEditSheet(false)
  }

  // Add new child
  const addNewChild = () => {
    const orders = ["첫째", "둘째", "셋째", "넷째", "다섯째"]
    const newChild: Child = {
      id: Date.now().toString(),
      nickname: "미정",
      order: orders[children.length] || `${children.length + 1}째`,
      dueDate: dueDate
    }
    setChildren([...children, newChild])
  }

  // Render Splash Screen
  const renderSplash = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#a3daff]/30 to-background flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="text-6xl mb-4">👶</div>
      <h1 className="text-3xl font-bold text-foreground mb-2 break-words">마마로그</h1>
      <p className="text-muted-foreground text-sm break-words">임신 기간을 함께 기록하고 돌봐요</p>
    </div>
  )

  // Render Onboarding
  const renderOnboarding = () => {
    const slides = [
      {
        icon: "📅",
        title: "오늘 몸이 왜 이런지, 정확히 알고 싶었죠?",
        sub: "임신 주차에 맞는 정보를 매일 확인해요",
      },
      {
        icon: "📔",
        title: "불안한 마음, 기록하면 조금 가벼워져요",
        sub: "건강, 증상, 감정, 일정을 한곳에 기록해요",
      },
      {
        icon: "👥",
        title: "같은 주차 엄마들이 기다리고 있어요",
        sub: "비슷한 고민을 함께 나누며 공유해요",
      },
    ]

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {onboardingIndex < 2 && (
          <button onClick={() => setScreen("auth")} className="absolute top-4 right-4 text-muted-foreground text-sm">
            건너뛰기
          </button>
        )}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-7xl mb-8">{slides[onboardingIndex].icon}</div>
          <h2 className="text-xl font-bold text-foreground text-center mb-3 text-balance break-words">{slides[onboardingIndex].title}</h2>
          <p className="text-muted-foreground text-center text-sm break-words">{slides[onboardingIndex].sub}</p>
        </div>
        <div className="px-6 pb-8">
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === onboardingIndex ? "bg-[#a3daff]" : "bg-border"}`} />
            ))}
          </div>
          {onboardingIndex < 2 ? (
            <button
              onClick={() => setOnboardingIndex(onboardingIndex + 1)}
              className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold"
            >
              다음
            </button>
          ) : (
            <>
              <button onClick={() => setScreen("auth")} className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold mb-3">
                시작하기 →
              </button>
              <button onClick={() => handleAuth(true)} className="w-full text-center text-muted-foreground text-sm">
                이미 계정이 있어요
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Render Auth Selection
  const renderAuth = () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-5xl mb-4">👶</div>
      <p className="text-muted-foreground text-sm mb-8 break-words">SNS 계정으로 간편하게 시작해요</p>

      <div className="w-full space-y-3 mb-8">
        <button
          onClick={() => handleAuth(false)}
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}
        >
          <span>🟡</span> Kakao로 계속하기
        </button>
        <button
          onClick={() => handleAuth(false)}
          className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: "#03C75A" }}
        >
          <span>🟢</span> Naver로 계속하기
        </button>
        <button
          onClick={() => handleAuth(false)}
          className="w-full py-3.5 rounded-xl font-semibold border border-border bg-card text-foreground flex items-center justify-center gap-2"
        >
          <span>⚪</span> Google로 계속하기
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center px-4 break-words">계속 진행 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다</p>
    </div>
  )

  // Render Pregnancy Setup
  const renderPregnancySetup = () => (
    <div className="min-h-screen bg-background px-6 py-8">
      {setupStep === 1 ? (
        <>
          <h1 className="text-xl font-bold text-foreground mb-6 break-words">임신 유형을 선택해주세요</h1>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setPregnancyType("single")}
              className={`w-full p-6 rounded-2xl border text-center transition-colors ${
                pregnancyType === "single" ? "border-[#a3daff] bg-[#a3daff]/10" : "border-border bg-card"
              }`}
            >
              <div className="text-5xl mb-2">👶</div>
              <span className="font-semibold text-foreground">단태아</span>
            </button>
            <button
              onClick={() => setPregnancyType("multiple")}
              className={`w-full p-6 rounded-2xl border text-center transition-colors ${
                pregnancyType === "multiple" ? "border-[#a3daff] bg-[#a3daff]/10" : "border-border bg-card"
              }`}
            >
              <div className="text-5xl mb-2">👶👶</div>
              <span className="font-semibold text-foreground">다태아</span>
            </button>
          </div>

          {pregnancyType === "multiple" && (
            <div className="mb-6 animate-in fade-in">
              <p className="text-sm text-muted-foreground mb-3">몇 명인가요?</p>
              <div className="flex gap-2">
                {[2, 3, 4].map(count => (
                  <button
                    key={count}
                    onClick={() => setMultipleCount(count)}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                      multipleCount === count ? "bg-[#a3daff] text-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count === 4 ? "4명+" : `${count}명`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handlePregnancyTypeConfirm}
            disabled={!pregnancyType}
            className={`w-full py-3 rounded-xl font-semibold ${pregnancyType ? "bg-[#a3daff] text-foreground" : "bg-muted text-muted-foreground"}`}
          >
            확인
          </button>

          {/* Multiple pregnancy info modal */}
          {showMultipleInfo && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6" onClick={() => setShowMultipleInfo(false)}>
              <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-foreground text-lg mb-3 break-words">다태아 임신 안내</h3>
                <p className="text-sm text-muted-foreground mb-4 break-words">
                  {multipleCount}명의 아기 정보를 각각 관리할 수 있어요. 태명과 출산 예정일을 개별로 설정하거나 일괄 적용할 수 있습니다.
                </p>
                <button 
                  onClick={createMultipleChildren}
                  className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-foreground mb-6 break-words">현재 주차를 계산할게요</h1>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setCalcMethod("lmp")}
              className={`w-full p-4 rounded-2xl border text-left transition-colors ${
                calcMethod === "lmp" ? "border-[#a3daff] bg-[#a3daff]/10" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${calcMethod === "lmp" ? "border-[#a3daff]" : "border-muted-foreground"}`}>
                  {calcMethod === "lmp" && <div className="w-2.5 h-2.5 rounded-full bg-[#a3daff]" />}
                </div>
                <span className="text-foreground break-words">마지막 생리 시작일로 계산</span>
              </div>
            </button>
            <button
              onClick={() => setCalcMethod("dueDate")}
              className={`w-full p-4 rounded-2xl border text-left transition-colors ${
                calcMethod === "dueDate" ? "border-[#a3daff] bg-[#a3daff]/10" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${calcMethod === "dueDate" ? "border-[#a3daff]" : "border-muted-foreground"}`}>
                  {calcMethod === "dueDate" && <div className="w-2.5 h-2.5 rounded-full bg-[#a3daff]" />}
                </div>
                <span className="text-foreground break-words">출산 예정일로 계산</span>
              </div>
            </button>
          </div>

          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-4 rounded-2xl border border-border bg-card text-foreground"
            />
          </div>

          <button onClick={handleCalculate} className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold mb-8">
            계산하기
          </button>

          {showResult && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-sm">계산 결과</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="bg-secondary/30 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span>📅</span>
                  <span className="font-semibold text-foreground break-words">
                    현재 임신 {pregnancyInfo.weeks}주 {pregnancyInfo.days}일차
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🍼</span>
                  <span className="text-foreground break-words">출산 예정일 {formatDate(dueDate)}</span>
                </div>
              </div>

              <p className="text-center text-muted-foreground mb-4 break-words">이 정보가 맞나요?</p>

              <button
                onClick={() => {
                  setSetupDone(true)
                  setScreen("notification-setup")
                }}
                className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold mb-3"
              >
                맞아요, 시작!
              </button>
              <button onClick={() => setShowResult(false)} className="w-full text-center text-muted-foreground text-sm">
                다시 계산하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  // Render Notification Setup
  const renderNotificationSetup = () => (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-xl font-bold text-foreground mb-2 break-words">알림을 설정해요</h1>
      <p className="text-muted-foreground text-sm mb-8 break-words">놓치는 일정 없이 함께할게요</p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
          <span className="text-foreground break-words">일정 알림</span>
          <button
            onClick={() => setScheduleNotif(!scheduleNotif)}
            className={`w-12 h-7 rounded-full transition-colors relative ${scheduleNotif ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${scheduleNotif ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
          <span className="text-foreground break-words">���글·공감 알림</span>
          <button
            onClick={() => setCommentNotif(!commentNotif)}
            className={`w-12 h-7 rounded-full transition-colors relative ${commentNotif ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${commentNotif ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
          <span className="text-foreground break-words">알림 받을 시간</span>
          <input
            type="time"
            value={notifTime}
            onChange={(e) => setNotifTime(e.target.value)}
            className="text-muted-foreground bg-transparent"
          />
        </div>
      </div>

      <button onClick={() => setScreen("home")} className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold mb-3">
        완료
      </button>
      <button onClick={() => setScreen("home")} className="w-full text-center text-muted-foreground text-sm">
        나중에 설정하기
      </button>
    </div>
  )

  // Render Home
  const renderHome = () => (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-gradient-to-br from-[#a3daff]/40 to-[#a3daff]/10 rounded-3xl p-5 relative overflow-hidden">
          {/* Speech bubble - positioned above baby */}
          <div className="flex justify-center mb-3">
            <div className="bg-white/90 rounded-2xl px-4 py-2 text-sm text-foreground shadow-sm relative break-words">
              {`"엄마, 저 지금 복숭아만해요"`}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/90" />
            </div>
          </div>
          
          {/* Baby illustration - centered and larger */}
          <div className="flex justify-center mb-4">
            <div className="text-[120px] leading-none">👶</div>
          </div>
          
          {/* Week info text */}
          <h2 className="text-lg font-bold text-foreground text-center mb-4 break-words">
            아이와 함께한 지 {pregnancyInfo.weeks}주 {pregnancyInfo.days}일차
          </h2>
          
          {/* D-Day badge and progress bar */}
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">D-{pregnancyInfo.daysUntilDue}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>0주</span>
                <span>40주</span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-[#a3daff] rounded-full transition-all" style={{ width: `${(pregnancyInfo.weeks / 40) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen("weekly-info")}
            className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 shadow-sm"
          >
            <span className="text-2xl">📖</span>
            <span className="font-semibold text-foreground break-words">이번 주 정보</span>
          </button>
          <button
            onClick={() => setScreen("weekly-report")}
            className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 shadow-sm"
          >
            <span className="text-2xl">📊</span>
            <span className="font-semibold text-foreground break-words">주간 리포트</span>
          </button>
        </div>
      </div>

      {/* Community Feed */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground break-words">비슷한 주차 엄마들의 이야기</h3>
          <button onClick={() => setScreen("community")} className="text-[#a3daff] text-sm font-medium">
            더 보기 →
          </button>
        </div>
        <div className="space-y-3">
          {mockPosts.slice(0, 5).map((post) => (
            <button
              key={post.id}
              onClick={() => {
                setSelectedPost(post)
                setScreen("post-detail")
              }}
              className="w-full bg-card rounded-2xl p-4 border border-border text-left shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{post.category}</span>
                <span className="text-xs text-[#a3daff] bg-[#a3daff]/20 px-2 py-0.5 rounded font-medium">{post.week}주차</span>
              </div>
              <p className="font-medium text-foreground truncate break-words">{post.title}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {post.comments.length}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views}
                </span>
                <span>· {post.createdAt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Render Record
  const renderRecord = () => {
    const selectedRecord = getRecordForDate(historyDate)

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Tab Bar */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setRecordTab("today")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${recordTab === "today" ? "text-[#a3daff] border-b-2 border-[#a3daff]" : "text-muted-foreground"}`}
          >
            오늘 기록
          </button>
          <button
            onClick={() => setRecordTab("history")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${recordTab === "history" ? "text-[#a3daff] border-b-2 border-[#a3daff]" : "text-muted-foreground"}`}
          >
            히스토리
          </button>
        </div>

        {recordTab === "today" ? (
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold text-foreground mb-2 break-words">
              {editingRecordDate ? `${editingRecordDate} 기록 수정` : "엄마의 오늘이 궁금해요!"}
            </h2>
            <div className="bg-muted inline-block px-3 py-1 rounded-full text-sm text-muted-foreground mb-6">
              {editingRecordDate || formatDate(new Date())}
            </div>

            {/* Mood Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 break-words">오늘 기분</h3>
              <div className="grid grid-cols-3 gap-2">
                {moods.map((mood, i) => (
                  <button
                    key={mood}
                    onClick={() =>
                      setSelectedMoods(selectedMoods.includes(mood) ? selectedMoods.filter((m) => m !== mood) : [...selectedMoods, mood])
                    }
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedMoods.includes(mood) ? "border-[#a3daff] bg-[#a3daff]/10" : "border-border bg-card"
                    }`}
                  >
                    <span className="text-2xl">{mood}</span>
                    <p className="text-xs text-muted-foreground mt-1">{moodLabels[i]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 break-words">증상</h3>
              <div className="flex flex-wrap gap-2">
                {/* Preset symptoms - toggle on/off, NO X button */}
                {defaultSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => togglePreset(symptom)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedPresets.includes(symptom) 
                        ? "bg-[#a3daff] text-white" 
                        : "border border-[#a3daff] text-[#3D3D3D] bg-white"
                    }`}
                  >
                    #{symptom}
                  </button>
                ))}
                {/* Custom symptoms - always selected, show X badge to delete */}
                {customSymptoms.map((symptom) => (
                  <div key={symptom} className="relative">
                    <span className="px-3 py-1 rounded-full text-sm bg-[#a3daff] text-white inline-block">
                      #{symptom}
                    </span>
                    <button 
                      onClick={() => deleteCustomSymptom(symptom)}
                      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {/* Add custom symptom input */}
                {showCustomInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customSymptomInput}
                      onChange={(e) => setCustomSymptomInput(e.target.value)}
                      placeholder="증상 입력"
                      className="px-3 py-1 rounded-full text-sm border border-[#a3daff] bg-white text-[#3D3D3D] w-24"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCustomSymptom()
                      }}
                    />
                    <button onClick={addCustomSymptom} className="text-[#a3daff] text-sm font-medium">완료</button>
                    <button onClick={() => { setShowCustomInput(false); setCustomSymptomInput("") }} className="text-muted-foreground text-sm">취소</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowCustomInput(true)}
                    className="px-3 py-1 rounded-full text-sm border border-[#a3daff] text-[#3D3D3D] bg-white"
                  >
                    + 직접입력
                  </button>
                )}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
                <span>⚖️</span>
                <span className="flex-1 text-foreground break-words">체중</span>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-20 text-right bg-transparent text-foreground"
                  step="0.1"
                />
                <span className="text-muted-foreground">kg</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
                <span>💧</span>
                <span className="flex-1 text-foreground break-words">수분섭취</span>
                <input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-20 text-right bg-transparent text-foreground"
                  step="0.1"
                />
                <span className="text-muted-foreground">L</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
                <span>🌙</span>
                <span className="flex-1 text-foreground break-words">수면시간</span>
                <input
                  type="number"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  className="w-20 text-right bg-transparent text-foreground"
                  step="0.5"
                />
                <span className="text-muted-foreground">시간</span>
              </div>
            </div>

            {/* Memo */}
            <div className="mb-6">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="오늘 있었던 일을 기록해요"
                className="w-full p-4 bg-card rounded-2xl border border-border text-foreground placeholder:text-muted-foreground resize-none h-24 break-words"
              />
            </div>

            <button onClick={handleSaveRecord} className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold">
              {editingRecordDate ? "수정 완료" : "저장하기"}
            </button>
            {editingRecordDate && (
              <button 
                onClick={() => {
                  setEditingRecordDate(null)
                  setSelectedMoods([])
                  setSelectedPresets([])
                  setCustomSymptoms([])
                  setMemo("")
                }}
                className="w-full py-3 text-muted-foreground text-sm mt-2"
              >
                취소
              </button>
            )}
          </div>
        ) : (
          <div className="px-4 py-6">
            {/* Week Strip Calendar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setHistoryMonth(new Date(historyMonth.getFullYear(), historyMonth.getMonth() - 1))}>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="font-semibold text-foreground"
                >
                  {historyMonth.getFullYear()}년 {historyMonth.getMonth() + 1}월
                </button>
                <button onClick={() => setHistoryMonth(new Date(historyMonth.getFullYear(), historyMonth.getMonth() + 1))}>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: getFirstDayOfMonth(historyMonth.getFullYear(), historyMonth.getMonth()) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: getDaysInMonth(historyMonth.getFullYear(), historyMonth.getMonth()) }).map((_, i) => {
                    const date = new Date(historyMonth.getFullYear(), historyMonth.getMonth(), i + 1)
                    const dateStr = date.toISOString().split("T")[0]
                    const hasRecord = records.some((r) => r.date === dateStr)
                    const isSelected = historyDate.toISOString().split("T")[0] === dateStr
                    const isToday = new Date().toISOString().split("T")[0] === dateStr

                    return (
                      <button
                        key={i}
                        onClick={() => setHistoryDate(date)}
                        className={`relative py-2 rounded-full transition-colors ${
                          isSelected ? "bg-[#a3daff] text-foreground" : isToday ? "ring-1 ring-[#a3daff] text-foreground" : "text-foreground"
                        }`}
                      >
                        {i + 1}
                        {hasRecord && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a3daff]" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Selected Date Record */}
            <div className="bg-card rounded-2xl p-4 border border-border animate-in slide-in-from-bottom-4">
              <h3 className="font-semibold text-foreground mb-4 break-words">
                {historyDate.getMonth() + 1}월 {historyDate.getDate()}일{" "}
                {["일", "월", "화", "수", "목", "금", "토"][historyDate.getDay()]}요일
              </h3>
              {selectedRecord ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">기분:</span>
                    <div className="flex gap-1">{selectedRecord.moods.map((m) => <span key={m}>{m}</span>)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">체중:</span>
                    <span className="text-foreground">{selectedRecord.weight}kg</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedRecord.symptoms.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        #{s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>💧 {selectedRecord.water}L</span>
                    <span>🌙 {selectedRecord.sleep}시간</span>
                  </div>
                  {selectedRecord.memo && <p className="text-sm text-foreground bg-muted p-3 rounded-xl break-words">{selectedRecord.memo}</p>}
                  
                  {/* Edit/Delete buttons */}
                  <div className="flex gap-2 pt-3 border-t border-border mt-3">
                    <button 
                      onClick={() => handleEditRecord(selectedRecord)}
                      className="flex-1 py-2 flex items-center justify-center gap-2 text-sm text-foreground bg-muted rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" /> 수정
                    </button>
                    <button 
                      onClick={() => {
                        setDeleteTargetDate(selectedRecord.date)
                        setShowDeleteConfirm(true)
                      }}
                      className="flex-1 py-2 flex items-center justify-center gap-2 text-sm text-destructive bg-muted rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" /> 삭제
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4 break-words">이날 기록이 없어요</p>
                  <button
                    onClick={() => setRecordTab("today")}
                    className="px-4 py-2 bg-[#a3daff] text-foreground rounded-xl text-sm font-medium"
                  >
                    지금 기록하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-foreground text-lg mb-3 break-words">기록을 삭제하시겠어요?</h3>
              <p className="text-sm text-muted-foreground mb-4 break-words">삭제된 기록은 복구할 수 없습니다.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium"
                >
                  아니오
                </button>
                <button 
                  onClick={handleDeleteRecord}
                  className="flex-1 py-3 bg-destructive text-white rounded-xl font-medium"
                >
                  네
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Weekly Report
  const renderWeeklyReport = () => {
    const weekDays = ["월", "화", "수", "목", "금", "토", "일"]
    const moodScores = [4, 3, 5, 2, 3, 4, 5]
    const weights = [62.0, 62.1, 62.2, 62.3, 62.3, 62.2, 62.4]
    const symptomData = [
      { name: "두통", count: 4 },
      { name: "부종", count: 3 },
      { name: "피로", count: 2 },
    ]
    const achievements = [true, true, true, false, true, true, false]

    return (
      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <button onClick={() => setScreen("home")}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">주간 리포트</h1>
          <button 
            onClick={() => setShowReportWeekPicker(true)}
            className="flex items-center gap-1 text-sm font-medium text-[#a3daff]"
          >
            {reportWeek}주차 <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm mb-6 break-words">이번 주 엄마의 변화를 정리했어요</p>

          {/* Memoized Report Cards */}
          <MoodChartCard moodScores={moodScores} weekDays={weekDays} />
          <WeightChartCard weights={weights} weekDays={weekDays} />
          <SymptomsCard symptoms={symptomData} />
          <AchievementCard achievements={achievements} />
        </div>

        {/* Week Picker Bottom Sheet */}
        {showReportWeekPicker && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowReportWeekPicker(false)}>
            <div 
              className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 shrink-0">
                <h3 className="font-semibold text-foreground">주차 선택</h3>
              </div>
              
              {/* Body - scrollable */}
              <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                {[
                  { label: "1~10주차", weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                  { label: "11~20주차", weeks: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
                  { label: "21~30주차", weeks: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
                  { label: "31~40주차", weeks: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
                ].map((group) => (
                  <div key={group.label} className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">{group.label}</p>
                    <div className="grid grid-cols-5 gap-2">
                      {group.weeks.map((week) => (
                        <button
                          key={week}
                          onClick={() => {
                            setReportWeek(week)
                            setShowReportWeekPicker(false)
                          }}
                          className={`py-2 rounded-lg text-sm relative ${
                            reportWeek === week
                              ? "bg-[#a3daff] text-foreground"
                              : pregnancyInfo.weeks === week
                                ? "bg-[#a3daff]/20 text-[#a3daff]"
                                : "bg-muted text-foreground"
                          }`}
                        >
                          {week}
                          {pregnancyInfo.weeks === week && (
                            <span className="absolute -top-1 -right-1 text-[10px] bg-[#a3daff] text-foreground px-1 rounded">현재</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Schedule
  const renderSchedule = () => {
    const selectedDateEvents = showScheduleSearch 
      ? filteredEvents.filter(e => e.date === scheduleSelectedDate.toISOString().split("T")[0])
      : getEventsForDate(scheduleSelectedDate)

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h1 className="text-lg font-bold text-foreground">일정</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setNewEventDate(scheduleSelectedDate.toISOString().split("T")[0])
                setShowEventModal(true)
              }}
              className="p-2"
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={() => setShowScheduleSearch(!showScheduleSearch)}
              className="p-2"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showScheduleSearch && (
          <div className="px-4 py-3 border-b border-border animate-in slide-in-from-top">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={scheduleSearchQuery}
                onChange={(e) => setScheduleSearchQuery(e.target.value)}
                placeholder="일정 검색..."
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-border bg-card text-foreground text-sm"
                autoFocus
              />
              <button 
                onClick={() => {
                  setShowScheduleSearch(false)
                  setScheduleSearchQuery("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        <div className="px-4 py-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScheduleMonth(new Date(scheduleMonth.getFullYear(), scheduleMonth.getMonth() - 1))}>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="font-semibold text-foreground">
              {scheduleMonth.getFullYear()}년 {scheduleMonth.getMonth() + 1}월
            </span>
            <button onClick={() => setScheduleMonth(new Date(scheduleMonth.getFullYear(), scheduleMonth.getMonth() + 1))}>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-card rounded-2xl p-4 border border-border mb-4">
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: getFirstDayOfMonth(scheduleMonth.getFullYear(), scheduleMonth.getMonth()) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(scheduleMonth.getFullYear(), scheduleMonth.getMonth()) }).map((_, i) => {
                const date = new Date(scheduleMonth.getFullYear(), scheduleMonth.getMonth(), i + 1)
                const dateStr = date.toISOString().split("T")[0]
                const hasEvent = events.some((e) => e.date === dateStr)
                const isSelected = scheduleSelectedDate.toISOString().split("T")[0] === dateStr
                const isToday = new Date().toISOString().split("T")[0] === dateStr

                return (
                  <button
                    key={i}
                    onClick={() => setScheduleSelectedDate(date)}
                    className={`relative py-2 rounded-full transition-colors ${
                      isSelected ? "bg-[#a3daff] text-foreground" : isToday ? "ring-1 ring-[#a3daff] text-foreground" : "text-foreground"
                    }`}
                  >
                    {i + 1}
                    {hasEvent && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a3daff]" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="bg-secondary/30 rounded-2xl p-4 mb-4">
            <p className="text-foreground text-sm mb-2 break-words">💊 16주차 기형아 검사 권장 시기예요</p>
            <button
              onClick={() => {
                setNewEventTitle("기형아 검사")
                setShowEventModal(true)
              }}
              className="text-sm font-medium text-[#a3daff]"
            >
              일정에 추가하기
            </button>
          </div>

          {/* Date Row with Add Button - shown when events exist */}
          {selectedDateEvents.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground break-words">
                {scheduleSelectedDate.getMonth() + 1}월 {scheduleSelectedDate.getDate()}일{" "}
                {["일", "월", "화", "수", "목", "금", "토"][scheduleSelectedDate.getDay()]}요일
              </span>
              <button
                onClick={() => {
                  setNewEventDate(scheduleSelectedDate.toISOString().split("T")[0])
                  setShowEventModal(true)
                }}
                className="px-3 py-1 rounded-lg border border-[#a3daff] text-[#a3daff] text-sm font-medium"
              >
                + 일정 추가
              </button>
            </div>
          )}

          {/* Selected Date Events */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <button
                      onClick={() => setEvents(events.map((e) => (e.id === event.id ? { ...e, completed: !e.completed } : e)))}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        event.completed ? "bg-[#a3daff] border-[#a3daff]" : "border-muted-foreground"
                      }`}
                    >
                      {event.completed && <Check className="w-3 h-3 text-foreground" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium break-words ${event.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.time} {event.repeat !== "안 함" && `· ${event.repeat}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingEvent(event)
                        setNewEventTitle(event.title)
                        setNewEventDate(event.date)
                        setNewEventTime(event.time)
                        setNewEventRepeat(event.repeat)
                        setShowEventModal(true)
                      }}
                    >
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => setEvents(events.filter((e) => e.id !== event.id))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <h3 className="font-semibold text-foreground mb-4 break-words">
                  {scheduleSelectedDate.getMonth() + 1}월 {scheduleSelectedDate.getDate()}일{" "}
                  {["일", "월", "화", "수", "목", "금", "토"][scheduleSelectedDate.getDay()]}요일
                </h3>
                <p className="text-muted-foreground mb-4 break-words">일정이 없어요</p>
                <button
                  onClick={() => {
                    setNewEventDate(scheduleSelectedDate.toISOString().split("T")[0])
                    setShowEventModal(true)
                  }}
                  className="px-4 py-2 bg-[#a3daff] text-foreground rounded-xl text-sm font-medium"
                >
                  + 일정 추가
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => resetEventForm()}>
            <div 
              className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                <button onClick={resetEventForm} className="text-muted-foreground">
                  취소
                </button>
                <h3 className="font-semibold text-foreground">{editingEvent ? "일정 수정" : "일정 추가"}</h3>
                <button onClick={handleSaveEvent} className="text-[#a3daff] font-semibold">
                  저장
                </button>
              </div>
              
              {/* Body - scrollable */}
              <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="제목"
                    className="w-full p-4 rounded-xl border border-border bg-background text-foreground"
                  />
                  <input
                    type="date"
                    value={newEventDate || scheduleSelectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-4 rounded-xl border border-border bg-background text-foreground"
                  />
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full p-4 rounded-xl border border-border bg-background text-foreground"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">반복</p>
                    <div className="flex flex-wrap gap-2">
                      {repeatOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setNewEventRepeat(option)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            newEventRepeat === option ? "bg-[#a3daff] text-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <span className="text-foreground">알림</span>
                    <button
                      onClick={() => setNewEventNotif(!newEventNotif)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${newEventNotif ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          newEventNotif ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Community
  const renderCommunity = () => (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">커뮤니티</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setScreen("notifications")} 
            className="p-2 relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {notifications.some(n => !n.read) && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setShowCommunitySearch(!showCommunitySearch)}
            className="p-2"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showCommunitySearch && (
        <div className="px-4 py-3 border-b border-border animate-in slide-in-from-top">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={communitySearchQuery}
              onChange={(e) => setCommunitySearchQuery(e.target.value)}
              placeholder="게시글 검색..."
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-border bg-card text-foreground text-sm"
              autoFocus
            />
            <button 
              onClick={() => {
                setShowCommunitySearch(false)
                setCommunitySearchQuery("")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCommunityCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                communityCategory === cat ? "bg-[#a3daff] text-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Toggle - hide when "인기" tab is selected */}
        {communityCategory !== "인기" && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCommunitySort("latest")}
              className={`text-sm ${communitySort === "latest" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              최신순
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => setCommunitySort("popular")}
              className={`text-sm ${communitySort === "popular" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              인기순
            </button>
          </div>
        )}

        {/* Post List */}
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => {
                setSelectedPost(post)
                setScreen("post-detail")
              }}
              className="w-full bg-card rounded-2xl p-4 border border-border text-left shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{post.category}</span>
                <span className="font-medium text-foreground flex-1 truncate break-words">{post.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span>{post.author}</span>
                <span className="bg-[#a3daff]/20 text-[#a3daff] px-2 py-0.5 rounded">{post.week}주차</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {post.comments.length}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views}
                </span>
                <span>· {post.createdAt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setScreen("post-write")}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#a3daff] rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Edit3 className="w-6 h-6 text-foreground" />
      </button>
    </div>
  )

  // Render Notifications Screen
  const renderNotifications = () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-border">
        <button onClick={() => setScreen("community")}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground ml-4">알림</h1>
      </div>

      <div className="px-4 py-4">
        <div className="space-y-3">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))
              }}
              className="w-full p-4 bg-card rounded-2xl border border-border text-left"
            >
              <p className={`text-sm break-words ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                {notif.content}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{notif.createdAt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Render Post Detail
  const renderPostDetail = () => {
    if (!selectedPost) return null

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <button onClick={() => setScreen("community")}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button onClick={() => setShowPostMenu(true)}>
            <MoreHorizontal className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Post Content */}
          <div className="mb-6">
            <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{selectedPost.category}</span>
            <h1 className="text-xl font-bold text-foreground mt-2 mb-3 break-words">{selectedPost.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{selectedPost.author}</span>
              <span className="bg-[#a3daff]/20 text-[#a3daff] px-2 py-0.5 rounded text-xs">{selectedPost.week}주차 맘</span>
              <span>· {selectedPost.createdAt}</span>
              <span>· 조회 {selectedPost.views}</span>
            </div>
            <p className="text-foreground whitespace-pre-line leading-relaxed break-words">{selectedPost.content}</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between py-4 border-t border-b border-border">
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 ${liked ? "text-destructive" : "text-muted-foreground"}`}>
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span>공감 {selectedPost.likes + (liked ? 1 : 0)}</span>
            </button>
            <button onClick={() => setSaved(!saved)} className={`flex items-center gap-2 ${saved ? "text-[#a3daff]" : "text-muted-foreground"}`}>
              <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
              <span>저장</span>
            </button>
          </div>

          {/* Comments */}
          <div className="py-4">
            <h3 className="font-semibold text-foreground mb-4">댓글 {selectedPost.comments.length}</h3>
            <div className="space-y-4">
              {selectedPost.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {comment.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-foreground break-words">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-card border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="닉네임으로 댓글 달기..."
              className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-foreground text-sm"
            />
            <button className="p-2 bg-[#a3daff] rounded-full">
              <Send className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Post Menu */}
        {showPostMenu && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowPostMenu(false)}>
            <div 
              className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 shrink-0">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              
              {/* Body */}
              <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                {selectedPost.isOwn ? (
                  <>
                    <button className="w-full p-4 text-left text-foreground flex items-center gap-3 hover:bg-muted rounded-xl">
                      <Edit3 className="w-5 h-5" /> 수정하기
                    </button>
                    <button className="w-full p-4 text-left text-destructive flex items-center gap-3 hover:bg-muted rounded-xl">
                      <Trash2 className="w-5 h-5" /> 삭제하기
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full p-4 text-left text-foreground flex items-center gap-3 hover:bg-muted rounded-xl">
                      <AlertTriangle className="w-5 h-5" /> 신고하기
                    </button>
                    <button className="w-full p-4 text-left text-foreground flex items-center gap-3 hover:bg-muted rounded-xl">
                      <Ban className="w-5 h-5" /> 차단하기
                    </button>
                  </>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-4 border-t border-gray-100 shrink-0">
                <button onClick={() => setShowPostMenu(false)} className="w-full p-3 text-center text-muted-foreground">
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Post Write
  const renderPostWrite = () => (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <button onClick={() => setScreen("community")} className="text-muted-foreground">
          취소
        </button>
        <button
          onClick={() => {
            setScreen("community")
            setPostTitle("")
            setPostContent("")
          }}
          className={`font-semibold ${postTitle.trim() ? "text-[#a3daff]" : "text-muted-foreground"}`}
          disabled={!postTitle.trim()}
        >
          등록
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Category Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.slice(2).map((cat) => (
            <button
              key={cat}
              onClick={() => setPostCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                postCategory === cat ? "bg-[#a3daff] text-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Anonymous Toggle (for certain categories) */}
        {postCategory === "산후조리" && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl mb-4">
            <span className="text-foreground">익명으로 작성</span>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-12 h-7 rounded-full transition-colors relative ${isAnonymous ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${isAnonymous ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          className="w-full p-4 text-lg font-medium bg-transparent text-foreground placeholder:text-muted-foreground border-b border-border mb-4"
        />

        {/* Content Input */}
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value.slice(0, 500))}
          placeholder="내용을 입력해주세요 (최대 500자)"
          className="w-full p-4 bg-transparent text-foreground placeholder:text-muted-foreground resize-none h-64 break-words"
        />

        {/* Photo Notice */}
        {photoCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm">
            <AlertTriangle className="w-4 h-4" />
            얼굴 등 개인정보가 포함되지 않도록 주의해주세요
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-card border-t border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setPhotoCount(Math.min(photoCount + 1, 3))} className="flex items-center gap-2 text-muted-foreground">
            <Camera className="w-5 h-5" />
            <span className="text-sm">사진 추가 ({photoCount}/3)</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground">
              <Smile className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">{postContent.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Render MyPage
  const renderMyPage = () => (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="bg-[#a3daff]/20 px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Avatar with camera badge */}
          <button 
            onClick={() => setShowProfileSheet(true)}
            className="relative mb-3"
          >
            <div className="w-20 h-20 rounded-full bg-[#a3daff] flex items-center justify-center text-3xl font-bold text-foreground overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                nickname[0]
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#a3daff] rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4 text-foreground" />
            </div>
          </button>
          {/* Nickname */}
          <div className="flex items-center gap-2">
            {editingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="text-lg font-bold text-foreground bg-card border border-border rounded-lg px-3 py-1 text-center w-32"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setNickname(nicknameInput)
                    setEditingNickname(false)
                  }}
                  className="px-3 py-1 bg-[#a3daff] text-foreground rounded-lg text-sm font-medium"
                >
                  등록
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-foreground break-words">{nickname}</h2>
                <button 
                  onClick={() => {
                    setNicknameInput(nickname)
                    setEditingNickname(true)
                  }}
                  className="text-sm text-[#a3daff] font-medium"
                >
                  수정
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* 아이 정보 */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted">
            <h3 className="font-semibold text-foreground break-words">아이 정보</h3>
          </div>
          
          {/* Horizontal Swipe Cards */}
          <div className="p-4">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              {children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => openChildEdit(child)}
                  className="w-64 flex-shrink-0 snap-start bg-muted rounded-xl p-4 text-left"
                >
                  <span className="inline-block px-2 py-0.5 bg-[#a3daff]/20 text-[#a3daff] text-xs rounded mb-2">{child.order}</span>
                  <p className="font-semibold text-foreground break-words">{child.nickname}</p>
                  <p className="text-sm text-muted-foreground break-words">{formatDate(child.dueDate)}</p>
                </button>
              ))}
              {/* Add Child Card */}
              <button
                onClick={addNewChild}
                className="w-64 flex-shrink-0 snap-start border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center text-muted-foreground"
              >
                <span className="text-sm">+ 아이 추가하기</span>
              </button>
            </div>
            {/* Pagination dots */}
            {children.length >= 2 && (
              <div className="flex justify-center gap-1 mt-3">
                {children.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full ${i === selectedChildIndex ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`} 
                  />
                ))}
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>

        {/* 앱 설정 */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted">
            <h3 className="font-semibold text-foreground break-words">앱 설정</h3>
          </div>
          <button 
            onClick={() => setShowNotifSettings(!showNotifSettings)}
            className="w-full flex items-center justify-between p-4 border-b border-border"
          >
            <span className="text-foreground break-words">알림 설정</span>
            <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showNotifSettings ? "rotate-90" : ""}`} />
          </button>
          
          {/* Expanded Notification Settings */}
          {showNotifSettings && (
            <div className="p-4 space-y-4 bg-muted/30 animate-in slide-in-from-top-2">
              {/* 방해 금지 시간 */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="font-medium text-foreground mb-1 break-words">방해 금지 시간</p>
                <p className="text-xs text-muted-foreground mb-3 break-words">이 시간에는 모든 알림을 보내지 않아요</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowDndPicker(true)}
                    className="inline-flex items-center justify-center border border-[#a3daff] rounded-lg px-3 py-1.5 text-sm text-[#a3daff] bg-white whitespace-nowrap min-w-[90px]"
                  >
                    {dndStart} ~ {dndEnd}
                  </button>
                </div>
              </div>

              {/* 일정 알림 */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-foreground break-words">일정 알림</span>
                  <button
                    onClick={() => setScheduleNotif(!scheduleNotif)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${scheduleNotif ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        scheduleNotif ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {scheduleNotif && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">알림 시간</span>
                    <button 
                      onClick={() => {
                        setTempNotifTime(notifTime)
                        setShowNotifTimePicker(true)
                      }}
                      className="flex items-center gap-1"
                    >
                      <span className="text-sm text-foreground">
                        {parseInt(notifTime.split(":")[0]) >= 12 ? "오후" : "오전"} {parseInt(notifTime.split(":")[0]) > 12 ? parseInt(notifTime.split(":")[0]) - 12 : parseInt(notifTime.split(":")[0])}:{notifTime.split(":")[1]}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글·공감 알림 */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-foreground break-words">댓글·공감 알림</span>
                  <button
                    onClick={() => setCommentNotif(!commentNotif)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${commentNotif ? "bg-[#a3daff]" : "bg-muted-foreground/30"}`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        commentNotif ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {commentNotif && (
                  <p className="text-xs text-muted-foreground mt-2 break-words">켜면 실시간으로 알림을 받아요</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 계정 */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted">
            <h3 className="font-semibold text-foreground break-words">계정</h3>
          </div>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between p-4 border-b border-border"
          >
            <span className="text-foreground break-words">로그아웃</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full flex items-center justify-between p-4"
          >
            <span className="text-destructive break-words">회원탈퇴</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* 기타 */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted">
            <h3 className="font-semibold text-foreground break-words">기타</h3>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-foreground break-words">버전 정보</span>
            <span className="text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Profile Photo Bottom Sheet */}
      {showProfileSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowProfileSheet(false)}>
          <div 
            className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
              <button className="w-full p-4 text-left text-foreground flex items-center gap-3 hover:bg-muted rounded-xl">
                <Camera className="w-5 h-5" /> 카메라로 촬영
              </button>
              <button className="w-full p-4 text-left text-foreground flex items-center gap-3 hover:bg-muted rounded-xl">
                <span className="text-lg">🖼</span> 앨범에서 선택
              </button>
              {profilePhoto && (
                <button 
                  onClick={() => {
                    setProfilePhoto(null)
                    setShowProfileSheet(false)
                  }}
                  className="w-full p-4 text-left text-destructive flex items-center gap-3 hover:bg-muted rounded-xl"
                >
                  <Trash2 className="w-5 h-5" /> 사진 삭제
                </button>
              )}
            </div>
            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => setShowProfileSheet(false)} 
                className="w-full p-3 text-center text-muted-foreground"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Child Edit Bottom Sheet */}
      {showChildEditSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowChildEditSheet(false)}>
          <div 
            className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
            </div>
            <div className="px-4 pt-2 pb-3 shrink-0">
              <h3 className="font-semibold text-foreground text-center break-words">아이 정보 수정</h3>
            </div>
            
            {/* Body - scrollable */}
            <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">태명</label>
                  <input
                    type="text"
                    value={editChildNickname}
                    onChange={(e) => setEditChildNickname(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
                    placeholder="태명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">순서</label>
                  <input
                    type="text"
                    value={editChildOrder}
                    onChange={(e) => setEditChildOrder(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
                    placeholder="예: 첫째, 둘째"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">출산 예정일</label>
                  <input
                    type="date"
                    value={editChildDueDate}
                    onChange={(e) => setEditChildDueDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
                
                {/* Apply to all checkbox for multiple children */}
                {children.length > 1 && (
                  <label className="flex items-center gap-2 p-3 bg-muted rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAll}
                      onChange={(e) => setApplyToAll(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#a3daff]"
                    />
                    <span className="text-sm text-foreground break-words">모든 아이에게 출산 예정일 적용</span>
                  </label>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-100 shrink-0">
              <div className="flex gap-2">
                <button 
                  onClick={deleteChild}
                  className="flex-1 py-3 bg-muted text-destructive rounded-xl font-medium"
                >
                  삭제
                </button>
                <button 
                  onClick={saveChildEdit}
                  className="flex-1 py-3 bg-[#a3daff] text-foreground rounded-xl font-medium"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cannot Delete Alert */}
      {showCannotDeleteAlert && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6" onClick={() => setShowCannotDeleteAlert(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-foreground text-lg mb-3 break-words">삭제할 수 없어요</h3>
            <p className="text-sm text-muted-foreground mb-4 break-words">최소 1명의 아이 정보가 필요합니다.</p>
            <button 
              onClick={() => setShowCannotDeleteAlert(false)}
              className="w-full py-3 bg-[#a3daff] text-foreground rounded-xl font-semibold"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-foreground text-lg mb-3 break-words">로그아웃 하시겠어요?</h3>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium"
              >
                아니오
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false)
                  setIsLoggedIn(false)
                  setScreen("auth")
                }}
                className="flex-1 py-3 bg-[#a3daff] text-foreground rounded-xl font-medium"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-foreground text-lg mb-3 break-words">정말 탈퇴하시겠어요?</h3>
            <p className="text-sm text-muted-foreground mb-4 break-words">탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium"
              >
                아니오
              </button>
              <button 
                onClick={() => {
                  setShowWithdrawModal(false)
                  setIsLoggedIn(false)
                  setScreen("auth")
                }}
                className="flex-1 py-3 bg-destructive text-white rounded-xl font-medium"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DND Time Picker Bottom Sheet - Drum Roll Style */}
      {showDndPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowDndPicker(false)}>
          <div 
            className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
            style={{ maxHeight: "85vh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-foreground">방해 금지 시간 설정</h3>
              <div className="w-6" />
            </div>
            
            {/* Body - scrollable */}
            <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
              {/* Start Time */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">시작 시간</p>
                <div className="flex text-center text-xs text-muted-foreground mb-1">
                  <div className="flex-1"></div>
                  <div className="flex-1">시</div>
                  <div className="flex-1">분</div>
                </div>
                <div className="relative flex gap-2 h-[180px] overflow-hidden">
                  {/* Center highlight bar */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] bg-[#e8f6ff] rounded-lg pointer-events-none z-10" />
                  
                  {/* AM/PM */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {(["AM", "PM"] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndStartAmPm(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndStartAmPm === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Hour */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndStartHour(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndStartHour === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Minute */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndStartMinute(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndStartMinute === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">종료 시간</p>
                <div className="flex text-center text-xs text-muted-foreground mb-1">
                  <div className="flex-1"></div>
                  <div className="flex-1">시</div>
                  <div className="flex-1">분</div>
                </div>
                <div className="relative flex gap-2 h-[180px] overflow-hidden">
                  {/* Center highlight bar */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] bg-[#e8f6ff] rounded-lg pointer-events-none z-10" />
                  
                  {/* AM/PM */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {(["AM", "PM"] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndEndAmPm(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndEndAmPm === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Hour */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndEndHour(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndEndHour === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Minute */}
                  <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((val) => (
                      <button
                        key={val}
                        onClick={() => setDndEndMinute(val)}
                        className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                          dndEndMinute === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => {
                  // Convert to 24h format
                  let startHour24 = parseInt(dndStartHour)
                  if (dndStartAmPm === "PM" && startHour24 !== 12) startHour24 += 12
                  if (dndStartAmPm === "AM" && startHour24 === 12) startHour24 = 0
                  setDndStart(`${startHour24.toString().padStart(2, "0")}:${dndStartMinute}`)
                  
                  let endHour24 = parseInt(dndEndHour)
                  if (dndEndAmPm === "PM" && endHour24 !== 12) endHour24 += 12
                  if (dndEndAmPm === "AM" && endHour24 === 12) endHour24 = 0
                  setDndEnd(`${endHour24.toString().padStart(2, "0")}:${dndEndMinute}`)
                  
                  setShowDndPicker(false)
                }} 
                className="w-full py-3 bg-[#a3daff] text-white rounded-xl font-medium"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Time Picker Bottom Sheet - Drum Roll Style */}
      {showNotifTimePicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowNotifTimePicker(false)}>
          <div 
            className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
            style={{ maxHeight: "85vh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-foreground">알림 시간 설정</h3>
              <div className="w-6" />
            </div>
            
            {/* Body */}
            <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="flex text-center text-xs text-muted-foreground mb-1">
                <div className="flex-1"></div>
                <div className="flex-1">시</div>
                <div className="flex-1">분</div>
              </div>
              <div className="relative flex gap-2 h-[180px] overflow-hidden">
                {/* Center highlight bar */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] bg-[#e8f6ff] rounded-lg pointer-events-none z-10" />
                
                {/* AM/PM */}
                <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                  {(["AM", "PM"] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setNotifAmPm(val)}
                      className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                        notifAmPm === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                
                {/* Hour */}
                <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((val) => (
                    <button
                      key={val}
                      onClick={() => setNotifHour(val)}
                      className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                        notifHour === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                
                {/* Minute */}
                <div className="flex flex-col overflow-y-auto flex-1 snap-y snap-mandatory scroll-smooth z-20" style={{ scrollbarWidth: "none", paddingTop: "68px", paddingBottom: "68px" }}>
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((val) => (
                    <button
                      key={val}
                      onClick={() => setNotifMinute(val)}
                      className={`h-[44px] flex items-center justify-center snap-center shrink-0 cursor-pointer ${
                        notifMinute === val ? "text-[#a3daff] font-bold text-base" : "text-gray-400 text-sm"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => {
                  // Convert to 24h format
                  let hour24 = parseInt(notifHour)
                  if (notifAmPm === "PM" && hour24 !== 12) hour24 += 12
                  if (notifAmPm === "AM" && hour24 === 12) hour24 = 0
                  setNotifTime(`${hour24.toString().padStart(2, "0")}:${notifMinute}`)
                  setShowNotifTimePicker(false)
                }} 
                className="w-full py-3 bg-[#a3daff] text-white rounded-xl font-medium"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render Weekly Info
  const renderWeeklyInfo = () => {
    const weekData = babySizeData[selectedWeek] || babySizeData[14]

    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <button onClick={() => setScreen("home")}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button onClick={() => setShowWeekPicker(true)} className="flex items-center gap-2 font-semibold text-foreground">
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedWeek}주차</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="w-6" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setWeeklyInfoTab("baby")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              weeklyInfoTab === "baby" ? "text-[#a3daff] border-b-2 border-[#a3daff]" : "text-muted-foreground"
            }`}
          >
            👶 아기 성장
          </button>
          <button
            onClick={() => setWeeklyInfoTab("mom")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              weeklyInfoTab === "mom" ? "text-[#a3daff] border-b-2 border-[#a3daff]" : "text-muted-foreground"
            }`}
          >
            🤰 엄마 몸 변화
          </button>
        </div>

        <div className="px-4 py-6">
          {weeklyInfoTab === "baby" ? (
            <>
              {/* Baby Illustration */}
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">🍑</div>
                <p className="text-foreground font-semibold break-words">{weekData.size} 크기</p>
                <p className="text-muted-foreground text-sm break-words">
                  ({weekData.length}, {weekData.weight})
                </p>
              </div>

              {/* Development */}
              <div className="bg-card rounded-2xl p-4 border border-border mb-4">
                <h3 className="font-semibold text-foreground mb-3 break-words">발달 변화</h3>
                <ul className="space-y-2">
                  {weekData.development.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground break-words">
                      <span className="text-[#a3daff]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Mom Changes */}
              <div className="bg-card rounded-2xl p-4 border border-border mb-4">
                <h3 className="font-semibold text-foreground mb-3 break-words">몸 변화 & 주의할 점</h3>
                <ul className="space-y-2">
                  {weekData.tips.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground break-words">
                      <span className="text-[#a3daff]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Check */}
              <div className="bg-secondary/30 rounded-2xl p-4">
                <p className="text-foreground text-sm flex items-center gap-2 break-words">
                  <Check className="w-5 h-5 text-secondary" />
                  이번 주 권장: 기형아 검사
                </p>
              </div>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="fixed bottom-20 left-0 right-0 max-w-[390px] mx-auto bg-muted/80 px-4 py-3">
          <p className="text-xs text-muted-foreground text-center break-words">
            본 정보는 국민건강보험 자료 기반 참고용입니다. 전문가 상담을 권장합니다.
          </p>
        </div>

        {/* Week Picker */}
        {showWeekPicker && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowWeekPicker(false)}>
            <div 
              className="relative bg-white w-full max-w-[390px] rounded-t-2xl flex flex-col z-50"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 shrink-0">
                <h3 className="font-semibold text-foreground">주차 선택</h3>
              </div>
              
              {/* Body - scrollable */}
              <div className="overflow-y-auto flex-1 px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                {[
                  { label: "1~10주차", weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                  { label: "11~20주차", weeks: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
                  { label: "21~30주차", weeks: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
                  { label: "31~40주차", weeks: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
                ].map((group) => (
                  <div key={group.label} className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">{group.label}</p>
                    <div className="grid grid-cols-5 gap-2">
                      {group.weeks.map((week) => (
                        <button
                          key={week}
                          onClick={() => {
                            setSelectedWeek(week)
                            setShowWeekPicker(false)
                          }}
                          className={`py-2 rounded-lg text-sm relative ${
                            selectedWeek === week
                              ? "bg-[#a3daff] text-foreground"
                              : pregnancyInfo.weeks === week
                                ? "bg-[#a3daff]/20 text-[#a3daff]"
                                : "bg-muted text-foreground"
                          }`}
                        >
                          {week}
                          {pregnancyInfo.weeks === week && (
                            <span className="absolute -top-1 -right-1 text-[10px] bg-[#a3daff] text-foreground px-1 rounded">현재</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Bottom Tab Bar
  const renderBottomTab = () => (
    <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-card border-t border-border h-16 flex items-center justify-around z-50">
      {[
        { id: "home" as Screen, icon: Home, label: "홈" },
        { id: "record" as Screen, icon: FileText, label: "기록" },
        { id: "schedule" as Screen, icon: Calendar, label: "일정" },
        { id: "community" as Screen, icon: MessageCircle, label: "커뮤니티" },
        { id: "mypage" as Screen, icon: User, label: "마이" },
      ].map((tab) => {
        const isActive = screen === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            className={`flex flex-col items-center gap-1 relative ${isActive ? "text-[#a3daff]" : "text-muted-foreground"}`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )

  // Main render
  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return renderSplash()
      case "onboarding":
        return renderOnboarding()
      case "auth":
        return renderAuth()
      case "pregnancy-setup":
        return renderPregnancySetup()
      case "notification-setup":
        return renderNotificationSetup()
      case "home":
        return renderHome()
      case "record":
        return renderRecord()
      case "weekly-report":
        return renderWeeklyReport()
      case "schedule":
        return renderSchedule()
      case "community":
        return renderCommunity()
      case "notifications":
        return renderNotifications()
      case "post-detail":
        return renderPostDetail()
      case "post-write":
        return renderPostWrite()
      case "mypage":
        return renderMyPage()
      case "weekly-info":
        return renderWeeklyInfo()
      default:
        return renderHome()
    }
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] relative">
        {renderScreen()}
        {showBottomTab && renderBottomTab()}
      </div>
    </div>
  )
}
