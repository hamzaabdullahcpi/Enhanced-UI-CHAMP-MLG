import { motion } from "motion/react";
import { LayoutDashboard, Target, Building2, Network, Coins, TrendingUp, User, BookOpen, X } from "lucide-react";

interface SidebarProps {
  currentStep: number | 'intro';
  setCurrentStep: (step: number | 'intro') => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ currentStep, setCurrentStep, isOpen, toggleSidebar }: SidebarProps) {
  const navItems: { id: number | 'intro', label: string, icon: any }[] = [
    { id: 0, label: "Dashboard", icon: LayoutDashboard },
    { id: 'intro', label: "Introduction", icon: BookOpen },
    { id: 1, label: "1. Assess Environments", icon: Target },
    { id: 2, label: "2. Institutionalize MLG", icon: Building2 },
    { id: 3, label: "3. Build Pipelines", icon: Network },
    { id: 4, label: "4. Mobilize Finance", icon: Coins },
    { id: 5, label: "5. Scale Systems", icon: TrendingUp },
  ];

  return (
    <div className={`w-72 h-screen bg-paper border-r border-line flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 md:p-8 border-b border-line flex justify-between items-start">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-ink leading-none">
            CHAMP<br/>Toolkit
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-3 uppercase tracking-wider font-semibold">
            Multilevel Governance
          </p>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 text-ink-muted hover:text-ink transition-colors"
          aria-label="Close Sidebar"
        >
          <X size={20} className="stroke-[1.5]" />
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentStep === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentStep(item.id)}
              className={`w-full flex items-center gap-4 px-8 py-4 text-sm transition-all duration-200 relative border-b border-line/50 last:border-b-0 ${
                isActive
                  ? "bg-accent text-surface"
                  : "text-ink-muted hover:bg-surface hover:text-ink"
              }`}
            >
              <Icon size={18} className={`stroke-[1.5] ${isActive ? "text-surface" : "text-ink-muted"}`} />
              <span className={`text-left font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-line bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-accent/5 flex items-center justify-center border border-line">
            <User size={16} className="text-accent stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">Focal Point</p>
            <p className="text-sm font-semibold text-ink truncate font-heading italic">Ministry of Finance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
