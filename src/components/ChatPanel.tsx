import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ExternalLink } from "lucide-react";
import agilowIcon from "@/assets/agilow-a-icon.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: string; label: string }[];
}

const sampleResponses: Record<string, { content: string; sources: { type: string; label: string }[] }> = {
  default: {
    content:
      "Based on the aggregated data from your team's Slack channels, Jira board, and recent meeting transcripts, here's what I found:\n\n**Project Phoenix** is currently on track with 78% completion. The main risk is a dependency on the API team for the authentication module.\n\nWould you like me to drill down into any specific area?",
    sources: [
      { type: "slack", label: "Slack #project-phoenix" },
      { type: "jira", label: "JIRA PHX-234" },
    ],
  },
};

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Project Context Engine. Ask me anything about your projects, team activity, or past decisions. I'll pull from Slack, Jira, email, and meeting transcripts to give you verified answers.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const resp = sampleResponses.default;
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: resp.content, sources: resp.sources },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed right-0 top-0 h-screen w-[420px] bg-card border-l border-border shadow-elevated z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <div className="flex items-center gap-2.5">
              <img src={agilowIcon} alt="" className="w-7 h-7 rounded-md bg-primary p-0.5" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Agilow Chat</h3>
                <p className="text-xs text-muted-foreground">Project Context Engine</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm"
                      : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.sources.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs bg-background/60 text-muted-foreground px-2 py-0.5 rounded-full"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
              <Sparkles className="w-4 h-4 text-agilow-teal shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about any project..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
