import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { landingPageData, stepsData } from "../data/content";
import { ArrowRight, Globe, FileText, TrendingUp, ExternalLink, HelpCircle, Target, Rocket, CheckCircle2 } from "lucide-react";

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isInView) return;
    
    const match = value.match(/^([^0-9]*)([0-9.]+)([^0-9]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }
    
    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];
    const target = parseFloat(numStr);
    const isFloat = numStr.includes('.');
    
    let startTimestamp: number;
    const duration = 2000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * target;
      
      if (isFloat) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

interface LandingPageProps {
  onStart: () => void;
  onIntro: () => void;
}

export default function LandingPage({ onStart, onIntro }: LandingPageProps) {
  const icons = [Globe, FileText, TrendingUp];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-24 md:py-32 flex flex-col items-center text-center border-b border-line mb-16"
      >
        <div className="border border-line bg-surface px-6 py-2 mb-10 text-sm font-semibold text-ink-muted">
          Operational Manual for National Governments
        </div>
        
        <h1 className="font-heading text-6xl md:text-[5.5rem] font-semibold tracking-tight leading-[1.05] mb-8">
          <span className="text-ink">CHAMP Toolkit: Financing</span><br/>
          <span className="text-ink-muted italic font-normal">Climate Action</span>
        </h1>
        
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <p className="text-xl md:text-2xl text-ink leading-relaxed font-light">
            Aligning national climate planning with local financial delivery through <strong className="font-semibold">Multilevel Governance (MLG)</strong>.
          </p>
          <p className="text-lg text-ink-muted leading-relaxed font-light">
            Explore a <strong className="text-ink">5-step journey to Multilevel Governance</strong>. This stepwise path is sequenced to cover the entire spectrum of actions needed to operationalize MLG, yet remains flexible—allowing countries to enter at different starting points based on their current readiness and national context.
          </p>
        </div>
        
        {/* Flowing MLG Journey Graphic */}
        <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-5xl mx-auto mb-20 border border-line bg-paper">
          {[
            { num: "01", label: "Assess Environments", goal: stepsData[0].goal },
            { num: "02", label: "Institutionalize MLG", goal: stepsData[1].goal },
            { num: "03", label: "Build Pipelines", goal: stepsData[2].goal },
            { num: "04", label: "Mobilize Finance", goal: stepsData[3].goal },
            { num: "05", label: "Scale & Enhance", goal: stepsData[4].goal }
          ].map((step, i) => (
            <div key={i} className={`flex flex-col flex-1 p-6 relative group ${i < 4 ? 'border-r border-line' : ''} hover:bg-surface transition-colors cursor-pointer`}>
              <span className="font-heading text-accent text-xl font-semibold mb-4">{step.num}</span>
              <span className="text-base font-semibold text-ink leading-snug">{step.label}</span>

              {/* Tooltip */}
              <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 w-64 bg-ink text-surface text-xs p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 shadow-xl pointer-events-none text-center leading-relaxed font-light border border-line">
                {step.goal}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="inline-flex items-center gap-4 bg-ink text-surface px-10 py-5 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Start the 5-Step Journey
            <ArrowRight size={16} />
          </motion.button>
          
          <button
            onClick={onIntro}
            className="text-sm font-medium text-ink-muted hover:text-ink transition-colors border-b border-transparent hover:border-ink pb-1"
          >
            Or read the Introduction first
          </button>
        </div>
      </motion.div>

      {/* Interactive Data Dashboard */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
          {landingPageData.dashboard.map((item, index) => {
            const Icon = icons[index];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface p-12 hover:bg-paper transition-colors group relative"
              >
                <div className="mb-10 text-accent opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all origin-left">
                  <Icon size={28} className="stroke-[1.5]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-ink-muted mb-4">{item.title}</h3>
                  <div className="font-heading text-5xl md:text-6xl text-ink mb-6 tracking-tight">
                    <AnimatedCounter value={item.value} />
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed font-light">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toolkit Context Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
          <h2 className="font-heading text-4xl text-ink tracking-tight max-w-lg">The Strategic Context</h2>
          <p className="text-ink-muted font-light max-w-md md:text-right leading-relaxed">Understanding the rationale, outcomes, and impact of the CHAMP Multilevel Governance Toolkit.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
          {landingPageData.toolkitContext.map((ctx, idx) => (
            <div key={idx} className="bg-surface p-10 flex flex-col">
              <div className="mb-8">
                <h3 className="font-heading text-2xl text-ink leading-snug">{ctx.question}</h3>
              </div>
              <ul className="space-y-6">
                {ctx.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-accent mt-2.5 shrink-0 rotate-45" />
                    <span className="text-[15px]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* COP 30 Context */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-ink p-10 md:p-16 mb-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16 border border-line"
      >
        <div className="relative z-10 md:w-1/2">
          <div className="inline-flex items-center gap-3 border border-surface/20 px-4 py-2 mb-10 text-sm font-medium text-surface/80">
            <Globe size={14} className="stroke-[1.5]" />
            COP 30 Belém Context
          </div>
          
          <h2 className="font-heading text-5xl md:text-6xl text-surface mb-8 leading-[1.1] tracking-tight">
            Global Momentum<br/>
            <span className="text-surface/40 italic">Toward COP 30</span>
          </h2>
          
          <p className="text-lg text-surface/60 leading-relaxed mb-12 max-w-lg font-light">
            {landingPageData.cop30Context}
          </p>
          
          <button className="bg-surface text-ink px-8 py-4 text-sm font-semibold hover:bg-surface/90 transition-colors inline-flex items-center gap-4">
            Learn more about COP 30 <ArrowRight size={16} />
          </button>
        </div>

        <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            initial={{ rotate: -2, y: 20 }}
            whileInView={{ rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-72 h-72 md:w-[450px] md:h-[450px] bg-[#0A0A0A] border border-surface/10 overflow-hidden relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80" 
              alt="City Infrastructure" 
              className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-700 mix-blend-luminosity hover:mix-blend-normal"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </motion.div>


    </div>
  );
}
