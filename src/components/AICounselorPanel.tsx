import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Sparkles, HelpCircle, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function AICounselorPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Welcome to MySewa AI Tenancy Council portal. I am your certified digital counselor. Ask me questions about Malaysian tenancy laws, monthly rent budgets (SDG 9 compliance), deposit escrow safety, minor repairs disputes, or lease negotiation guidelines." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestionsByTheme = [
    "What is the standard residential deposit norm in Malaysia?",
    "Explain SDG 9 alignment with MySewa third-party deposit escrow",
    "Can a landlord lock the tenant out if rent is late?",
    "Are verbal tenancy agreements legally binding in Kuala Lumpur?"
  ];

  const handleSendMessage = async (customMessage?: string) => {
    const rawMsg = customMessage || input;
    if (!rawMsg.trim() || loading) return;

    const userMsg: Message = { role: "user", text: rawMsg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: rawMsg })
      });
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "MySewa security node is offline. Please key in a valid Gemini API Key inside Settings -> Secrets panel." }]);
      }
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "bot", text: "MySewa node failed to transmit the message. Verify connection." }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[450px]">
      {/* Banner */}
      <div className="bg-[#2563eb] text-white p-4 shrink-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#ffe083]" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight flex items-center gap-1">
              AI Tenancy Counsel
              <Sparkles className="w-3.5 h-3.5 text-[#ffe083]" fill="#ffe083" />
            </h4>
            <p className="text-[10px] text-blue-100 font-sans mt-0.5">Malaysia Tenancy Standards Expert</p>
          </div>
        </div>

        <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded-full bg-white/10 text-white font-bold flex items-center gap-1 uppercase">
          ● Online
        </span>
      </div>

      {/* Messages View */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[350px] min-h-[220px] custom-scrollbar bg-gray-50/50">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
              m.role === "user" 
                ? "bg-primary text-white" 
                : "bg-white text-on-surface border border-gray-100 whitespace-pre-line"
            }`}>
              <div className="flex items-center gap-1 mb-1 opacity-70 font-bold uppercase tracking-wider text-[9px]">
                {m.role === "user" ? (
                  <>
                    <User className="w-3 h-3" />
                    <span>Tenant ID</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3" />
                    <span>MySewa Advisor</span>
                  </>
                )}
              </div>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs shadow-xs text-on-surface-variant flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="font-sans italic text-gray-500">Drafting answer consultation advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Suggestion Chips */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0 select-none">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-primary" /> Recommended Inquiries
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestionsByTheme.map((q, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(q)}
              className="text-[10px] font-sans font-medium text-primary bg-blue-50 hover:bg-primary hover:text-white border border-blue-100 px-2.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Form Input Submit */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-gray-100 shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a tenancy question (e.g. 'How long can rent be late?')..."
          className="flex-grow bg-[#f8f9ff] text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-hidden text-[#121c2a] font-sans"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-blue-700 text-white p-2 md:px-4 md:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden md:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}
