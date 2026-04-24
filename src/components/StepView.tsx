import { useState, useEffect } from "react";
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Sparkles, CheckCircle2, ExternalLink, ShieldCheck, MapPin, Building2, Globe2, X, FileText, ArrowRight, Tag, AlertCircle, FileSearch, Banknote, Map, Landmark, Database, Users, BookOpen } from "lucide-react";
import { identifyStakeholders, generateContextualizedPlan, AiContextData } from "../services/geminiService";

const COUNTRIES = [
  "Brazil", "United States", "India", "Germany", "South Africa",
  "Kenya", "Indonesia", "Mexico", "Colombia", "United Kingdom",
  "France", "Japan", "Australia", "Canada", "Nigeria", "Egypt"
].sort();

const PARTNER_TYPES = [
  "Multilateral Development Bank (MDB)",
  "Non-Governmental Organization (NGO)",
  "City Network",
  "Bilateral Donor",
  "Philanthropy",
  "Private Investor",
  "UN Agency"
];

function PartnerModal({ partnerData, onClose }: { partnerData: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-white border border-line shadow-2xl overflow-hidden flex flex-col rounded-xl"
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-line bg-paper">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-ink pr-8">{partnerData.name}</h3>
          <button onClick={onClose} className="p-2 border border-line hover:bg-surface rounded-full text-ink-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto bg-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerData.subPartners.map((sub: any) => (
              <a
                key={sub.name}
                href={sub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-paper border border-line hover:border-slate-300 hover:bg-white rounded-lg transition-all group"
              >
                <span className="text-sm font-semibold text-ink group-hover:text-blue-600 transition-colors">{sub.name}</span>
                <ExternalLink size={16} className="text-ink-muted shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContextModal({ item, onClose }: { item: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-ink pr-8 leading-tight">{item.title}</h3>
          <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">{item.intro}</p>
            <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
              {item.fullText.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {item.reports && item.reports.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                Key Partner Reports
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.reports.map((report: any, idx: number) => (
                  <a key={idx} href={report.link} target="_blank" rel="noopener noreferrer" className="group p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col justify-between h-full">
                    <div>
                      <span className="text-xs font-bold text-blue-600 mb-2 block uppercase tracking-wider">{report.partner}</span>
                      <h5 className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors leading-snug">{report.title}</h5>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                      Read Report <ArrowRight size={16} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function UnifiedContextCard({ data }: { data: any }) {
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null);

  const opportunityIcons = [Map, Landmark, Database, Users];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-12">
      {/* What is this step */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-heading text-2xl font-bold text-ink mb-4">What is this step</h2>
        <p className="text-slate-700 leading-relaxed text-lg">{data.whatIsThisStep}</p>
      </div>

      {/* Opportunities */ }
      <div className="flex flex-col divide-y divide-slate-100">
        
        {/* Opportunities */}
        <div className="p-8 pt-10 bg-slate-50/30">
          <h2 className="font-heading text-xl font-bold text-ink mb-6">What opportunities this step presents</h2>
          <div className="space-y-4">
            {data.opportunities.map((item: any, idx: number) => {
              const Icon = opportunityIcons[idx % opportunityIcons.length];
              return (
              <div key={idx} className="border border-line bg-surface hover:bg-paper transition-colors rounded-none">
                <button
                  className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setExpandedOpportunity(expandedOpportunity === idx ? null : idx)}
                >
                  <div className="flex items-center gap-4 pr-6">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
                      <Icon size={20} className="stroke-[1.5]" />
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-ink m-0 leading-snug font-sans">{item.title}</h3>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-none border border-line flex items-center justify-center transition-transform duration-300 ${expandedOpportunity === idx ? 'rotate-180 bg-line' : ''}`}>
                    <ChevronDown size={18} className="stroke-[1.5] text-ink" />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedOpportunity === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-line bg-surface">
                        <p className="text-ink font-bold mb-4 leading-relaxed mt-4 text-sm md:text-base">{item.shortText}</p>
                        <div className="space-y-4 text-ink-muted leading-relaxed text-sm md:text-base font-light">
                          {item.expandedText.map((p: string, pIdx: number) => (
                             <p key={pIdx}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="p-8 md:p-10 border-t border-line">
        <h2 className="font-sans text-lg font-semibold text-ink mb-6">Key Resources</h2>
        <div className="flex flex-wrap gap-4">
          {data.resources.map((res: any, idx: number) => (
            <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="group px-5 py-4 border border-line hover:border-ink hover:bg-paper transition-all flex items-center gap-4 basis-full md:basis-[calc(50%-0.5rem)]">
              <div className="text-accent opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                <FileText size={20} className="stroke-[1.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-accent mb-1 block truncate">{res.name}</span>
                <h5 className="font-sans text-sm font-medium text-ink leading-snug line-clamp-2">{res.title}</h5>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextCard({ item }: { item: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="bg-surface border-none p-8 md:p-10 flex flex-col h-full relative group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        <h3 className="font-heading font-semibold text-ink text-2xl mb-4 leading-snug">{item.title}</h3>
        <p className="text-ink-muted leading-relaxed font-light mb-8 flex-1">{item.intro}</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-between w-full py-3 text-ink font-semibold transition-colors border-t border-line group-hover:border-accent group-hover:text-accent"
        >
          <span className="font-mono text-[11px] tracking-widest uppercase">Know more</span>
          <ArrowRight size={16} />
        </button>
      </div>
      <AnimatePresence>
        {isModalOpen && <ContextModal item={item} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function RecommendationCard({ rec, stepTitle }: { rec: any; stepTitle: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [form, setForm] = useState<AiContextData>({ country: '', city: '', partnerType: '' });
  
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [plan, setPlan] = useState<string | null>(null);
  const [phase, setPhase] = useState<'setup' | 'stakeholders' | 'plan'>('setup');

  const isNational = rec.actor === "National Governments";
  const isCity = rec.actor === "Cities & Subnationals";
  const isPartner = rec.actor === "International Partners";

  const isFormValid = () => {
    if (isNational) return form.country!.trim() !== '';
    if (isCity) return form.country!.trim() !== '' && form.city!.trim() !== '';
    if (isPartner) return form.partnerType!.trim() !== '' && form.country!.trim() !== '';
    return false;
  };

  const handleIdentifyStakeholders = async () => {
    if (!isFormValid()) return;
    setIsIdentifying(true);
    setError(null);
    try {
      const result = await identifyStakeholders(rec.points, rec.actor, form);
      setStakeholders(result);
      setPhase('stakeholders');
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (stakeholders.length === 0) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateContextualizedPlan(rec.points, rec.actor, form, stakeholders);
      setPlan(result);
      setPhase('plan');
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeStakeholder = (indexToRemove: number) => {
    setStakeholders(stakeholders.filter((_, idx) => idx !== indexToRemove));
  };

  const addStakeholder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setStakeholders([...stakeholders, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div className="bg-surface border border-line rounded-none">
      <div className="flex justify-between items-center cursor-pointer p-6 md:p-8 hover:bg-paper transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className="text-accent opacity-80">
            {isNational && <ShieldCheck size={24} className="stroke-[1.5]" />}
            {isCity && <MapPin size={24} className="stroke-[1.5]" />}
            {isPartner && <Globe2 size={24} className="stroke-[1.5]" />}
          </div>
          <span className="font-heading font-semibold text-ink text-2xl">{rec.actor}</span>
        </div>
        <div className={`w-8 h-8 rounded-none border border-line bg-paper flex items-center justify-center shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-line text-ink' : 'text-ink-muted'}`}>
          <ChevronDown size={18} className="stroke-[1.5]" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 pt-2">
              <h4 className="text-sm font-semibold text-slate-900 border-b border-line pb-2 mb-6 flex items-center gap-2">Core Recommendations</h4>
              <ul className="space-y-4">
                {rec.points.map((p: string, idx: number) => (
                  <li key={idx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <span className="font-mono text-xs font-semibold text-accent mt-1.5 shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Contextualization Form */}
            <div className="mx-6 md:mx-8 mb-8 p-6 md:p-8 bg-paper border border-line">
              <h4 className="text-sm font-semibold text-ink mb-6 flex items-center gap-3">
                <Sparkles size={14} className="text-accent"/> 
                Contextualize with AI
              </h4>
              
              {phase === 'setup' && (
                <div className="space-y-5">
                  {isNational && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Country <span className="text-red-500">*</span></label>
                      <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                        <option value="">Select Country...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                  {isCity && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Country <span className="text-red-500">*</span></label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                          <option value="">Select Country...</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enter City <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="e.g. São Paulo" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                      </div>
                    </div>
                  )}
                  {isPartner && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Country <span className="text-red-500">*</span></label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                          <option value="">Select Country...</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Partner Type <span className="text-red-500">*</span></label>
                        <select value={form.partnerType} onChange={e => setForm({...form, partnerType: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                          <option value="">Select Partner Type...</option>
                          {PARTNER_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleIdentifyStakeholders} 
                    disabled={!isFormValid() || isIdentifying} 
                    className="w-full bg-ink text-white px-6 py-3.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isIdentifying ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Identifying Stakeholders...</>
                    ) : (
                      <><Tag size={16} /> Identify MLG Stakeholders</>
                    )}
                  </button>
                </div>
              )}

              {phase === 'stakeholders' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h5 className="text-sm font-semibold text-ink mb-6 flex items-center gap-3">
                      <Tag size={14} className="text-accent" /> Key Stakeholders
                    </h5>
                    <p className="text-sm font-light text-ink-muted mb-6">Review and edit the stakeholders identified from the report. Add new ones by typing and pressing Enter.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {stakeholders.map((sh, idx) => (
                        <div key={idx} className="inline-flex items-center gap-1.5 bg-accent/5 border border-line text-ink px-3 py-1.5 text-sm font-medium hover:bg-accent/10 transition-colors">
                          <a 
                            href={`https://duckduckgo.com/?q=${encodeURIComponent(sh + ' official website')}&ia=web`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 cursor-pointer"
                            title="Search for stakeholder"
                          >
                            {sh}
                            <ExternalLink size={10} className="opacity-50" />
                          </a>
                          <button onClick={() => removeStakeholder(idx)} className="hover:text-accent p-0.5 transition-colors ml-2 border-l border-line/50 pl-2" title="Remove stakeholder">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Add stakeholder and press Enter..." 
                      value={newTag} 
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={addStakeholder}
                      className="w-full p-4 border border-line bg-surface text-ink text-sm focus:border-accent outline-none font-mono"
                    />
                  </div>

                  <button 
                    onClick={handleGeneratePlan} 
                    disabled={isGenerating || stakeholders.length === 0} 
                    className="w-full bg-ink text-surface px-6 py-4 text-sm font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <><div className="w-4 h-4 border border-surface/30 border-t-surface animate-spin" /> Generating Plan...</>
                    ) : (
                      <><Sparkles size={14} /> Know more about stakeholders' roles across recommendations</>
                    )}
                  </button>
                </div>
              )}

              {phase === 'plan' && plan && (
                <div className="bg-surface border border-line mt-8 mb-4">
                  <div className="bg-paper border-b border-line p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent text-surface rounded-none mt-1">
                        <CheckCircle2 size={24} className="stroke-[1.5]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-heading text-ink font-semibold">MLG Stakeholders' Roles</h2>
                        <p className="text-sm text-ink-muted font-light mt-2 max-w-lg leading-relaxed">We have mapped the critical institutional partners necessary to operationalize each recommendation, defining their precise strategic responsibilities.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-12 bg-surface">
                    <Markdown
                      components={{
                        h3: ({node, ...props}) => (
                          <h3 className="font-heading font-semibold text-ink text-2xl leading-snug border-b border-line pb-4 mb-6 mt-12 first:mt-0" {...props}>
                            {props.children}
                          </h3>
                        ),
                        ul: ({node, ...props}) => <ul className="space-y-4 text-ink font-light leading-relaxed mb-8" {...props} />,
                        li: ({node, ...props}) => (
                          <li className="flex items-start gap-4 p-4 border border-line hover:bg-paper transition-colors" {...props}>
                            <div className="mt-1.5 text-accent opacity-50"><X size={12} className="rotate-45" /></div>
                            <div className="flex-1 text-[15px]">{props.children}</div>
                          </li>
                        ),
                        p: ({node, ...props}) => <span className="block mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-sans text-sm font-semibold text-ink block mb-2" {...props} />
                      }}
                    >
                      {plan}
                    </Markdown>
                  </div>

                  <div className="bg-paper p-4 border-t border-line flex justify-center">
                    <button 
                      onClick={() => {setPhase('setup'); setPlan(null); setStakeholders([]);}} 
                      className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors flex items-center justify-center gap-3 px-6 py-3 border border-transparent hover:border-line"
                    >
                      <ArrowRight size={14} className="rotate-180" /> Start Over
                    </button>
                  </div>
                </div>
              )}

              {/* AI Errors */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default function StepView({ step }: { step: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pathways' | 'recommendations'>('overview');
  const [activePartnerModal, setActivePartnerModal] = useState<any>(null);

  // Reset tab when step changes
  useEffect(() => {
    setActiveTab('overview');
    setActivePartnerModal(null);
  }, [step.id]);

  if (!step) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 max-w-4xl mx-auto pb-32"
    >
      <div className="mb-10 max-w-3xl">
        <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block">Section 0{step.id}</span>
        <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">
          {step.title}
        </h1>
        <p className="text-xl text-ink-muted leading-relaxed font-light font-sans max-w-2xl">
          {step.goal}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-line mb-12 w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Context' },
          { id: 'pathways', label: 'Action Pathways' },
          { id: 'recommendations', label: 'Recommendations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'pathways' | 'recommendations')}
            className={`
              flex items-center gap-2 px-8 py-4 text-sm tracking-wide transition-all whitespace-nowrap relative
              ${activeTab === tab.id 
                ? 'text-ink font-semibold' 
                : 'text-ink-muted hover:text-ink'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Context and Rationale -> Why This Step is Needed */}
              {step.unifiedContext ? (
                <section>
                  <UnifiedContextCard data={step.unifiedContext} />
                </section>
              ) : (
                <section>
                  <h2 className="font-heading text-3xl text-ink mb-8">Why This Step is Needed</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
                    {step.context.map((ctx: any, idx: number) => (
                      <div key={idx} className="bg-paper">
                        <ContextCard item={ctx} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'pathways' && (
            <motion.div
              key="pathways"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Operational Action Pathways -> Action Pathways */}
              <section>
                <div className="space-y-4">
                  {step.pathways.map((pathway: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="p-6 md:p-8">
                        <h3 className="font-bold text-xl text-ink mb-4">{pathway.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What it is</h4>
                            <p className="text-slate-600 leading-relaxed font-medium">{pathway.what}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">How it works</h4>
                            <p className="text-slate-600 leading-relaxed font-medium">{pathway.howItWorks}</p>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">How to implement</h4>
                          <p className="text-slate-700 leading-relaxed font-medium mb-6">{pathway.howToImplement}</p>
                          
                          <div className="flex flex-col md:flex-row gap-6">
                            {(pathway.framework || (pathway.frameworks && pathway.frameworks.length > 0)) && (
                              <div className="flex-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Reference Framework{(pathway.frameworks?.length > 1) ? 's' : ''}</span>
                                <div className="flex flex-wrap gap-2">
                                  {(pathway.frameworks || [pathway.framework]).filter(Boolean).map((fw: any, fwIdx: number) => (
                                    <a 
                                      key={fwIdx}
                                      href={fw.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                    >
                                      <Building2 size={16} />
                                      {fw.name}
                                      <ExternalLink size={14} className="ml-0.5" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {pathway.partners && pathway.partners.length > 0 && (
                              <div className="flex-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Key Partners</span>
                                <div className="flex flex-wrap gap-2">
                                  {pathway.partners.map((p: any) => (
                                    p.subPartners ? (
                                      <button 
                                        key={p.name}
                                        onClick={() => setActivePartnerModal(p)}
                                        className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                                      >
                                        {p.name}
                                      </button>
                                    ) : (
                                      <a 
                                        key={p.name} 
                                        href={p.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                                      >
                                        {p.name}
                                        <ExternalLink size={12} className="text-slate-400" />
                                      </a>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {pathway.caseStudies && pathway.caseStudies.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">Implementation Examples</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pathway.caseStudies.map((cs: any, i: number) => (
                                  <a key={i} href={cs.link} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex items-stretch bg-white cursor-pointer h-24">
                                    <div className="w-24 shrink-0 overflow-hidden bg-slate-100 relative">
                                      {cs.image ? (
                                        <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText size={24}/></div>
                                      )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                      <h5 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{cs.title}</h5>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Recommendations */}
              <section>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
                  <h2 className="font-heading text-3xl text-ink">Recommendations for Multilevel Governance Stakeholders</h2>
                </div>
                <div className="space-y-12">
                  {step.recommendations.map((rec: any, index: number) => (
                    <RecommendationCard key={index} rec={rec} stepTitle={step.title} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePartnerModal && (
            <PartnerModal 
              partnerData={activePartnerModal} 
              onClose={() => setActivePartnerModal(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
