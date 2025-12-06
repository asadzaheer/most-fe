import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useRequestReset, useResetPassword } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { Layout } from "@/components/Layout"

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get("token")
  
  const [step, setStep] = useState<"request" | "linkSent" | "reset">(tokenFromUrl ? "reset" : "request")
  const [phone, setPhone] = useState("")
  const [token, setToken] = useState(tokenFromUrl || "")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const requestResetMutation = useRequestReset()
  const resetPasswordMutation = useResetPassword()
  const { toast } = useToast()

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+\s-]/g, "")
    setPhone(cleaned)
  }

  const validatePassword = (pwd: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
    const hasMinLength = pwd.length >= 8
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength
  }

  const getPasswordStrengthMessage = () => {
    if (newPassword.length === 0) return ""
    
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
    }
    
    const missing = []
    if (!checks.length) missing.push(t("registration.password.minLength"))
    if (!checks.uppercase) missing.push(t("registration.password.uppercase"))
    if (!checks.lowercase) missing.push(t("registration.password.lowercase"))
    if (!checks.number) missing.push(t("registration.password.number"))
    if (!checks.special) missing.push(t("registration.password.special"))
    
    return missing.length > 0 ? missing.join(", ") : t("registration.password.strong")
  }

  const handleRequestReset = async () => {
    try {
      await requestResetMutation.mutateAsync({
        number: phone,
      })

      setStep("linkSent")
    } catch (error: unknown) {
      console.error("Request reset error:", error)
      const errorMessage = error instanceof Error ? error.message : t("forgotPassword.errorMessage")
      toast({
        title: t("forgotPassword.error"),
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t("forgotPassword.error"),
        description: t("forgotPassword.passwordMismatch"),
        variant: "destructive",
      })
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token: token,
        newPassword: newPassword,
      })

      toast({
        title: t("forgotPassword.success"),
        description: t("forgotPassword.passwordReset"),
      })

      navigate("/login")
    } catch (error: unknown) {
      console.error("Reset password error:", error)
      const errorMessage = error instanceof Error ? error.message : t("forgotPassword.errorMessage")
      toast({
        title: t("forgotPassword.error"),
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const isRequestFormValid = () => {
    const digitsOnly = phone.replace(/\D/g, "")
    return phone.includes("+") && digitsOnly.length >= 7
  }

  const isResetFormValid = () => {
    return token.length > 0 && validatePassword(newPassword) && newPassword === confirmPassword
  }

  const isLoading = requestResetMutation.isPending || resetPasswordMutation.isPending

  return (
    <Layout>
      <main className="max-w-md mx-auto mt-8 sm:mt-12 lg:mt-16 px-4">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {t("forgotPassword.title")}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {step === "request" 
                ? t("forgotPassword.subtitle") 
                : step === "linkSent"
                  ? ""
                  : t("forgotPassword.enterNewPassword")}
            </p>
          </div>

          {step === "request" ? (
            <>
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

              {/* Request Reset Button */}
              <button
                onClick={handleRequestReset}
                disabled={!isRequestFormValid() || isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isLoading ? t("forgotPassword.sending") : t("forgotPassword.sendCode")}
              </button>
            </>
          ) : step === "linkSent" ? (
            <>
              {/* Link Sent Confirmation */}
              <div className="text-center py-4">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  {t("forgotPassword.linkSentTitle")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("forgotPassword.linkSentMessage")}
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    {t("forgotPassword.linkSentHint")}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Token Input - only show if token wasn't provided via URL */}
              {!tokenFromUrl && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                    {t("forgotPassword.token")}
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder={t("forgotPassword.tokenPlaceholder")}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-base"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* New Password Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  {t("forgotPassword.newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("registration.password.placeholder")}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-base pr-12"
                    disabled={isLoading}
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
                <p className={`text-xs mt-1 ${validatePassword(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {newPassword.length > 0 ? getPasswordStrengthMessage() : t("registration.password.hint")}
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                  {t("forgotPassword.confirmPassword")}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-base"
                  disabled={isLoading}
                />
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("forgotPassword.passwordMismatch")}
                  </p>
                )}
              </div>

              {/* Reset Password Button */}
              <button
                onClick={handleResetPassword}
                disabled={!isResetFormValid() || isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isLoading ? t("forgotPassword.resetting") : t("forgotPassword.resetButton")}
              </button>
            </>
          )}

          {/* Back to Login Link */}
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline text-sm sm:text-base"
            >
              ← {t("forgotPassword.backToLogin")}
            </button>
          </div>
        </div>
      </main>
    </Layout>
  )
}
