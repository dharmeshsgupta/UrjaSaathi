import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Sun, Wind, BatteryCharging, Building2, Award, Users, CheckCircle2 } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const members = [
    {
      name: 'Rohan Sharma',
      role: 'Lead Thermal Systems & HVAC Modeling',
      focus: 'Building envelope heat transfer (U-values), thermal inertia, and AC load regressions.',
      domain: 'Building Physics',
    },
    {
      name: 'Priya Iyer',
      role: 'Renewable Microgrid & Aerodynamics Engineer',
      focus: 'Vertical-axis wind turbine (VAWT) power curves, rooftop turbulence, and solar PV tilt optimization.',
      domain: 'Renewable Energy',
    },
    {
      name: 'Dharmesh Gupta',
      role: 'Distributed Systems & P2P Ledger Architect',
      focus: 'Autonomous matching engine, multi-tenant tariff arbitrage, and LiFePO4 battery dispatch algorithms.',
      domain: 'Smart Grid Systems',
    },
    {
      name: 'Ananya Verma',
      role: 'Energy Data Science & Behavioral Analytics',
      focus: 'Standby vampire load isolation, non-intrusive appliance disaggregation, and consumer savings UX.',
      domain: 'Energy Analytics',
    },
  ];

  return (
    <section id="team" className="relative py-24 sm:py-32 bg-[#F8F5EE] border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 font-mono text-xs uppercase tracking-wider mb-4 font-bold border border-slate-800 shadow-xs">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>ENGINEERING &amp; RESEARCH TEAM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            MULTIDISCIPLINARY CLEAN ENERGY ARCHITECTS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            Combining building envelope thermodynamics, aerodynamic rotor modeling, and decentralized peer-to-peer microgrid economics.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border-2 border-stone-300 hover:border-slate-900 transition-all duration-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300">
                    {member.domain}
                  </span>
                  <Award className="w-4 h-4 text-slate-400" />
                </div>

                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-display font-black text-lg mb-4 shadow-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <h3 className="font-display font-black text-slate-950 text-lg mb-1">
                  {member.name}
                </h3>
                <div className="text-xs font-mono font-bold text-amber-700 mb-3">
                  {member.role}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.focus}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-200 flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified System Contributor</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
