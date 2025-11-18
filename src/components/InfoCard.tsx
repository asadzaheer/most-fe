interface InfoCardProps {
  icon: string
  value: string | number
  label: string
  color: "blue" | "orange" | "green" | "purple"
}

const colorClasses = {
  blue: {
    border: "border-blue-100",
    text: "text-blue-800",
    icon: "text-[#1E40AF]"
  },
  orange: {
    border: "border-orange-100",
    text: "text-orange-600",
    icon: "text-[#EA580C]"
  },
  green: {
    border: "border-green-100",
    text: "text-green-600",
    icon: "text-green-600"
  },
  purple: {
    border: "border-purple-100",
    text: "text-purple-600",
    icon: "text-purple-600"
  }
}

export function InfoCard({ icon, value, label, color }: InfoCardProps) {
  const colors = colorClasses[color]
  
  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg text-center border-4 ${colors.border}`}>
      <div className={`${colors.icon} text-3xl sm:text-4xl md:text-6xl mb-2 sm:mb-4`}>
        {icon}
      </div>
      <div className={`text-xl sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2 ${colors.text}`}>
        {value}
      </div>
      <div className="text-sm sm:text-base md:text-xl text-gray-600">
        {label}
      </div>
    </div>
  )
}
