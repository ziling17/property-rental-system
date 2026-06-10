/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { X, Send, ShieldCheck, HelpCircle, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: Date;
}

interface SupportModalProps {
  onClose: () => void;
  userEmail: string;
}

const FAQ_ITEMS = [
  {
    q: "Is my security deposit safe in escrow?",
    a: "Absolutely. Under MySewa Trust-Guard terms, your 2x Security and 0.5x Utility deposits will rest in a secure licensed escrow account. Funds are released to the landlord only after you inspect the property, receive keys, and biometrically authorize the move-in."
  },
  {
    q: "How does FPX transaction verify?",
    a: "FPX utilizes secure direct debit gateways sponsored by Bank Negara Malaysia (BNM). When payment is initiated, you are redirected to your retail bank portal. Once logged in, BNM completes immediate encrypted settlement without disclosing credentials to third-parties."
  },
  {
    q: "Can I cancel my rental application?",
    a: "Yes. You can cancel and secure a 100% full refund at any point prior to signing the digital lease agreement or registering the handovers. Click on 'My Rental Applications' under your profile menu to handle cancellations."
  },
  {
    q: "What should I do if my payment fails?",
    a: "In case of interruption, please check if your transactional debit limit allows. Malaysian banks require authorization for transactions above RM 5,000. Alternatively, choose FPX Online Banking or select Touch 'n Go E-Wallet for smooth high-value clearing."
  }
];

export default function SupportModal({ onClose, userEmail }: SupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "support",
      text: "Hi there! Welcome to MySewa Customer Support. I'm your dedicated Trust-Guard Assistant. How can I help you secure your rental payment today?",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate smart support reply after 1s
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Thank you for reaching out! A human agent is reviewing your transaction. Could you provide your Receipt Ref ID or details of the payment method you used?";
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("escrow") || lowerText.includes("deposit") || lowerText.includes("safe")) {
        replyText = "MySewa complies strictly with Malaysian trust guidelines. Your security and utility deposits (RM 10,250.00 standard total) are held in an escrow account. They cannot be drawn by the landlord until you receive the keys.";
      } else if (lowerText.includes("fpx") || lowerText.includes("bank") || lowerText.includes("limit")) {
        replyText = "For FPX payments exceeding RM 5,000.00, check with your bank's transactional settings. Some cards limit online transactions for protection. FPX remains the most secure method for major Malaysian banks.";
      } else if (lowerText.includes("card") || lowerText.includes("visa") || lowerText.includes("double")) {
        replyText = "Rest assured, our payment processing uses dual-channel tokenization to avoid duplicate billing. In case you observe duplicate authorizations, your bank will clear holding states in 2-3 business days.";
      } else if (lowerText.includes("handover") || lowerText.includes("key") || lowerText.includes("move")) {
        replyText = "After successful payment, click 'Register Handover' to set coordinate locks for key release. Your landlord Kenji Halim will receive instantly a notification to verify.";
      }

      const supportMsg: Message = {
        id: `support-${Date.now()}`,
        sender: "support",
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportMsg]);
    }, 1000);
  };

  return (
    <div id="support-modal-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        id="support-dialog"
        className="bg-white rounded-2xl w-full max-w-lg h-[500px] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="font-bold text-sm">MySewa Careline</p>
              <p className="text-[10px] text-primary-fixed/80">Support for tenant {userEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Zone */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
          {messages.map((msg: Message) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 leading-relaxed shadow-sm border ${
                    isUser
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-on-surface border-outline-variant/30"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[9px] text-right mt-1 opacity-70 ${isUser ? "text-white" : "text-on-surface-variant"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-xl p-3 border border-outline-variant/20 flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* FAQ Suggestions */}
        <div className="p-3 bg-white border-t border-outline-variant/20">
          <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 mb-2">
            <HelpCircle size={12} /> Frequently Asked Questions
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FAQ_ITEMS.map((faq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  // Post question as user, trigger answer immediate
                  handleSend(faq.q);
                }}
                className="flex-shrink-0 text-[10px] bg-slate-50 hover:bg-primary-fixed/20 hover:text-primary transition-all px-2.5 py-1 rounded-full border border-outline-variant/35 font-bold cursor-pointer"
              >
                {faq.q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="p-3 bg-slate-50 border-t border-outline-variant/25 flex gap-2 items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your payment or escrow question..."
            className="flex-1 h-10 px-3 bg-white rounded-xl border border-outline-variant/60 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-xs"
          />
          <button
            type="submit"
            className="h-10 w-10 bg-primary text-white rounded-xl hover:bg-opacity-95 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
