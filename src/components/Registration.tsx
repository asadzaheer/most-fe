import { t } from "i18next"
import { useState, useEffect } from "react"
import { useSignUp, useGetCode, useVerifyCode } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/useAuthStore"

interface RegistrationProps {
  onComplete: () => void
  onCancel: () => void
}

export function Registration({ onComplete, onCancel }: RegistrationProps) {
  const [registrationStep, setRegistrationStep] = useState(1)
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // API hooks
  const signUpMutation = useSignUp()
  const getCodeMutation = useGetCode()
  const verifyCodeMutation = useVerifyCode()
  const { toast } = useToast()
  const login = useAuthStore((state) => state.login)

  // Timer effect for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handlePhoneChange = (value: string) => {
    // Allow +, digits, spaces, and hyphens
    const cleaned = value.replace(/[^\d+\s-]/g, "")
    setPhone(cleaned)
  }

  const handleBirthDateChange = (value: string) => {
    // value comes from date input in yyyy-MM-dd format
    // Convert to dd.MM.yyyy for display
    if (value) {
      const [year, month, day] = value.split('-')
      setBirthDate(`${day}.${month}.${year}`)
    } else {
      setBirthDate('')
    }
  }

  const convertDateToInputFormat = (ddMMyyyy: string): string => {
    // Convert dd.MM.yyyy to yyyy-MM-dd for date input
    const parts = ddMMyyyy.split('.')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return ''
  }

  const validatePassword = (pwd: string): boolean => {
    // Check for at least 8 characters, uppercase, lowercase, number, and special char
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    const hasMinLength = pwd.length >= 8
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength
  }

  const validateBirthDate = (date: string): boolean => {
    // Check if date is in dd.MM.yyyy format and is valid
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/
    const match = date.match(regex)
    
    if (!match) return false
    
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)
    
    // Basic validation
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false
    if (year < 1900 || year > new Date().getFullYear()) return false
    
    // Check if date is valid
    const dateObj = new Date(year, month - 1, day)
    return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year
  }

  const handleContinue = async () => {
    try {
      if (registrationStep === 1) {
        setRegistrationStep(2)
      } else if (registrationStep === 2) {
        setRegistrationStep(3)
      } else if (registrationStep === 3) {
        // Step 3: Sign up and send verification code
        await signUpMutation.mutateAsync({
          name: name.trim(),
          birthDate: birthDate,
          phoneNumber: phone,
          password: password,
        })

        // Then request verification code
        // await getCodeMutation.mutateAsync({
        //   phoneNumber: phone,
        // })

        toast({
          title: t("registration.codeSent"),
          description: t("registration.checkPhone"),
        })

        setRegistrationStep(4)
        setResendTimer(60)
      } else if (registrationStep === 4) {
        // Step 4: Verify code
        const result = await verifyCodeMutation.mutateAsync({
          phoneNumber: phone,
          code: code,
        })

        if (result && result.success && result.token) {
          // Store user info in Zustand store
          login(result.token, {
            phone: phone,
            birthDate: birthDate,
            isPhoneVerified: true,
          })
          
          toast({
            title: t("registration.success"),
            description: t("registration.verified"),
          })
          onComplete()
        } else {
          toast({
            title: t("registration.error"),
            description: result?.message || t("registration.invalidCode"),
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: t("registration.error"),
        description: error?.response?.data || t("registration.errorMessage"),
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    if (registrationStep === 1) {
      onCancel()
      setRegistrationStep(1)
      setName("")
      setBirthDate("")
      setPassword("")
      setPhone("")
      setCode("")
    } else {
      setRegistrationStep(registrationStep - 1)
    }
  }

  const isStepValid = () => {
    const digitsOnly = phone.replace(/\D/g, "")

    switch (registrationStep) {
      case 1:
        return name.trim().length > 0
      case 2:
        // Validate birthdate (dd.MM.yyyy format) and password strength
        return validateBirthDate(birthDate) && validatePassword(password)
      case 3:
        // Check if phone has at least a country code (+) and some digits
        return phone.includes("+") && digitsOnly.length >= 7
      case 4:
        return code.trim().length === 6
      default:
        return false
    }
  }

  const handleResendCode = async () => {
    try {
      await getCodeMutation.mutateAsync({
        phoneNumber: phone,
      })
      
      toast({
        title: t("registration.codeSent"),
        description: t("registration.codeResent"),
      })
      
      setResendTimer(60)
    } catch (error: any) {
      console.error("Resend code error:", error)
      toast({
        title: t("registration.error"),
        description: error.response?.data?.message || t("registration.errorMessage"),
        variant: "destructive",
      })
    }
  }

  const getPasswordStrengthMessage = () => {
    if (password.length === 0) return ""
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }
    
    const missing = []
    if (!checks.length) missing.push(t("registration.password.minLength"))
    if (!checks.uppercase) missing.push(t("registration.password.uppercase"))
    if (!checks.lowercase) missing.push(t("registration.password.lowercase"))
    if (!checks.number) missing.push(t("registration.password.number"))
    if (!checks.special) missing.push(t("registration.password.special"))
    
    return missing.length > 0 ? missing.join(", ") : t("registration.password.strong")
  }

  // Check if any mutation is loading
  const isLoading = signUpMutation.isPending || getCodeMutation.isPending || verifyCodeMutation.isPending

  return (
    <>
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
        {t("registration.title")}
      </h2>

      {/* Progress Dots */}
      <div className="flex justify-center gap-[10px] mb-6">
        <div className={`w-[11px] h-[11px] rounded-full ${registrationStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`w-[12px] h-[11px] rounded-full ${registrationStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`w-[11px] h-[11px] rounded-full ${registrationStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`w-[11px] h-[11px] rounded-full ${registrationStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
      </div>

      {/* Step 1: Name Input */}
      {registrationStep === 1 && (
        <>
          <p className="text-gray-700 text-center font-semibold text-base mb-4">
            {t("registration.step1.title")}
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("registration.name.placeholder")}
              className="w-full h-[60px] rounded-[15px] border-4 border-[#D1D5DB] px-[21px] text-[15px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>
        </>
      )}

      {/* Step 2: Birthdate and Password */}
      {registrationStep === 2 && (
        <>
          <p className="text-gray-700 font-bold text-base mb-6">
            {t("registration.step2.title")}
          </p>

          <div className="space-y-[13px] mb-6">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                {t("registration.birthDate.title")}
              </label>
              <input
                type="date"
                value={convertDateToInputFormat(birthDate)}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="w-full h-[60px] rounded-[15px] border-4 border-[#D1D5DB] px-[21px] text-[15px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E40AF]"
              />
              <p className="text-xs text-gray-500 mt-2">
                {t("registration.birthDate.hint")}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                {t("registration.password.title")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("registration.password.placeholder")}
                className="w-full h-[60px] rounded-[15px] border-4 border-[#D1D5DB] px-[21px] text-[15px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E40AF]"
              />
              <p className={`text-xs mt-2 ${validatePassword(password) ? 'text-green-600' : 'text-gray-500'}`}>
                {password.length > 0 ? getPasswordStrengthMessage() : t("registration.password.hint")}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Phone Input */}
      {registrationStep === 3 && (
        <>
          <p className="text-gray-700 font-bold text-base mb-4">
            {t("registration.step3.title")}
          </p>

          <div className="mb-6">
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={t("registration.phone.placeholder")}
              className="w-full h-[60px] rounded-[15px] border-4 border-[#D1D5DB] px-[21px] text-[15px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E40AF]"
            />
            <p className="text-xs text-gray-500 mt-2">
              {t("registration.phone.hint")}
            </p>
          </div>

          <div className="rounded-[16px] border-2 border-[#BBF7D0] bg-[#F0FDF4] p-[19px] mb-6">
            <p className="text-[#15803D] text-center text-sm leading-5 italic">
              {t("registration.phone.description")}
            </p>
          </div>
        </>
      )}

      {/* Step 4: Code Verification */}
      {registrationStep === 4 && (
        <>
          <p className="text-gray-700 font-bold text-base mb-4">
            {t("registration.step4.title")}
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="1 2 3 4"
              maxLength={6}
              className="w-full h-[60px] rounded-[15px] border-4 border-[#D1D5DB] px-[21px] text-[15px] text-gray-900 text-center tracking-[4.8px] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>

          <div className="rounded-[16px] border-4 border-[#BBF7D0] bg-[#F0FDF4] p-[28px] mb-6">
            <h3 className="text-[#166534] font-bold text-lg leading-5 mb-4">
              {t("registration.step4.confirmation")}
            </h3>
            <div className="space-y-[8px]">
              <p className="text-[#15803D] font-bold text-base leading-5">
                {t("registration.name.title")}: <span className="font-normal">{name || "—"}</span>
              </p>
              <p className="text-[#15803D] font-bold text-base leading-5">
                {t("registration.birthDate.title")}: <span className="font-normal">{birthDate || "—"}</span>
              </p>
              <p className="text-[#15803D] font-bold text-sm leading-5">
                {t("registration.phone.title")}: <span className="font-normal">{phone || "—"}</span>
              </p>
            </div>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="space-y-4">
        <button 
          onClick={handleBack}
          className="w-full h-[60px] rounded-[16px] bg-gray-300 text-gray-700 font-bold text-base hover:bg-gray-400 transition-colors"
        >
          ← {t("common.back")}
        </button>
        <button 
          onClick={handleContinue}
          disabled={!isStepValid() || isLoading}
          className={`w-full h-[60px] rounded-[16px] text-white font-bold text-base transition-colors ${
            isStepValid() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {registrationStep === 3 ? t("registration.step3.sendCode") + ' →' : registrationStep === 4 ? t("registration.step3.getNumber") + ' →' : t("common.continue") + ' →'}
        </button>
        
        {/* Resend code link (only on step 4) */}
        {registrationStep === 4 && (
          <button 
            onClick={handleResendCode}
            disabled={resendTimer > 0 || isLoading}
            className={`w-full text-gray-700 font-bold text-base leading-5 transition-colors ${
              resendTimer > 0 || isLoading
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:underline cursor-pointer'
            }`}
          >
            {resendTimer > 0 
              ? `Resend code in ${resendTimer}s` 
              : 'Resend the code'}
          </button>
        )}
      </div>
    </>
  )
}
