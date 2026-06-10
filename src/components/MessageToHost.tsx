/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface MessageProps {
  message: string;
  onChangeMessage: (msg: string) => void;
}

const TEMPLATES = [
  "Hi, I'm a professional relocating to KL for work. Looking forward to staying here!",
  "Hello, I'm interest in a 1-year tenancy. I keep apartments exceptionally clean.",
  "Hi host, could you let me know if there's secure covered parking included?",
];

export default function MessageToHost({ message, onChangeMessage }: MessageProps) {
  return (
    <div 
      id="message-to-host-box" 
      className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-outline-variant/10 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Message to Host
        </span>
        <span className="text-[10px] text-on-surface-variant/70 font-mono">
          {message.length} chars (Recommended &gt; 20)
        </span>
      </div>
      
      <p className="text-xs text-on-surface-variant leading-relaxed">
        Let the host know more about your occupation, when you intend to check-in, or ask any leasing policy queries. We'll secure these messages into your escrow draft.
      </p>

      {/* Text Area */}
      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          className="w-full min-h-[110px] p-4 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all outline-none resize-none"
          placeholder="Type your message here..."
        />
      </div>

      {/* Suggested Quick Templates */}
      <div className="space-y-1.5 pt-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50">
          Suggested Templates
        </p>
        <div className="flex flex-col gap-1.5 sm:flex-row">
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeMessage(tmpl)}
              className="text-left text-[11px] text-primary hover:text-on-primary-fixed-variant bg-surface-container-low hover:bg-surface-container-high transition-all p-2 rounded-lg truncate cursor-pointer sm:flex-1 font-medium"
              title={tmpl}
            >
              "{tmpl}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
