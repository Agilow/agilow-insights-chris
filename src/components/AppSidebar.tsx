import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import agilowLogo from "@/assets/agilow-logo-full.png";
import agilowIcon from "@/assets/agilow-a-icon.png";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Project Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Reports", icon: BarChart3, path: "/reports" },
  { title: "Chat", icon: MessageSquare, path: "/chat" },
];

const bottomItems = [
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border shrink-0">
        {(!collapsed || mobile) ? (
          <img src={agilowLogo} alt="Agilow" className="h-8 object-contain" />
        ) : (
          <img src={agilowIcon} alt="Agilow" className="w-8 h-8 rounded-md" />
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!collapsed || mobile) && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 space-y-1 border-t border-sidebar-border shrink-0">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {(!collapsed || mobile) && <span>{item.title}</span>}
          </Link>
        ))}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors w-full"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button — shown in page headers via exported component */}
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-primary text-primary-foreground transition-transform duration-300 ease-in-out w-[240px] md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-primary text-primary-foreground transition-all duration-300 ease-in-out h-screen sticky top-0 shrink-0",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile top bar trigger — exported as a portal target */}
      <button
        id="mobile-menu-trigger"
        onClick={() => setMobileOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>
    </>
  );
}

export function MobileMenuButton() {
  return (
    <button
      onClick={() => {
        const trigger = document.getElementById("mobile-menu-trigger");
        trigger?.click();
      }}
      className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
}

