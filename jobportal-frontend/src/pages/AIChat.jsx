import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { chatWithAI } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

const STARTERS = [
  "How should I structure a resume for a fresher role?",
  "What questions should I ask a recruiter about a job offer?",
  "How do I explain a career gap in an interview?",
];

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm your Orbit career assistant. Ask me about resumes, interviews, or your job search.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(text) {
    const prompt = (text ?? input).trim();
    if (!prompt || sending) return;
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setSending(true);
    try {
      const reply = await chatWithAI(prompt);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      toast.error(extractErrorMessage(err));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the AI service just now." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send();
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-2xl flex-col md:h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="font-display flex items-center gap-2 text-2xl font-semibold">
          <Sparkles size={20} className="text-cyan" /> Career chatbot
        </h1>
        <p className="mt-1 text-sm text-muted">Powered by Gemini via your backend's AI service.</p>
      </div>

      <GlassCard strong className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} username={user?.username} />
            ))}
            {sending && <ChatBubble role="assistant" text="…" typing />}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div className="mt-6 flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl glass px-4 py-2.5 text-left text-sm text-muted hover:text-ink hover:bg-white/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resumes, interviews, career moves…"
            className="flex-1 rounded-xl bg-white/5 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:bg-white/10"
          />
          <Button type="submit" loading={sending} disabled={!input.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}

function ChatBubble({ role, text, username, typing }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-gradient-to-br from-cyan to-violet" : "bg-gradient-to-br from-violet to-magenta"
        } text-white`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-gradient-to-r from-violet/40 to-magenta/30 text-ink"
            : "glass text-ink/90"
        }`}
      >
        {typing ? (
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
          </span>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
