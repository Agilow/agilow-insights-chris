import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, ExternalLink, Search, Bell } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import agilowIcon from "@/assets/agilow-a-icon.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: string; label: string }[];
}

const suggestedQueries = [
  "What's the status of Project Phoenix?",
  "Why did we postpone OAuth to Phase 2?",
  "Which teams are blocked right now?",
  "Show me decisions flagged as lessons learned",
  "What's our sprint velocity trend?",
  "Are there any risk alerts I should know about?",
];

const sampleResponses: Record<string, { content: string; sources: { type: string; label: string }[] }> = {
  default: {
    content:
      "Based on the aggregated data from your team's Slack channels, Jira board, and recent meeting transcripts, here's what I found:\n\n**Project Phoenix** is currently on track with 78% completion. The main risk is a dependency on the API team for the authentication module.\n\n**API Migration v3** is at risk — 3 teams are blocked on an auth endpoint due to outdated vendor documentation.\n\nWould you like me to drill down into any specific area?",
    sources: [
      { type: "slack", label: "Slack #project-phoenix" },
      { type: "jira", label: "JIRA PHX-234" },
      { type: "meeting", label: "Standup Feb 24" },
    ],
  },
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm the Agilow Project Context Engine. I can help you understand project status, find decision rationale, track team effort, and surface risks — all by aggregating data from Slack, Jira, email, and meeting transcripts.\n\nWhat would you like to know?",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
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
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={agilowIcon} alt="" className="w-7 h-7 rounded-md bg-primary p-0.5" />
            <div>
              <h2 className="text-sm font-bold text-foreground">Agilow Chat</h2>
              <p className="text-xs text-muted-foreground">Project Context Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col max-w-[800px] w-full mx-auto">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] text-sm"
                      : "bg-card border border-border text-card-foreground rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] text-sm shadow-soft"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.sources.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full hover:bg-secondary/80 cursor-pointer transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested queries — show only at start */}
            {messages.length === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about projects, decisions, risks, team activity..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
