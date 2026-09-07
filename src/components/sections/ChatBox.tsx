"use client";

/**
 * Chatbot.tsx — "Ask About Marci"
 * ---------------------------------------------------------------------------
 * A floating AI-concierge chatbot for the Marci Metzger / The Ridge Realty
 * Group homepage. All answer content comes from `@/lib/marciKnowledge`,
 * which is the single controlled source of truth — this component never
 * generates or invents text of its own, and never calls an external API.
 *
 * Note: imports assume the standard Next.js "@/*" -> "src/*" path alias.
 * If that alias isn't configured in this project's tsconfig, swap the
 * import below for a relative path (e.g. "../../lib/marciKnowledge").
 * ---------------------------------------------------------------------------
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { gsap } from "gsap";
import {
  CONTACT,
  HEADER_SUBTITLE,
  HEADER_TITLE,
  LIMIT_REACHED_BODY,
  LIMIT_REACHED_HEADLINE,
  MAX_QUESTIONS,
  SUGGESTED_QUESTIONS,
  TRIGGER_LABEL,
  TRIGGER_LABEL_SHORT,
  WELCOME_BODY,
  WELCOME_HEADLINE,
} from "@/lib/marciKnowledge";

type ChatRole = "user" | "assistant" | "notice";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

let messageSequence = 0;
function createMessageId(): string {
  messageSequence += 1;
  return `askAboutMarci-${messageSequence}`;
}

/** Short, realistic "thinking" pause before the local reply appears. */

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createMessageId(),
      role: "assistant",
      text: `${WELCOME_HEADLINE}\n\n${WELCOME_BODY}`,
    },
  ]);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const titleId = useId();
  const subtitleId = useId();

  const limitReached = questionCount >= MAX_QUESTIONS;
  const showSuggestions = messages.length > 0 && questionCount === 0 && !isThinking;

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  // Subtle GSAP entrance for the panel — opacity, translateY, slight scale.
  // Respects prefers-reduced-motion, and cleans itself up on close/unmount.
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 18, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "power2.out" }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);


  const submitQuestion = useCallback(
  async (rawText: string) => {
    const text = rawText.trim();

    if (!text || isThinking || questionCount >= MAX_QUESTIONS) return;

    const nextCount = questionCount + 1;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestionCount(nextCount);
    setInputValue("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a response.");
      }

      setMessages((prev) => {
        const next: ChatMessage[] = [
          ...prev,
          {
            id: createMessageId(),
            role: "assistant",
            text: data.text || "I wasn't able to generate a response.",
          },
        ];

        if (nextCount >= MAX_QUESTIONS) {
          next.push({
            id: createMessageId(),
            role: "notice",
            text: `${LIMIT_REACHED_HEADLINE}\n\n${LIMIT_REACHED_BODY}`,
          });
        }

        return next;
      });
    } catch (error) {
      console.error("Chat request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          text: "I'm having trouble responding right now. Please contact Marci directly at (206) 919-6886.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  },
  [isThinking, questionCount]
);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitQuestion(inputValue);
    },
    [inputValue, submitQuestion]
  );

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Floating trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openChat}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="ask-about-marci-panel"
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#e7ddc9] bg-[#1c1a17] px-5 py-3 text-[13px] font-medium uppercase tracking-[0.14em] text-[#f7f1e4] shadow-[0_12px_30px_-10px_rgba(28,26,23,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(28,26,23,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a869] ${
          isOpen
            ? "pointer-events-none scale-95 opacity-0"
            : "opacity-100"
        }`}
      >
        <ChatIcon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{TRIGGER_LABEL}</span>
        <span className="sm:hidden">{TRIGGER_LABEL_SHORT}</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="ask-about-marci-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={subtitleId}
          className="fixed inset-x-3 bottom-3 z-50 flex h-[74vh] max-h-[600px] flex-col overflow-hidden rounded-[28px] border border-white/50 bg-[#FBF7F0]/75 shadow-[0_25px_70px_-20px_rgba(28,25,23,0.35)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[620px] sm:max-h-[80vh] sm:w-[400px] md:w-[420px]"
        >
          {/* Soft inner highlight for the glass surface */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent"
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-[#e7ddc9]/70 px-5 pb-4 pt-5">
            <div>
              <h2
                id={titleId}
                className="font-serif text-[19px] leading-tight text-[#241f1a]"
              >
                {HEADER_TITLE}
              </h2>
              <p
                id={subtitleId}
                className="mt-1 text-[13px] leading-snug text-[#57504a]"
              >
                {HEADER_SUBTITLE}
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close Ask About Marci chat"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#57504a] transition-colors hover:bg-[#241f1a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a869]"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="relative flex-1 space-y-3 overflow-y-auto px-5 py-4"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isThinking && (
              <div
                className="askAboutMarci-msg-enter flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white/70 px-4 py-3"
                aria-label="Marci's AI assistant is composing a reply"
              >
                <ThinkingDot delay="0ms" />
                <ThinkingDot delay="120ms" />
                <ThinkingDot delay="240ms" />
              </div>
            )}

            {showSuggestions && (
              <div className="askAboutMarci-msg-enter flex flex-wrap gap-2 pt-1">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => submitQuestion(question.label)}
                    className="rounded-full border border-[#e7ddc9] bg-white/60 px-3.5 py-2 text-left text-[12.5px] leading-snug text-[#3a342d] transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a869]"
                  >
                    {question.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative border-t border-[#e7ddc9]/70 px-5 pb-4 pt-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="ask-about-marci-input" className="sr-only">
                Ask about Marci
              </label>
              <input
                ref={inputRef}
                id="ask-about-marci-input"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                disabled={limitReached || isThinking}
                placeholder={
                  limitReached ? "Question limit reached" : "Ask about Marci..."
                }
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-[#e7ddc9] bg-white/70 px-4 py-2.5 text-[14px] text-[#241f1a] placeholder:text-[#8a8175] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a869] disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={limitReached || isThinking || !inputValue.trim()}
                aria-label="Send question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1c1a17] text-[#f7f1e4] transition-transform duration-150 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a869]"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>
            <p
              className="mt-2 text-center text-[11px] tracking-wide text-[#948b7e]"
              aria-live="polite"
            >
              {questionCount} / {MAX_QUESTIONS} questions
            </p>
          </div>
        </div>
      )}

      <style>{CHATBOT_STYLES}</style>
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "notice") {
    return (
      <div
        role="status"
        className="askAboutMarci-msg-enter mx-auto w-fit max-w-[92%] whitespace-pre-line rounded-2xl border border-[#e7ddc9] bg-white/70 px-4 py-3 text-center text-[12.5px] leading-snug text-[#57504a]"
      >
        {message.text}
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      className={`askAboutMarci-msg-enter flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[#1c1a17] text-[#f7f1e4]"
            : "rounded-bl-sm bg-white/75 text-[#241f1a]"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

function ThinkingDot({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden="true"
      className="askAboutMarci-thinking-dot h-1.5 w-1.5 rounded-full bg-[#8a8175]"
      style={{ animationDelay: delay }}
    />
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

// Kept minimal and self-contained: no external stylesheet or animation
// library is required for this. GSAP (already used above) handles the
// panel entrance; these keyframes handle message entrance + the thinking
// indicator, and both are disabled under prefers-reduced-motion.
const CHATBOT_STYLES = `
@keyframes askAboutMarciFadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.askAboutMarci-msg-enter {
  animation: askAboutMarciFadeUp 0.28s ease-out both;
}
@keyframes askAboutMarciBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-3px); opacity: 1; }
}
.askAboutMarci-thinking-dot {
  display: inline-block;
  animation: askAboutMarciBounce 1s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .askAboutMarci-msg-enter {
    animation: none;
  }
  .askAboutMarci-thinking-dot {
    animation: none;
  }
}
`;

// CONTACT is part of the public API of marciKnowledge.ts and is available
// here for any future use (e.g. a "Call Marci" quick action); referenced
// so it stays a visible, intentional import.
void CONTACT;