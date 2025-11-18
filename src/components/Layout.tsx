import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { FAQModal } from "@/components/FAQModal";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [showFAQ, setShowFAQ] = useState(false);

  const handleLanguageChange = (lang: "ru" | "en" | "ee") => {
    i18n.changeLanguage(lang);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleFAQClick = () => {
    setShowFAQ(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar Component */}
      <Navbar
        language={i18n.language as "ru" | "en" | "ee"}
        onLanguageChange={handleLanguageChange}
        onHomeClick={handleHomeClick}
        onFAQClick={handleFAQClick}
      />

      {/* Page Content */}
      <div className="pt-24 sm:pt-28 lg:pt-32 px-4 pb-8">
        {children}
      </div>

      {/* FAQ Modal */}
      <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </div>
  );
}
