'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ForecastChart from '@/components/ForecastChart';
import { BarChart3, Download, Rocket, Zap, TrendingUp, Mail, Phone, Linkedin, Calendar } from 'lucide-react';

export default function InvestorDeck() {
  return (
    <>
      <Navigation />
      
      <header className="pt-32 pb-16 text-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Investment Opportunity • Series A Ready
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Investor Resources &
            <span className="block gradient-text mt-2">Growth Forecasting</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
            Comprehensive investment materials, financial projections, and growth strategies for {process.env.APP_NAME || "Kairoo"} - the
            future of AI-powered professional development. Join us in transforming how the world learns and grows.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-linear-to-r from-brand-navy to-brand-teal-bright text-white font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-transform">
              View Pitch Deck
            </button>
            <button className="font-semibold text-gray-300 hover:text-white transition flex items-center gap-2 border border-gray-600 py-4 px-8 rounded-full hover:border-cyan-400">
              Download Materials <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 space-y-24 md:space-y-32">
        {/* Investment Opportunity Overview */}
        <section id="opportunity" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Investment Opportunity Overview
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { value: '$2.5M', label: 'Series A Target', color: 'text-cyan-400', accent: '#2DD4BF' },
              { value: '$142B', label: 'Market Size (TAM)', color: 'text-purple-400', accent: '#0B1F3A' },
              { value: '24 Mo', label: 'Runway Extension', color: 'text-pink-400', accent: '#F59E0B' },
              { value: '15-20%', label: 'Equity Offering', color: 'text-green-400', accent: '#10b981' },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="metric-card glass-card p-6 rounded-2xl"
                style={{ '--accent-color': metric.accent } as React.CSSProperties}
              >
                <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                <p className="text-sm text-gray-400">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Why Invest in {process.env.APP_NAME || "Kairoo"}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  icon: Rocket,
                  color: 'text-cyan-400',
                  title: 'Massive Market Opportunity',
                  desc: '$142B+ addressable market with 16.3% CAGR. AI in education projected to reach $43B by 2027.',
                },
                {
                  icon: Zap,
                  color: 'text-purple-400',
                  title: 'Unique Competitive Position',
                  desc: 'Only platform combining career tools, learning paths, and business intelligence in one AI-powered solution.',
                },
                {
                  icon: TrendingUp,
                  color: 'text-pink-400',
                  title: 'Proven Traction',
                  desc: 'Strong early metrics with 94/100 market validation score and clear path to $10M+ ARR.',
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className={`${item.color} mb-4`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 10-Slide Pitch Deck Outline */}
        <section id="pitch-deck" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            10-Slide Pitch Deck Structure
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Problem', color: 'from-cyan-500 to-blue-500', items: ['Career development is fragmented and inefficient', 'Information overload prevents skill mastery', '$87B spent annually on ineffective corporate training', '87% of executives report critical skill gaps'] },
              { num: 2, title: 'Solution', color: 'from-blue-500 to-purple-500', items: ['AI-powered integrated platform', '32+ career development tools', 'Personalized learning paths', 'Business intelligence & analytics'] },
              { num: 3, title: 'Market', color: 'from-purple-500 to-pink-500', items: ['$142B Total Addressable Market', '$28B Serviceable Addressable Market', '16.3% annual growth rate', '500M+ knowledge workers globally'] },
              { num: 4, title: 'Product Demo', color: 'from-pink-500 to-red-500', items: ['Interactive AI career coaching', 'Dynamic learning path generation', 'Real-time skill gap analysis', 'Team analytics dashboard'] },
              { num: 5, title: 'Traction', color: 'from-red-500 to-orange-500', items: ['1,000+ beta users with 85% retention', '$30K MRR within 90 days', '12.7% freemium conversion rate', '5+ enterprise pilot programs'] },
              { num: 6, title: 'Business Model', color: 'from-orange-500 to-yellow-500', items: ['Freemium + SaaS subscriptions', 'Individual: $29/month', 'Enterprise: $89/seat/month', '92% gross margins'] },
              { num: 7, title: 'Competition', color: 'from-yellow-500 to-green-500', items: ['No direct competitors with full integration', '68% cost advantage vs alternatives', 'Superior AI personalization', 'First-mover advantage in combined market'] },
              { num: 8, title: 'Team', color: 'from-green-500 to-teal-500', items: ['Experienced tech & education leadership', 'AI/ML engineering expertise', 'Previous exits and unicorn experience', 'Strategic advisory board'] },
              { num: 9, title: 'Financials', color: 'from-teal-500 to-cyan-500', items: ['Path to $10M ARR by Year 2', '92% gross margins', 'Break-even at $2.5M ARR', '24-month runway with funding'] },
              { num: 10, title: 'Ask', color: 'from-cyan-500 to-purple-500', items: ['Raising $2.5M Series A', '15-20% equity offering', 'Product development & team expansion', 'Market expansion & enterprise sales'], highlight: true },
            ].map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`slide-card glass-card p-6 rounded-2xl text-left ${slide.highlight ? 'border-2 border-cyan-400' : ''}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 bg-linear-to-r ${slide.color} rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                    {slide.num}
                  </div>
                  <h3 className="text-lg font-bold">{slide.title}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  {slide.items.map((item, i) => (
                    <p key={i}>• {item}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Growth Forecasting */}
        <section id="growth-forecast" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            12-Month Growth & Revenue Forecast
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">User Growth & MRR Projection</h3>
              <ForecastChart />
              <div className="mt-6 text-sm text-gray-400">
                <p>Assumptions: $29 avg price, 5% monthly churn, 15% monthly growth</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Key Financial Projections</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-xs font-bold text-gray-400 border-b border-gray-700 pb-2">
                  <div>Month</div>
                  <div>Users</div>
                  <div>MRR</div>
                  <div>Churn</div>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { month: 'Month 3', users: '1,049', mrr: '$30.4K', churn: '5.2%', color: 'text-cyan-400' },
                    { month: 'Month 6', users: '3,247', mrr: '$94.2K', churn: '5.0%', color: 'text-purple-400' },
                    { month: 'Month 9', users: '7,891', mrr: '$228.8K', churn: '4.8%', color: 'text-pink-400' },
                    { month: 'Month 12', users: '15,234', mrr: '$441.8K', churn: '4.5%', color: 'text-orange-400' },
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 py-2 hover:bg-white/5 rounded border-t border-gray-700">
                      <div className={`font-bold ${row.color}`}>{row.month}</div>
                      <div>{row.users}</div>
                      <div className="text-green-400">{row.mrr}</div>
                      <div>{row.churn}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-bold text-green-400 mb-2">Year 1 Totals</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-400">15.2K</div>
                    <p className="text-xs text-gray-400">Paid Users</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">$441K</div>
                    <p className="text-xs text-gray-400">Monthly Revenue</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 90-Day MVP Action Plan */}
        <section id="mvp-plan" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            90-Day MVP Launch Action Plan
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                phase: 'Phase 1',
                title: 'Foundation & Systems (Days 1-30)',
                color: '#2DD4BF',
                tasks: {
                  product: [
                    'Finalize 90-day backlog + success metrics',
                    'Design system + component library (light/dark ready)',
                    'Set up infra: environments, CI/CD, observability',
                  ],
                  team: [
                    'Expand core squad (AI lead + design partner)',
                    'Define rituals & async comms cadence',
                    'Line up 5 design partners for beta access',
                  ],
                },
                milestone: 'Clickable prototype + technical alpha by Day 30',
              },
              {
                phase: 'Phase 2',
                title: 'Build & Beta (Days 31-60)',
                color: '#0B1F3A',
                tasks: {
                  product: [
                    'Ship AI roadmap generator + learning path studio',
                    'Embed analytics + billing + workspace controls',
                    'Integrate theme switching + enterprise SSO',
                  ],
                  team: [
                    'Onboard design partners to managed beta',
                    'Stand up customer success playbooks + feedback loop',
                    'Validate pricing/packaging with finance + product',
                  ],
                },
                milestone: 'Private beta with NPS tracking + ARR pilots',
              },
              {
                phase: 'Phase 3',
                title: 'Scale & Launch (Days 61-90)',
                color: '#F59E0B',
                tasks: {
                  product: [
                    'Hardening: perf, security, compliance (SOC2 lite)',
                    'Automated onboarding flows + in-product education',
                    'Launch marketing site + PLG motion (waitlist → self-serve)',
                  ],
                  team: [
                    'Product Hunt + partner launches + webinar tour',
                    'Stand up 24/7 support rotation + runbooks',
                    'Define KPI dashboard for leadership + investors',
                  ],
                },
                milestone: 'Public GA launch + first $100K ARR in pipeline',
              },
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="timeline-item pl-8"
                style={{ '--accent-color': phase.color } as React.CSSProperties}
              >
                <div className="glass-card p-6 rounded-2xl text-left">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">{phase.phase}</h3>
                  <h4 className="text-xl font-bold" style={{ color: phase.color }}>
                    {phase.title}
                  </h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <h5 className="font-bold text-white">Product Workstreams</h5>
                      <ul className="ml-4 space-y-1 text-xs">
                        {phase.tasks.product.map((task, i) => (
                          <li key={i}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-white">Team & GTM</h5>
                      <ul className="ml-4 space-y-1 text-xs">
                        {phase.tasks.team.map((task, i) => (
                          <li key={i}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-semibold" style={{ color: phase.color }}>
                    <strong>Milestone:</strong> {phase.milestone}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tools & Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Required Tools & Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: 'Development Stack',
                  color: 'text-cyan-400',
                  items: ['Next.js + TypeScript', 'PostgreSQL + Prisma', 'OpenAI GPT-4 API', 'Stripe for payments', 'Vercel for hosting'],
                },
                {
                  title: 'Marketing Tools',
                  color: 'text-purple-400',
                  items: ['Mailchimp for email', 'Buffer for social media', 'Google Analytics', 'Hotjar for user research', 'Webflow for landing pages'],
                },
                {
                  title: 'Operational Tools',
                  color: 'text-pink-400',
                  items: ['Notion for documentation', 'Slack for communication', 'Figma for design', 'GitHub for code', 'Zoom for meetings'],
                },
              ].map((category, index) => (
                <div key={index}>
                  <h4 className={`font-bold ${category.color} mb-3`}>{category.title}</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {category.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact & Investment Interest */}
        <section id="contact" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with our team to learn more about investment opportunities, access detailed financial models, or
              schedule a product demonstration.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <button className="bg-linear-to-r from-brand-navy to-brand-teal-bright text-white font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-transform">
                Contact Investment Team
              </button>
              <button className="font-semibold text-gray-300 hover:text-white transition flex items-center gap-2 border border-gray-600 py-4 px-8 rounded-full hover:border-cyan-400">
                Schedule Demo <Calendar className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: Mail, color: 'text-cyan-400', title: 'Investment Inquiries', contact: 'investors@kairoo.com' },
                { icon: Phone, color: 'text-purple-400', title: 'Direct Line', contact: '+1 (555) 123-FUND' },
                { icon: Linkedin, color: 'text-pink-400', title: 'LinkedIn', contact: 'linkedin.com/company/kairoo' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.contact}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}

