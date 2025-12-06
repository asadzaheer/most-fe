import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TicketStatus } from "@/lib/api-service"

interface QueueNumberCardProps {
  queueNumber: number
  initialPeopleAhead: number
  isPaused?: boolean
  status?: TicketStatus
}

export function QueueNumberCard({
  queueNumber,
  initialPeopleAhead,
  isPaused = false,
  status
}: QueueNumberCardProps) {
  const { t } = useTranslation()
  // Check if user is being called (position 0 and status CALLED)
  const isBeingCalled = status === 'CALLED' || (queueNumber === 0 && status !== 'WAITING');
  const MINUTES_PER_PERSON = 2
  const [currentTime, setCurrentTime] = useState(new Date())
  const [startTime] = useState(new Date())
  const [pausedElapsedMinutes, setPausedElapsedMinutes] = useState(0)
  
  // Calculate elapsed time in minutes (frozen when paused)
  const elapsedMinutes = isPaused 
    ? pausedElapsedMinutes 
    : Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 60))
  
  // Store elapsed minutes when pausing
  useEffect(() => {
    if (isPaused) {
      setPausedElapsedMinutes(elapsedMinutes)
    }
  }, [isPaused, elapsedMinutes])
  
  // Calculate current people ahead (decreases as time passes)
  const peoplePassed = Math.floor(elapsedMinutes / MINUTES_PER_PERSON)
  const peopleAhead = Math.max(0, initialPeopleAhead - peoplePassed)
  
  // Calculate total wait time and remaining time
  const totalWaitMinutes = initialPeopleAhead * MINUTES_PER_PERSON
  const remainingMinutes = Math.max(0, totalWaitMinutes - elapsedMinutes)
  
  // Calculate progress percentage (0-100)
  const progressPercentage = totalWaitMinutes > 0 
    ? Math.min(100, (elapsedMinutes / totalWaitMinutes) * 100)
    : 100
  
  // Calculate expected call time
  const expectedCallTime = new Date(startTime.getTime() + totalWaitMinutes * 60 * 1000)
  const formattedExpectedTime = expectedCallTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  
  // Update current time every second for smooth animation (only when not paused)
  useEffect(() => {
    if (isPaused) return
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isPaused])

  // Show special UI when being called
  if (isBeingCalled) {
    return (
      <div className="bg-white rounded-[25px] shadow-[0_6px_4px_rgba(0,0,0,0.1)] px-[18px] py-[23px] mb-[25px] border-4 border-green-400 animate-pulse">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4 text-center">
          🎉 {t("yourPosition.calledTitle")}
        </h2>
        
        <div className="bg-green-50 rounded-[16px] px-[20px] py-[24px] mb-[16px] text-center">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-green-800 font-bold text-xl mb-2">
            {t("yourPosition.calledMessage")}
          </p>
          <p className="text-green-600 text-base">
            {t("yourPosition.calledDescription")}
          </p>
        </div>

        <div className="bg-green-100 rounded-[12px] px-[16px] py-[12px] text-center">
          <p className="text-green-700 font-medium text-sm">
            {t("yourPosition.calledHint")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-[25px] shadow-[0_6px_4px_rgba(0,0,0,0.1)] px-[18px] py-[23px] mb-[25px] border-4 ${
      isPaused ? 'border-yellow-300' : 'border-green-100'
    }`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 text-center">{t("yourPosition.title")}</h2>
      <div className={`font-bold text-[47px] leading-[48px] text-center mb-[9px] ${
        isPaused ? 'text-yellow-600' : 'text-green-600'
      }`}>
        #{queueNumber}
      </div>
      <p className="text-[#374151] text-center text-[15px] leading-[24px] mb-[10px] px-[18px]">
        {t("yourPosition.subtitle", { position: queueNumber, ahead: peopleAhead })}
      </p>
      <p className="text-[#6B7280] text-center text-[13px] leading-[20px] italic px-[22px] mb-[20px]">
        {t("yourPosition.description")}
      </p>

      {/* Progress Visualization */}
      <div className="bg-[#F3F4F6] rounded-[16px] px-[20px] py-[17px] mb-[16px]">
        <div className="text-center font-bold text-[14px] leading-[20px] mb-[16px]">
          <span>{t("yourPosition.border")} </span><span> ——————————————— </span><span> {t("yourPosition.end")}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-[20px]">
          <div className="h-[12px] bg-[#D1D5DB] rounded-full relative">
            <div 
              className={`absolute top-0 left-0 h-[12px] rounded-full transition-all duration-1000 ${
                isPaused ? 'bg-yellow-500' : 'bg-[#2563EB]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div 
              className={`absolute top-[-2px] w-[16px] h-[16px] rounded-full border-2 border-white shadow-lg transition-all duration-1000 ${
                isPaused ? 'bg-yellow-500' : 'bg-[#22C55E]'
              }`}
              style={{ left: `${Math.max(0, progressPercentage - 2)}%` }}
            ></div>
          </div>
        </div>

        <p className="text-[#4B5563] text-center text-[10px] leading-[16px]">
          {isPaused ? '⏸️ PAUSED' : '● YOU HERE'}
        </p>
      </div>

      {/* Time Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-lg text-center">
        <div className={isPaused ? 'text-yellow-600' : 'text-orange-600'}>
          <div className="font-bold">
            {remainingMinutes} {t("yourPosition.minutes")}
          </div>
          <div className="text-sm text-gray-600">{t("yourPosition.estimatedTime")}</div>
        </div>
        <div className={isPaused ? 'text-yellow-600' : 'text-purple-600'}>
          <div className="font-bold">
            {formattedExpectedTime}
          </div>
          <div className="text-sm text-gray-600">{t("yourPosition.expectedCall")}</div>
        </div>
      </div>
    </div>
  )
}
