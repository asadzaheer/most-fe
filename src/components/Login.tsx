import { t } from "i18next"
import { useState } from "react"
import { useSignIn } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/useAuthStore"

interface LoginProps {
  onComplete: () => void
  onCancel: () => void
}

export function Login({ onComplete, onCancel }: LoginProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // API hooks
  const signInMutation = useSignIn()
  const { toast } = useToast()
  const login = useAuthStore((state) => state.login)

  const handlePhoneChange = (value: string) => {
    // Allow +, digits, spaces, and hyphens
    const cleaned = value.replace(/[^\d+\s-]/g, "")
    setPhone(cleaned)
  }

  const handleLogin = async () => {
    try {
      const result = await signInMutation.mutateAsync({
        phoneNumber: phone,
        password: password,
      })

      if (result.token) {
        // Store user info in Zustand store
        login(result.token, {
          phone: phone,
          // Add other user data from result if available
        })
        
        toast({
          title: t("login.success"),
          description: t("login.welcomeBack"),
        })
        
        onComplete()
      } else {
        toast({
          title: t("login.error"),
          description: result.message || t("login.invalidCredentials"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: t("login.error"),
        description: error?.response?.data?.message || t("login.errorMessage"),
        variant: "destructive",
      })
    }
  }

  const isFormValid = () => {
    const digitsOnly = phone.replace(/\D/g, "")
    return phone.includes("+") && digitsOnly.length >= 7 && password.length >= 8
  }

  const isLoading = signInMutation.isPending

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {t("login.title")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {t("login.subtitle")}
        </p>
      </div>

      {/* Phone Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          {t("login.phone.title")}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={t("login.phone.placeholder")}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-base"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("login.phone.hint")}
        </p>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          {t("login.password.title")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.password.placeholder")}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-base pr-12"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isFormValid() && !isLoading) {
                handleLogin()
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {t("common.cancel")}
        </button>
        <button
          onClick={handleLogin}
          disabled={!isFormValid() || isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("login.loggingIn") : t("login.loginButton")}
        </button>
      </div>
    </>
  )
}
