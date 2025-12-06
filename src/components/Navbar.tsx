import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useIsAuthenticated } from "@/store/useAuthStore"
import { useAuthStore } from "@/store/useAuthStore"

interface NavbarProps {
  language: "ru" | "en" | "ee"
  onLanguageChange: (lang: "ru" | "en" | "ee") => void
  onHomeClick: () => void
  onFAQClick: () => void
}

export function Navbar({ language, onLanguageChange, onHomeClick, onFAQClick }: NavbarProps) {
  const { t } = useTranslation()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    setShowMobileMenu(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-4 border-blue-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Always clickable */}
            <button
              onClick={onHomeClick}
              className="flex items-center space-x-2 hover:bg-gray-50 p-2 sm:p-3 rounded-2xl transition-colors min-h-[50px] sm:min-h-[60px] cursor-pointer"
              title="На главную"
            >
              <div className="text-2xl sm:text-4xl">🚦</div>
              <span className="text-lg sm:text-2xl font-bold text-blue-800 hidden sm:block">BorderQueue</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && (
                <>
                  {/* Home */}
                  <button
                    onClick={onHomeClick}
                    className="p-3 hover:bg-gray-50 rounded-2xl transition-colors min-h-[60px] min-w-[70px] flex flex-col items-center justify-center cursor-pointer"
                    title={t('nav.home')}
                  >
                    <span className="text-2xl">🏠</span>
                    <span className="text-xs text-gray-600 mt-1">{t('nav.home')}</span>
                  </button>

                  {/* FAQ */}
                  <button
                    onClick={onFAQClick}
                    className="p-3 hover:bg-gray-50 rounded-2xl transition-colors min-h-[60px] min-w-[70px] flex flex-col items-center justify-center cursor-pointer"
                    title={t('nav.faq')}
                  >
                    <span className="text-2xl">❓</span>
                    <span className="text-xs text-gray-600 mt-1">{t('nav.faq')}</span>
                  </button>
                </>
              )}

              {/* Language Switcher */}
              <div className="flex bg-gray-100 rounded-2xl p-2 space-x-1">
                {[
                  { code: "ru" as const, name: "RU" },
                  { code: "en" as const, name: "EN" },
                  { code: "ee" as const, name: "EE" },
                ].map(({ code, name }) => (
                  <button
                    key={code}
                    onClick={() => onLanguageChange(code)}
                    className={`p-2 sm:p-3 rounded-xl transition-all min-h-[50px] sm:min-h-[60px] min-w-[50px] sm:min-w-[60px] flex items-center justify-center cursor-pointer ${
                      language === code ? "bg-blue-600 shadow-lg transform scale-110" : "hover:bg-white"
                    }`}
                  >
                    <span className="text-sm sm:text-base">{name}</span>
                  </button>
                ))}
              </div>

              {/* Logout Button - Only show when authenticated */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors min-h-[60px] min-w-[70px] flex flex-col items-center justify-center cursor-pointer"
                  title={t('nav.logout')}
                >
                  <span className="text-2xl">⏻</span>
                  <span className="text-xs text-gray-600 mt-1">{t('nav.logout')}</span>
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 bg-gray-100 rounded-xl min-h-[50px] min-w-[50px] flex items-center justify-center cursor-pointer"
                >
                  <span className="text-xl">{language === "ru" ? "🇷🇺" : language === "en" ? "🇬🇧" : "🇪🇪"}</span>
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border-2 border-gray-200 z-60">
                    {[
                      { code: "ru" as const, flag: "🇷🇺"},
                      { code: "en" as const, flag: "en"},
                      { code: "ee" as const, flag: "🇪🇪"},
                    ].map(({ code, flag }) => (
                      <button
                        key={code}
                        onClick={() => {
                          onLanguageChange(code)
                          setShowLanguageMenu(false)
                        }}
                        className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3 cursor-pointer ${
                          language === code ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        <span className="text-xl">{flag}</span>
                        {/* <span className="text-base font-medium">{name}</span> */}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 hover:bg-gray-50 rounded-xl min-h-[50px] min-w-[50px] flex items-center justify-center cursor-pointer"
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t-2 border-gray-100">
              {isAuthenticated && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <button
                    onClick={() => {
                      onHomeClick()
                      setShowMobileMenu(false)
                    }}
                    className="p-4 hover:bg-gray-50 rounded-2xl transition-colors flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-2xl mb-1">🏠</span>
                    <span className="text-sm text-gray-600">{t('nav.home')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onFAQClick()
                      setShowMobileMenu(false)
                    }}
                    className="p-4 hover:bg-gray-50 rounded-2xl transition-colors flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-2xl mb-1">❓</span>
                    <span className="text-sm text-gray-600">{t('nav.faq')}</span>
                  </button>
                </div>
              )}
              
              {/* Logout button in mobile menu */}
              {isAuthenticated && (
                <div className="mt-4 px-4">
                  <button
                    onClick={handleLogout}
                    className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span className="text-2xl">⏻</span>
                    <span className="text-base font-medium text-gray-700">{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Click outside to close menus */}
      {(showLanguageMenu || showMobileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLanguageMenu(false)
            setShowMobileMenu(false)
          }}
        />
      )}
    </>
  )
}
