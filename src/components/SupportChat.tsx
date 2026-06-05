/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, ShieldAlert, Landmark } from 'lucide-react';
import { ChatMessage } from '../types';

interface SupportChatProps {
  onSuggestPropertyByName: (name: string) => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({
  onSuggestPropertyByName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: "Selamat Datang! I am SewaBot, your MySewa Property Intelligence Assistant. Ask me anything about lease verification, Stability Scores, Security Guard insurance, or our SDG 9 (Industry, Innovation, & Infrastructure) alignment metrics!",
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate automated smart responses
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let reply = "I understand you're matching properties. MySewa tracks rental datasets to shield tenants from bad actors. Could you specify your monthly rental budget in RM (e.g. RM 3,000) so I can match you?";

      if (lowerText.includes('stability score') || lowerText.includes('how are score') || lowerText.includes('trust score')) {
        reply = "MySewa Stability Scores (0-100%) measure lease security. They combine verified landlord response times, strata council dispute logs, escrow deposit confirmation, and local infrastructural utility indexes to shield you from sudden evictions.";
      } else if (lowerText.includes('security guard') || lowerText.includes('insurance') || lowerText.includes('deposit')) {
        reply = "Our Safety Guard insurance protects security deposits up to RM 10,000 in escrow. If a verified landlord unlawfully refuses deposit returns, MySewa pays out the claim instantly and launches standard legal resolution pathways on your behalf.";
      } else if (lowerText.includes('sdg') || lowerText.includes('sustainable') || lowerText.includes('infrastructure')) {
        reply = "MySewa proudly aligns with United Nations SDG 9 (Industry, Innovation, and Infrastructure). By digitizing the legal registry matching and automating escrow deposits, we cultivate transparent, smart city rental infrastructures across Malaysia's urban landscapes.";
      } else if (lowerText.includes('list') || lowerText.includes('how to list')) {
        reply = "Click the 'List Property' button in the header navigation! Step 1 requests basic condo dimensions and landlord info. Step 2 requires trust registry verification questions (Escrow commitments, strata matched deeds) which auto-computes your active score instantly!";
      } else if (lowerText.includes('pavilion')) {
        reply = "Pavilion Residences is our premier listed property located in Bukit Bintang with a stunning 98% Stability Score. Let me know if you would like me to open the details modal!";
        onSuggestPropertyByName('Pavilion Residences');
      } else if (lowerText.includes('caper')) {
        reply = "The Capers located in Sentul East features a 94% Stability Score and is rented at RM 2,800/mo. It has stellar architectural layouts and expansive family-friendly co-sharing spaces.";
        onSuggestPropertyByName('The Capers');
      } else if (lowerText.includes('nadi') || lowerText.includes('bangsar')) {
        reply = "Nadi Bangsar holds a 91% Stability score, representing a brilliant modern Scandinavian studio priced at RM 3,200/mo in Bangsar South. It incorporates certified green smart utilities supporting SDG initiatives.";
        onSuggestPropertyByName('Nadi Bangsar');
      } else if (lowerText.includes('skyworld') || lowerText.includes('setapak')) {
        reply = "SkyWorld Residence in Setapak offers premium family-oriented leasing at RM 2,400/mo with a high 96% Stability rating due to reliable on-call emergency response metrics.";
        onSuggestPropertyByName('SkyWorld Residence');
      } else if (lowerText.includes('clear') || lowerText.includes('reset')) {
        setMessages([
          {
            id: 'init',
            sender: 'assistant',
            text: "Chat database cleared. What property metadata should we analyze next?",
            timestamp: new Date(),
          }
        ]);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `m-asst-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 750);

    setUserInput('');
  };

  const quickQuestions = [
    'What is a Stability Score?',
    'How does Security Guard insurance work?',
    'Show me Pavilion Residences details',
    'How does this align with SDG 9?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Messenger Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-[350px] sm:w-[380px] h-[480px] flex flex-col border border-outline-variant/30 mb-4 animate-scale-up">
          
          {/* Chat Header */}
          <div className="bg-primary p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-ping shrink-0" />
              <div>
                <h4 className="font-bold text-sm tracking-wide">MySewa Assistant</h4>
                <p className="text-[10px] text-blue-100 font-bold flex items-center gap-0.5">
                  <Landmark size={10} />
                  SDG 9 Vetted Core
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages list container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-sm transition-all ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-outline-variant/30 text-on-surface rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-bold">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Quick interactive questions */}
          <div className="px-4 py-2 border-t border-outline-variant/10 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="bg-slate-100 hover:bg-primary/5 hover:text-primary text-[10px] font-bold px-3 py-1.5 rounded-full text-slate-600 border border-outline-variant/30 transition-all cursor-pointer whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input block */}
          <div className="p-3 bg-white border-t border-outline-variant/20 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
              placeholder="Ask SewaBot about Stability indices..."
              className="flex-grow h-10 px-3 bg-slate-50 border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
            <button
              onClick={() => handleSendMessage(userInput)}
              className="h-10 w-10 bg-primary hover:bg-primary-container text-white rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 duration-150 transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}

      {/* Primary Floating Action Button with toggle logic */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 animate-bounce cursor-pointer border border-white/20"
        title="Speak with SewaBot AI support"
      >
        <MessageSquare size={24} className={isOpen ? "rotate-90 duration-300" : ""} />
      </button>

    </div>
  );
};
