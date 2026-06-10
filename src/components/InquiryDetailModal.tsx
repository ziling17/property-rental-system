import React, { useState, useRef, useEffect } from 'react';
import { X, Send, CheckCircle, Sparkles } from 'lucide-react';
import { Inquiry, ChatMessage } from '../types';

interface InquiryDetailModalProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (inquiryId: string, replyText: string) => void;
}

export default function InquiryDetailModal({
  inquiry,
  isOpen,
  onClose,
  onSendReply
}: InquiryDetailModalProps) {
  const [replyText, setReplyText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [inquiry?.messages]);

  if (!isOpen || !inquiry) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(inquiry.id, replyText);
    setReplyText('');
  };

  const handleSelectTemplate = (templateText: string) => {
    setReplyText(templateText);
  };

  const generateAISmartReply = () => {
    setIsDrafting(true);
    // Simulate smart agent writing a reply based on landlord context and tenant inquiry content
    setTimeout(() => {
      let draftText = '';
      if (inquiry.id === 'inq-1') {
        draftText = `Hi James, I would be happy to show you around Grandview Heights on Saturday at 2 PM! Let's meet at the main lobby entrance on 425 Skyview Terrace. Looking forward to showing you the flat!`;
      } else if (inquiry.id === 'inq-2') {
        draftText = `Hi Elena! Yes, the Willow Creek Suite is pet-friendly. We love small dog breeds including Goldendoodles! There is a one-time refundable pet deposit of $250. Let me know if you would like to schedule a viewing!`;
      } else if (inquiry.id === 'inq-3') {
        draftText = `Hi Michael, I can absolutely add that holidays access clause to your Emerald Plaza contract draft. Let's make sure it is formalized in Version 2, which I can send over this Friday afternoon!`;
      } else {
        draftText = `Hi ${inquiry.senderName}, thank you for reaching out! I would be glad to help answer your question regarding ${inquiry.propertyName}. Please let me know what day works best for you to discuss!`;
      }
      setReplyText(draftText);
      setIsDrafting(false);
    }, 600);
  };

  const quickTemplates = [
    { label: 'Schedule Visit', text: `Hi, thank you for your interest! Saturday afternoon works great for walk-throughs. Let's meet at the main lobby area. Let me know if that works!` },
    { label: 'Discuss Pet Policy', text: `Hi! Yes, the property is fully pet-friendly for small and medium-sized dogs. There is a standard refundable $200 deposit. Tell me more about your pet!` },
    { label: 'Confirm Lease Term', text: `Hi, I received your query regarding the lease agreement terms! I would be happy to add the requested holiday-hours clauses. We can finalize the sign-off soon.` }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div 
        id="inquiry-modal-content"
        className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full flex flex-col md:max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              Conversation with {inquiry.senderName}
              {inquiry.status === 'replied' && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Replied
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Regarding: <span className="font-medium text-blue-700">{unfudgeName(inquiry.propertyName)}</span></p>
          </div>
          <button 
            id="close-inquiry-modal-btn"
            onClick={onClose} 
            className="p-1 px-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conversation flow */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/70 min-h-[250px] max-h-[380px] space-y-4">
          <div className="text-center">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              Inquiry submitted on {inquiry.propertyName}
            </span>
          </div>

          {inquiry.messages.map((msg) => {
            const isTenant = msg.sender === 'tenant';
            return (
              <div 
                key={msg.id} 
                className={`flex ${isTenant ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                  isTenant 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span className={`text-[10px] mt-1.5 block ${isTenant ? 'text-gray-400' : 'text-blue-200'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Reply Area and Templates */}
        <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <span className="text-xs text-gray-400 font-medium mr-1">Quick replies:</span>
            {quickTemplates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(tpl.text)}
                className="text-xs border border-gray-200 rounded-full px-2.5 py-1 bg-gray-50 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                {tpl.label}
              </button>
            ))}

            <button
              type="button"
              onClick={generateAISmartReply}
              disabled={isDrafting}
              className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-3 py-1 text-amber-700 hover:text-amber-800 transition-all cursor-pointer flex items-center gap-1 font-medium ml-auto"
            >
              <Sparkles size={12} className="text-amber-500 animate-pulse" />
              {isDrafting ? 'Drafting...' : 'AI Smart Draft'}
            </button>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <textarea
              id="reply-textarea-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write a custom message for ${inquiry.senderName}...`}
              rows={3}
              className="flex-1 rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
            <button
              id="send-reply-icon-btn"
              type="submit"
              disabled={!replyText.trim()}
              className={`p-3 rounded-xl flex items-center justify-center self-end transition-all cursor-pointer ${
                replyText.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-300 pointer-events-none'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-3 flex justify-between text-[11px] text-gray-400">
            <span>Replying as: <span className="font-semibold text-gray-600">Sarah Jenkins</span></span>
            <span>Tenant Email: <span className="font-semibold text-gray-600">{inquiry.senderEmail}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to expand property shortname securely
function unfudgeName(shortName: string) {
  if (shortName === 'Grandview H.') return 'Grandview Heights';
  return shortName;
}
