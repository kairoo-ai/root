'use client';

import { motion } from 'framer-motion';
import GrowthChart from '@/components/GrowthChart';
import CompetitiveChart from '@/components/CompetitiveChart';
import { TrendingUp, Globe, Target, Crosshair, Zap, Circle, Crown } from 'lucide-react';

export default function MarketAnalysis() {
  return (
    <>
      <header className="pt-32 pb-16 text-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Intelligence & Competitive Analysis
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Market Analysis &
            <span className="block gradient-text mt-2">Go-to-Market Strategy</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
            Comprehensive market research, competitive intelligence, and strategic go-to-market planning for Kairoo's
            entry into the $366B global education technology market.
          </p>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 space-y-24 md:space-y-32">
        {/* Market Size & Opportunity */}
        <section id="market-size" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Market Size & Opportunity Analysis
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="market-size-visual mb-8 p-8 rounded-2xl glass-card">
                <div className="text-center">
                  <div className="text-5xl font-black gradient-text mb-2">$366B</div>
                  <p className="text-xl text-gray-300">Global EdTech Market</p>
                  <p className="text-sm text-cyan-400">Growing at 16.3% CAGR</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '$87B', label: 'Corporate Learning', color: 'text-purple-400' },
                  { value: '$12B', label: 'Career Services', color: 'text-cyan-400' },
                  { value: '$43B', label: 'AI in Education', color: 'text-pink-400' },
                  { value: '$24B', label: 'Professional Development', color: 'text-orange-400' },
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 glass-card rounded-lg">
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="text-sm text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8 rounded-2xl text-left">
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Target Addressable Market (TAM)</h3>

                <div className="space-y-6">
                  {[
                    {
                      icon: Globe,
                      color: 'text-purple-400',
                      title: 'Total Addressable Market',
                      value: '$142B',
                      desc: 'Combined EdTech, Career Development, and AI-powered learning market',
                    },
                    {
                      icon: Target,
                      color: 'text-cyan-400',
                      title: 'Serviceable Addressable Market (SAM)',
                      value: '$28B',
                      desc: 'AI-powered professional development platforms in English-speaking markets',
                    },
                    {
                      icon: Crosshair,
                      color: 'text-pink-400',
                      title: 'Serviceable Obtainable Market (SOM)',
                      value: '$840M',
                      desc: 'Realistic 3% market capture over 5 years with aggressive growth strategy',
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <h4 className={`font-bold text-lg mb-2 flex items-center ${item.color}`}>
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.title}
                      </h4>
                      <p className="text-gray-300 mb-2">
                        <span className={`font-bold text-3xl ${item.color}`}>{item.value}</span> - {item.desc}
                      </p>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-bold text-green-400 mb-2">Market Growth Drivers</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Remote work acceleration (+300% since 2020)</li>
                      <li>• Skills gap crisis (87% of executives report gaps)</li>
                      <li>• AI adoption in education (+45% annually)</li>
                      <li>• Career mobility increase (+28% job changes)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Competitive Landscape */}
        <section id="competitors" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Competitive Intelligence Matrix
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Zap,
                color: 'red',
                title: 'Direct Competitors',
                competitors: [
                  { name: 'Coursera for Business', price: '$92/month per user', weakness: 'No career-specific tools integration' },
                  { name: 'LinkedIn Learning', price: '$29.99/month', weakness: 'Generic paths, no AI personalization' },
                  { name: 'Pluralsight', price: '$45/month', weakness: 'Limited to technical skills only' },
                ],
              },
              {
                icon: Circle,
                color: 'orange',
                title: 'Indirect Competitors',
                competitors: [
                  { name: 'MasterClass', price: '$180/year', weakness: 'Entertainment > practical career skills' },
                  { name: 'Udemy Business', price: '$360/year per user', weakness: 'Quality inconsistency, no career integration' },
                  { name: 'Skillshare', price: '$168/year', weakness: 'Lacks professional career development tools' },
                ],
              },
              {
                icon: Crown,
                color: 'cyan',
                title: 'Kairoo Advantage',
                competitors: [
                  { name: 'Integrated Ecosystem', price: 'Learning + Career + Business tools', weakness: '70% time savings vs multiple tools' },
                  { name: 'AI-Powered Personalization', price: 'Adaptive learning paths', weakness: '3x faster skill acquisition' },
                  { name: 'Competitive Pricing', price: '$29/month vs $92+', weakness: '68% cost reduction for same value' },
                ],
                isAdvantage: true,
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`competitor-card glass-card p-6 rounded-2xl ${category.isAdvantage ? 'border-2 border-cyan-400' : ''}`}
                style={{ '--accent-color': category.isAdvantage ? '#2DD4BF' : undefined } as React.CSSProperties}
              >
                <div className={`text-${category.color}-400 mb-4`}>
                  <category.icon className="w-8 h-8 mx-auto" />
                </div>
                <h3 className={`text-xl font-bold mb-4 text-${category.color}-400`}>{category.title}</h3>
                <div className="space-y-4 text-left">
                  {category.competitors.map((comp, i) => (
                    <div key={i} className={`p-3 bg-${category.color}-500/10 rounded-lg`}>
                      <h4 className="font-bold text-sm">{comp.name}</h4>
                      <p className="text-xs text-gray-300">{comp.price}</p>
                      <div className={`text-xs ${category.isAdvantage ? 'text-cyan-300' : `text-${category.color}-300`} mt-1`}>
                        <strong>{category.isAdvantage ? 'Advantage:' : 'Weakness:'}</strong> {comp.weakness}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Competitive Positioning Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Competitive Positioning Matrix</h3>
            <CompetitiveChart />
            <p className="text-sm text-gray-400 mt-4">
              Positioned as high-value, moderate-cost solution with superior AI integration and comprehensive feature
              set
            </p>
          </motion.div>
        </section>

        {/* Go-to-Market Strategy */}
        <section id="gtm-strategy" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Go-to-Market Strategy Framework
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8 rounded-2xl text-left">
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Primary Launch Channels</h3>

                <div className="space-y-6">
                  {[
                    {
                      color: 'purple',
                      title: 'Content Marketing Engine',
                      items: [
                        'AI-generated career guides and industry reports',
                        'Weekly newsletter with 50K+ subscribers target',
                        'SEO-optimized blog targeting career keywords',
                        'Podcast appearances on career development shows',
                      ],
                      expected: '40% of new users',
                    },
                    {
                      color: 'cyan',
                      title: 'Strategic Partnerships',
                      items: [
                        'Integration with major HR platforms (BambooHR, Workday)',
                        'Partnerships with coding bootcamps and universities',
                        'Affiliate program with career coaches and consultants',
                        'Corporate pilot programs with Fortune 500 companies',
                      ],
                      expected: '35% of new users',
                    },
                    {
                      color: 'pink',
                      title: 'Community-Driven Growth',
                      items: [
                        'Private Slack/Discord community for power users',
                        'User-generated success stories and case studies',
                        'Referral program with meaningful incentives',
                        'LinkedIn thought leadership campaign',
                      ],
                      expected: '25% of new users',
                    },
                  ].map((channel, index) => (
                    <div key={index} className={`border-l-4 border-${channel.color}-400 pl-6`}>
                      <h4 className="font-bold text-lg mb-2">{channel.title}</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {channel.items.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                      <div className={`mt-2 text-xs text-${channel.color}-400`}>Expected: {channel.expected}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Content Formats */}
              <div className="glass-card p-8 rounded-2xl text-left">
                <h3 className="text-2xl font-bold mb-6 text-purple-400">High-Impact Content Formats</h3>

                <div className="space-y-4">
                  {[
                    { title: 'Interactive Career Assessments', desc: 'Free tools that capture leads while providing value', metric: 'Conversion: 15-25%' },
                    { title: 'Industry Salary Reports', desc: 'AI-generated market intelligence reports', metric: 'Viral potential: High' },
                    { title: 'Video Course Previews', desc: 'Short-form educational content on TikTok/YouTube', metric: 'Reach: 1M+ monthly views' },
                  ].map((format, index) => (
                    <div key={index} className="p-4 bg-purple-500/10 rounded-lg">
                      <h4 className="font-bold text-sm">{format.title}</h4>
                      <p className="text-xs text-gray-300">{format.desc}</p>
                      <div className="text-xs text-purple-300 mt-1">{format.metric}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Acquisition Tactics */}
              <div className="glass-card p-8 rounded-2xl text-left">
                <h3 className="text-2xl font-bold mb-6 text-orange-400">Early User Acquisition Tactics</h3>

                <div className="space-y-4">
                  {[
                    { title: 'Product Hunt Launch', desc: 'Target #1 Product of the Day with coordinated campaign', metric: 'Expected: 5K signups in 24 hours' },
                    { title: 'Beta Program', desc: '100 power users get lifetime discounts for feedback', metric: 'Expected: 85% retention rate' },
                    { title: 'Freemium Model', desc: 'Core features free forever, premium for advanced tools', metric: 'Conversion: 8-12% to paid' },
                  ].map((tactic, index) => (
                    <div key={index} className={`p-4 bg-${index === 0 ? 'orange' : index === 1 ? 'green' : 'blue'}-500/10 rounded-lg`}>
                      <h4 className="font-bold text-sm">{tactic.title}</h4>
                      <p className="text-xs text-gray-300">{tactic.desc}</p>
                      <div className={`text-xs text-${index === 0 ? 'orange' : index === 1 ? 'green' : 'blue'}-300 mt-1`}>{tactic.metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3-Month Growth Projections */}
        <section id="growth-projections" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            First 90 Days Growth Targets
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                month: 'Month 1',
                title: 'Foundation & Launch',
                color: 'cyan',
                metrics: { users: '1,250', paid: '125', mrr: '$3,625', cac: '$28' },
              },
              {
                month: 'Month 2',
                title: 'Optimization & Scale',
                color: 'purple',
                metrics: { users: '2,800', paid: '336', mrr: '$9,744', cac: '$24' },
                popular: true,
              },
              {
                month: 'Month 3',
                title: 'Growth & Retention',
                color: 'pink',
                metrics: { users: '4,200', paid: '588', mrr: '$17,052', cac: '$21' },
              },
            ].map((month, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-8 rounded-2xl ${month.popular ? 'border-2 border-purple-400' : ''}`}
              >
                <div className={`text-4xl font-bold text-${month.color}-400 mb-2`}>{month.month}</div>
                <h3 className="text-xl font-bold mb-4">{month.title}</h3>
                <div className="space-y-3 text-left">
                  {Object.entries(month.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-300 capitalize">{key === 'mrr' ? 'MRR' : key === 'cac' ? 'CAC' : key === 'paid' ? 'Paid Conversions' : 'New Users'}</span>
                      <span className={`text-sm font-bold ${key === 'mrr' ? 'text-green-400' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">90-Day Growth Trajectory</h3>
            <GrowthChart
              labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']}
              totalUsers={[300, 650, 1000, 1250, 1800, 2400, 2800, 3500, 4200, 5000, 6200, 8250]}
              paidUsers={[30, 78, 120, 125, 216, 288, 336, 420, 588, 650, 806, 1049]}
            />
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { value: '8,250', label: 'Total Users', color: 'text-cyan-400' },
                { value: '1,049', label: 'Paid Users', color: 'text-purple-400' },
                { value: '$30.4K', label: 'Monthly Revenue', color: 'text-green-400' },
                { value: '12.7%', label: 'Conversion Rate', color: 'text-pink-400' },
              ].map((metric, index) => (
                <div key={index}>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}

