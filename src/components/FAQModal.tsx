import { useState } from "react"

interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0)

  const questions = [
    {
      q: "How to stay safe and support each other in the queue?",
      a: "This system works not just through technology — but through people. Safety and order start with all of us.\n\n---\n\n✅ Before arriving:\n• 🔋 Charge your phone fully. Bring a power bank if you can.\n• 💊 Pack your medicine and essentials.\n• 🧃 Take water and snacks. The queue may take 6–12 hours.\n• 🧥 Dress for the weather. Mornings can be cold, afternoons hot.\n\n---\n\n🤝 While waiting:\n• 👋 Greet the people near you. They're your first support.\n• 👀 Don't solve problems alone. Talk to neighbors — together we're stronger.\n• 🔄 Make yourself visible. If stepping away, tap the \"Step away\" button so others know.\n\n---\n\n🧠 Behavior spreads:\n• People follow what they see.\n• Be honest and respectful — it's contagious.\n• The queue becomes a community, not chaos.\n\n---\n\n🚨 In case of emergency:\n• 🔴 Tap SOS — nearby people will be notified.\n• 📞 Call 112 for serious situations.\n• 🧍‍♂️ Tell others nearby. Don't stay silent or isolated.\n\n---\n\n⚠️ This platform is not a replacement for emergency services, but:\n• It helps you signal for help.\n• It connects people in the queue.\n• It enables quick coordination and mutual support.\n\n---\n\n📌 If everyone is respectful — this border becomes safer, kinder, and more human.",
      expanded: true,
    },
    {
      q: "How long will I wait?",
      a: "Wait time depends on people ahead of you. On average, each person takes 8-10 minutes. But let's be honest - this border might mean waiting from 2 to 10 hours. We understand how hard it is. Therefore, we show real-time estimates and work daily to bring more order, dignity and predictability.",
    },
    {
      q: "What if I need to use the toilet?",
      a: "Press 'Step Away' button in your queue panel. We are working hard to ensure short breaks are safe and respected by others. While we can't fully guarantee everyone will cooperate yet, we are building mutual trust and transparency. Thank you for your patience as we improve this experience together.",
    },
    {
      q: "What if I run out of battery?",
      a: "Press the red SOS button in the top-right corner. We'll try to notify people near you that someone nearby may need a power bank. We'll do our best to assist, but we cannot promise any specific outcome or printing support. Please prepare in advance and charge your phone before coming.",
    },
    {
      q: "Who sees my information?",
      a: "Only your queue number is visible to others. Your name and category (elderly/with children) are used only for internal coordination of assistance - and only if you choose to provide them. If you select 'Anonymous', nothing is transmitted.",
    },
    {
      q: "Why enter a role (elderly/with children)?",
      a: "Providing your role is optional. If you choose to provide it (e.g., elderly / with children), it will help assistants nearby provide you with faster and more effective assistance. Your role is never shown publicly. If you prefer not to share - select 'Anonymous'.",
    },
    {
      q: "What does the SOS button do?",
      a: "The SOS button alerts nearby people that you may need help — whether due to a health issue, dead phone, or urgent concern. We're improving this feature continuously, but we cannot guarantee response in every case. For serious emergencies, always call 112 immediately. 🧭 Reminder: Before entering the queue, please check if you have: Enough phone charge, Water and medication, Contact options for people around you",
    },
    {
      q: "How do I report abuse or cheating?",
      a: "Press the SOS button and select 'Report an issue'. We take queue fairness seriously and use all tools we can to keep the line respectful and transparent. However, the best prevention is mutual honesty and communication. Work together with those around you. If we all act fairly — it becomes contagious.",
    },
    {
      q: "Is this official/supported by border guards?",
      a: "No, this is an independent volunteer project to help travelers. We cooperate with border guards but are not an official service.",
    },
    {
      q: "Can I use this on another device?",
      a: "Yes, but you'll need to verify your phone number again. One queue number can only be active on one device at a time.",
    },
    {
      q: "What if someone needs urgent help?",
      a: "Immediately press SOS or approach any volunteer in yellow vests. For medical emergencies, call 112.",
    },
    {
      q: "Which direction is faster to cross?",
      a: "Crossing into Russia (Narva → Ivangorod) usually takes 6–12 hours. Crossing back to Estonia (Ivangorod → Narva) is much faster — around 30–90 minutes.",
    },
    {
      q: "What is the current wait time at the border?",
      a: "During summer or holidays, queues can reach 8–12+ hours. We show current estimates to help you plan.",
    },
    {
      q: "Is the border open 24/7?",
      a: "No. Since May 1, 2024, the pedestrian checkpoint operates daily from 7:00 to 23:00. Closed at night.",
    },
    {
      q: "Are there customs checks and fines?",
      a: "Yes. Estonia introduced full customs control for outbound travelers to Russia. Undeclared commercial goods may result in fines up to €3200 for businesses.",
    },
    {
      q: "Are there toilets and water available?",
      a: "Authorities have placed mobile toilets and water stations, but access may be limited and inconsistent.",
    },
    {
      q: "Can I cross the border by car?",
      a: "No. Since Feb 1, 2024, the vehicle crossing is closed for reconstruction. Only pedestrian crossing is available.",
    },
    {
      q: "Can I use public transport?",
      a: "Yes. After walking across the border, you can take buses like LuxExpress. Expect 5–8 hours for the walking part.",
    },
    {
      q: "Where can I exchange money?",
      a: "It's recommended to bring USD or GBP. Euro exchanges can be limited in some locations. Best to exchange after crossing.",
    },
    {
      q: "Is there a better or faster way to cross?",
      a: "Yes. Consider taking a train from Tallinn to St. Petersburg (Go Rail): Faster border clearance (~1–2h onboard), Comfortable: toilet, water, device charging, Border checks happen directly inside the train car.",
    },
  ]

  const formatText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.trim() === "---") {
        return <div key={index} className="border-t border-gray-300 my-4"></div>
      }

      if (line.startsWith("• ")) {
        return (
          <div key={index} className="ml-4 mb-2">
            {line}
          </div>
        )
      }

      if (line.trim() === "") {
        return <br key={index} />
      }

      return (
        <div key={index} className="mb-2">
          {line}
        </div>
      )
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-xl transition-colors min-h-[50px] min-w-[50px] flex items-center justify-center"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {questions.map((item, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between min-h-[80px]"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-800 pr-4">{item.q}</span>
                  <span className="text-2xl text-blue-600 flex-shrink-0">{activeQuestion === index ? "−" : "+"}</span>
                </button>

                {activeQuestion === index && (
                  <div className="px-4 sm:px-6 py-4 sm:py-6 bg-blue-50 faq-answer">
                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed faq-content">
                      {formatText(item.a)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl font-bold py-4 px-8 rounded-2xl transition-all min-h-[60px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
