import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Plug,
  CheckCircle2,
  Circle,
  Shield,
  Users,
  Palette,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatPanel } from "@/components/ChatPanel";

const integrations = [
  { name: "Slack", description: "Channels, DMs, and thread analysis", connected: true, icon: "💬" },
  { name: "Jira", description: "Tickets, comments, and sprint data", connected: true, icon: "📋" },
  { name: "Gmail", description: "Email threads and attachments", connected: false, icon: "📧" },
  { name: "Zoom", description: "Meeting transcripts and recordings", connected: false, icon: "📹" },
  { name: "Confluence", description: "Documentation and wiki pages", connected: true, icon: "📖" },
  { name: "GitHub", description: "PRs, issues, and code discussions", connected: false, icon: "🐙" },
];

const Settings = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"integrations" | "team" | "preferences" | "security">("integrations");

  const tabs = [
    { id: "integrations" as const, label: "Integrations", icon: Plug },
    { id: "team" as const, label: "Team", icon: Users },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <h2 className="text-sm font-bold text-foreground">Settings</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Agilow
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[900px]">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage integrations, team access, and preferences
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 mb-6 bg-secondary rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Integrations */}
          {activeTab === "integrations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Data Sources (MCP)</h3>
                  <p className="text-xs text-muted-foreground">
                    Connect your tools to enable context aggregation
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {integrations.filter((i) => i.connected).length}/{integrations.length} connected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrations.map((integration, i) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 flex items-center justify-between hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-status-success">
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </span>
                    ) : (
                      <button className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
                        <Circle className="w-3 h-3" /> Connect
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-semibold text-foreground mb-2">Team Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage team members, roles, and access permissions. This feature will be available once you connect your organization's identity provider.
              </p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Configure SSO
              </button>
            </motion.div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground mb-2">Display Preferences</h3>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Default dashboard view</p>
                  <p className="text-xs text-muted-foreground">Choose your landing page layout</p>
                </div>
                <select className="bg-secondary text-foreground text-sm rounded-lg px-3 py-1.5 outline-none border border-border">
                  <option>Executive Health</option>
                  <option>Engineering Velocity</option>
                  <option>Custom</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Notification frequency</p>
                  <p className="text-xs text-muted-foreground">How often to surface risk alerts</p>
                </div>
                <select className="bg-secondary text-foreground text-sm rounded-lg px-3 py-1.5 outline-none border border-border">
                  <option>Real-time</option>
                  <option>Hourly digest</option>
                  <option>Daily summary</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-semibold text-foreground mb-2">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All data is encrypted at rest and in transit. The system mirrors source tool permissions — if you can't access a private Slack channel, the PCE won't use it.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  Zero-inference permissions enforced
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  AES-256 encryption at rest
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  SOC 2 Type II compliance
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Settings;
