import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Login } from "./Login"
import { Registration } from "./Registration"

interface AuthModalProps {
  onComplete: () => void
  onCancel: () => void
  defaultTab?: "login" | "registration"
}

export function AuthModal({ onComplete, onCancel, defaultTab = "login" }: AuthModalProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<"login" | "registration">(defaultTab)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Tab Header */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 px-6 font-semibold text-base sm:text-lg transition-colors ${
              activeTab === "login"
                ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("auth.loginTab")}
          </button>
          <button
            onClick={() => setActiveTab("registration")}
            className={`flex-1 py-4 px-6 font-semibold text-base sm:text-lg transition-colors ${
              activeTab === "registration"
                ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("auth.registrationTab")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "login" ? (
            <Login onComplete={onComplete} onCancel={onCancel} />
          ) : (
            <Registration onComplete={onComplete} onCancel={onCancel} />
          )}
        </div>
      </div>
    </div>
  )
}
