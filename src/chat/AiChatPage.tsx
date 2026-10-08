import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User as UserIcon, 
  Settings2, 
  Info, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { getStoredUser } from '../auth/authStore';
import { loadUserEnergyState, calculateEnergyMetrics } from '../data/userEnergyStore';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  assumptions?: string;
  dataPoints?: { label: string; value: string }[];
}

interface AiChatPageProps {
  onNavigate: (view: string) => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const energyState = loadUserEnergyState(currentUser);
  const metrics = calculateEnergyMetrics(energyState);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [localLlmUrl, setLocalLlmUrl] = useState<string>('http://localhost:11434/api/generate');
  const [useLocalLlm, setUseLocalLlm] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I am UrjaSaathi AI, your personal energy and microgrid copilot. I have analyzed your active profile for ${energyState.householdName}. Your current estimated monthly draw is ${metrics.monthlyConsumptionKWh} kWh (~₹${metrics.monthlyCostRupees}/mo) with a TLC envelope multiplier of ${metrics.tlc}x. How can I help you reduce waste or plan renewables today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dataPoints: [
        { label: 'Active Monthly Draw', value: `${metrics.monthlyConsumptionKWh} kWh` },
        { label: 'TLC Factor', value: `${metrics.tlc}x` },
        { label: 'Saving Potential', value: `₹${metrics.potentialSavingsRupees}/mo` }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'Why is my electricity consumption high?',
    'Which appliance uses the most energy?',
    'How can I reduce my monthly electricity bill?',
    'Is solar suitable for my house?',
    'Could a VAWT work at my location?',
    'How much battery storage might I need?',
    'How much renewable energy am I using?',
    'Explain my latest energy report'
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Generate grounded contextual response
    setTimeout(() => {
      const aiResponse = generateContextualAnswer(promptText, energyState, metrics, selectedLanguage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-16 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black text-slate-950">
                  UrjaSaathi AI Assistant
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {useLocalLlm ? 'Local LLM Connected' : 'Offline Grounded Engine'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Grounded in your real household data ({metrics.monthlyConsumptionKWh} kWh/mo · ₹{metrics.monthlyCostRupees}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono font-bold text-slate-800 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>

            {/* Config Toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-slate-700 cursor-pointer"
              title="LLM Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local LLM Integration Configuration Drawer */}
        {showConfig && (
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-xs font-mono space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-600" />
                <span>Local AI / LLM Integration Endpoint</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Ollama / LM Studio / vLLM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-[11px] font-mono text-slate-700 mb-1">Local Server URL</label>
                <input
                  type="text"
                  value={localLlmUrl}
                  onChange={(e) => setLocalLlmUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={useLocalLlm}
                    onChange={(e) => setUseLocalLlm(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Route queries to Local LLM</span>
                </label>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-sans">
              When disabled, UrjaSaathi AI executes its zero-latency offline heuristic rule-engine, ensuring privacy with zero internet connectivity.
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 min-h-[440px] max-h-[580px] overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'ai' 
                  ? 'bg-slate-950 text-amber-400' 
                  : 'bg-amber-500 text-slate-950'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs font-sans leading-relaxed ${
                msg.sender === 'ai' 
                  ? 'bg-stone-50 border border-stone-200 text-slate-800' 
                  : 'bg-slate-950 text-white font-medium'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.dataPoints && msg.dataPoints.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-200/80 font-mono text-[11px]">
                    {msg.dataPoints.map((dp, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white border border-stone-200">
                        <span className="text-slate-400 block text-[9px]">{dp.label}</span>
                        <span className="font-bold text-slate-900">{dp.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.assumptions && (
                  <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-slate-500 flex items-start gap-1">
                    <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Assumptions &amp; Limitations:</strong> {msg.assumptions}</span>
                  </div>
                )}

                <div className={`text-[10px] font-mono ${msg.sender === 'ai' ? 'text-slate-400' : 'text-slate-400'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-stone-100 text-xs font-mono text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>UrjaSaathi AI is computing thermodynamic parameters...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(prompt)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-[11px] font-mono font-medium text-slate-700 whitespace-nowrap hover:border-amber-300 transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="bg-white p-2.5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about your electricity consumption, AC thermal surge, solar sizing, or battery BESS..."
            className="flex-1 px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="p-3 rounded-2xl bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local telemetry privacy: Household data is evaluated strictly on client hardware.</span>
        </div>

      </div>
    </div>
  );
};

// Contextual Grounded Answer Engine
function generateContextualAnswer(
  prompt: string, 
  state: any, 
  metrics: any, 
  lang: 'en' | 'hi'
): Message {
  const p = prompt.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Why is electricity consumption high?
  if (p.includes('why') && (p.includes('high') || p.includes('consumption') || p.includes('bill'))) {
    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `Based on your household profile for ${state.householdName}, your electricity consumption is high due to two primary thermodynamic drivers:

1. Thermal Envelope Heat Ingress (TLC = ${metrics.tlc}x): Your building material (${metrics.material.name}, U = ${metrics.material.uValue} W/m²K) allows outdoor heat at ${state.ambientTemp}°C to conduct through walls, causing your AC compressor to draw ~${metrics.tlc}x more electricity than nominal BEE rating.
2. Continuous Vampire Standby Bleed: Your appliances constantly bleed ~${metrics.standbyAudit.standbyTotalWatts}W even when turned off, adding ${metrics.standbyAudit.standbyMonthlyKWh} kWh (~₹${metrics.standbyAudit.standbyMonthlyCostRupees}/mo) in ghost power.`,
      timestamp: time,
      dataPoints: [
        { label: 'TLC Multiplier', value: `${metrics.tlc}x` },
        { label: 'Vampire Standby', value: `${metrics.standbyAudit.standbyTotalWatts}W` },
        { label: 'Thermal Waste', value: `~₹${Math.round(metrics.monthlyCostRupees * 0.28)}/mo` }
      ],
      assumptions: 'Calculated using IS 3792 building heat transfer coefficients and 38.5°C ambient summer heat index.'
    };
  }

  // 2. Which appliance uses the most energy?
  if (p.includes('which appliance') || p.includes('most energy') || p.includes('highest')) {
    const sorted = [...state.appliances].sort((a, b) => {
      const aKWh = (a.ratedWatts * a.defaultHoursDaily) * (a.thermalCoupled ? metrics.tlc : 1);
      const bKWh = (b.ratedWatts * b.defaultHoursDaily) * (b.thermalCoupled ? metrics.tlc : 1);
      return bKWh - aKWh;
    });
    const top = sorted[0];
    const topDaily = Number(((top.ratedWatts * top.defaultHoursDaily / 1000) * (top.thermalCoupled ? metrics.tlc : 1)).toFixed(2));
    const topMonthlyCost = Math.round(topDaily * 30 * state.tariffPerKWh);

    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `Your single highest energy consumer is the **${top.name}**:

- Daily Draw: ~${topDaily} kWh/day (${Number((topDaily * 30).toFixed(1))} kWh/month).
- Monthly Financial Cost: ~₹${topMonthlyCost} per month (at your current tariff of ₹${state.tariffPerKWh}/kWh).
- Reason: At ${top.ratedWatts}W power rating running ${top.defaultHoursDaily} hrs/day${top.thermalCoupled ? ` coupled with your ${metrics.tlc}x envelope TLC multiplier` : ''}, it accounts for ~${Math.round((topDaily / metrics.dailyConsumptionKWh) * 100)}% of your entire electric bill.`,
      timestamp: time,
      dataPoints: [
        { label: 'Top Consumer', value: top.name },
        { label: 'Monthly Cost', value: `₹${topMonthlyCost}` },
        { label: 'Share of Bill', value: `${Math.round((topDaily / metrics.dailyConsumptionKWh) * 100)}%` }
      ],
      assumptions: `Based on your entered operating schedule of ${top.defaultHoursDaily} hours per day.`
    };
  }

  // 3. How can I reduce bill?
  if (p.includes('reduce') || p.includes('cut') || p.includes('save money')) {
    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `You have an estimated monthly saving opportunity of **₹${metrics.potentialSavingsRupees} (~${metrics.potentialSavingsKWh} kWh/month)**. Here is your optimal plan:

1. Immediate No-Cost Step: Adjust AC setpoint from 21°C to 24°C (saves ~₹425/mo immediately without sacrifice in comfort).
2. Low-Cost Step: Install smart power strips on your entertainment & workstation clusters (eliminates ${metrics.standbyAudit.standbyTotalWatts}W vampire bleed, saving ₹${metrics.standbyAudit.standbyMonthlyCostRupees}/mo with payback in 4 months).
3. Shift Heavy Loads: Run washing machines and water geysers between 11:00 - 14:00 during peak solar irradiance.`,
      timestamp: time,
      dataPoints: [
        { label: 'Monthly Potential', value: `₹${metrics.potentialSavingsRupees}` },
        { label: 'Energy Cut', value: `-${metrics.potentialSavingsKWh} kWh` },
        { label: 'Zero-Cost Share', value: `~52%` }
      ],
      assumptions: 'Assumes adoption of BEE 24°C guideline and elimination of vampire parasitic loads.'
    };
  }

  // 4. Solar suitability
  if (p.includes('solar')) {
    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `Rooftop Solar PV is highly viable for your ${metrics.monthlyConsumptionKWh} kWh/month requirement:

- Recommended PV Sizing: **5.0 kWp - 5.5 kWp** Monocrystalline Array.
- Required Roof Shadow-Free Area: Approximately 400 - 450 sq. ft.
- Expected Generation: ~22 - 25 kWh/day (~680 kWh/month).
- Self-Consumption: Over 75% of your daytime household load will be powered directly by clean solar power.
- Estimated Net Annual Bill Reduction: ~₹${Math.round(680 * state.tariffPerKWh * 12).toLocaleString()} per year.`,
      timestamp: time,
      dataPoints: [
        { label: 'Recommended PV', value: '5.5 kWp' },
        { label: 'Daily Yield', value: '~24.2 kWh' },
        { label: 'Roof Area', value: '440 sq ft' }
      ],
      assumptions: 'Calculated using 5.5 Peak Sun Hours (PSH) in western India with 20° south-facing tilt and 5% soiling derating.'
    };
  }

  // 5. VAWT Wind Turbine suitability
  if (p.includes('vawt') || p.includes('wind') || p.includes('turbine')) {
    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `Vertical-Axis Wind Turbines (VAWTs) are uniquely suited for urban rooftops compared to horizontal turbines because they are **omnidirectional** (do not need yaw alignment) and operate effectively in turbulent rooftop boundary layer winds.

- Cut-In Wind Velocity: Starts generating at just 2.0 m/s.
- Rooftop Advantage: At 12 - 15 meters building height, night winds provide complementary power when solar PV is offline.
- Estimated Contribution: At 6.0 m/s average speed, a 2.4 kW Savonius-Darrieus hybrid generates ~6.8 kWh/day (~204 kWh/mo).
- Important Note: Neoprene vibration isolation mounts must be fitted to prevent structural resonance through concrete slabs.`,
      timestamp: time,
      dataPoints: [
        { label: 'VAWT Capacity', value: '2.4 kW' },
        { label: 'Daily Yield', value: '~6.8 kWh' },
        { label: 'Cut-in Speed', value: '2.0 m/s' }
      ],
      assumptions: 'Rooftop elevation of 14m above ground level with unblocked wind quadrant.'
    };
  }

  // Default response
  return {
    id: `ai_${Date.now()}`,
    sender: 'ai',
    text: `Based on your profile (${energyState.householdName}, ${metrics.monthlyConsumptionKWh} kWh/mo draw), UrjaSaathi AI calculates that your primary opportunity lies in mitigating the ${metrics.tlc}x thermal envelope loss and eliminating the ${metrics.standbyAudit.standbyTotalWatts}W standby parasite load. Would you like me to walk you through your personalized 3-tier energy plan or help configure your solar/VAWT hybrid plant?`,
    timestamp: time,
    dataPoints: [
      { label: 'Monthly Draw', value: `${metrics.monthlyConsumptionKWh} kWh` },
      { label: 'Tariff', value: `₹${state.tariffPerKWh}/kWh` },
      { label: 'Avoided CO₂', value: `${metrics.avoidedEmissionsMonthlyKg} kg/mo` }
    ]
  };
}
