import React, { useState } from 'react';
import { Zap, ArrowRight, CheckCircle2, Send, Building2 } from 'lucide-react';

interface ContactSectionProps {
  onNavigateApp?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigateApp }) => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    societyName: '',
    flatsCount: '40',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', societyName: '', flatsCount: '40', notes: '' });
    }, 3000);
  };

  const handleLaunchApp = () => {
    if (onNavigateApp) onNavigateApp();
    else window.location.hash = 'app';
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#F8F5EE] border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 font-mono text-xs uppercase tracking-wider font-bold border border-slate-800 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>SOCIETY ONBOARDING &amp; PILOT DEPLOYMENT</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
              DEPLOY URJASAATHI AI FOR YOUR RESIDENTIAL SOCIETY
            </h2>

            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              Whether you are an independent prosumer seeking to optimize rooftop Solar + VAWT generation, or a 40-flat residential association planning an internal P2P energy sharing marketplace, UrjaSaathi AI launches without installing hardware meters.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero upfront capital expenditure (zero sensors or IoT wiring)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Building Thermal Loss Coefficient (TLC) diagnostic audit</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated P2P ledger settlement with ₹6.20/kWh win-win tariff</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={handleLaunchApp}
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Launch Interactive App Console</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Right Audit Request Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-300 shadow-md">
            <h3 className="font-display font-black text-slate-950 text-xl mb-1">
              Request Energy Audit &amp; Microgrid Blueprint
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Our automated diagnostic engine will generate a customized thermal and microgrid feasibility profile.
            </p>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-display font-black text-slate-950 text-base">
                  Feasibility Request Received!
                </h4>
                <p className="text-xs text-slate-700 font-mono">
                  The initial 40-flat thermal envelope model is being queued for review. You can also explore the live interactive console right now.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@society.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 uppercase mb-1">
                      Society / Complex Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Greenwood Enclave"
                      value={formData.societyName}
                      onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">
                    Number of Residential Flats
                  </label>
                  <select
                    value={formData.flatsCount}
                    onChange={(e) => setFormData({ ...formData, flatsCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900 font-bold"
                  >
                    <option value="1">1 Independent Prosumer Home</option>
                    <option value="20">20 Flats Residential Wing</option>
                    <option value="40">40 Flats Residential Complex (Recommended)</option>
                    <option value="100">100+ Multi-Tower Society</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">
                    Specific Energy Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. AC thermal heat reduction, rooftop solar yield evaluation, or P2P trading setup."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Building Energy Feasibility Profile</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
