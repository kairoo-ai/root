'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Brain, Zap, DollarSign, Shield, Heart, Check } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BusinessStrategy() {
  const moscowData = {
    labels: ['Must Have', 'Should Have', 'Could Have', "Won't Have"],
    datasets: [{
      data: [35, 30, 25, 10],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(251, 146, 60)',
        'rgb(250, 204, 21)',
        'rgb(156, 163, 175)'
      ],
      borderWidth: 2
    }]
  };

  const moscowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '% of features';
          }
        }
      }
    }
  };

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
              <Brain className="w-4 h-4 mr-2" />
              Strategic Business Intelligence
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            SaaS Strategy &
            <span className="block gradient-text mt-2">Validation Framework</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
            Comprehensive strategic analysis, market validation, and business intelligence for Kairoo - your
            complete guide to building and scaling a successful SaaS platform.
          </p>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 space-y-24 md:space-y-32">
        {/* SaaS Validation Framework */}
        <section id="validation" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            SaaS Idea Validation Framework
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl font-black validation-score mb-4">94/100</div>
                <p className="text-xl text-gray-300">Overall Validation Score</p>
                <p className="text-sm text-cyan-400">Exceptional market opportunity</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Problem Urgency', value: 92, color: 'from-red-500 to-orange-500' },
                  { label: 'Market Size', value: 96, color: 'from-green-500 to-emerald-500' },
                  { label: 'Willingness to Pay', value: 88, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Technical Feasibility', value: 98, color: 'from-purple-500 to-pink-500' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 glass-card rounded-lg">
                    <span>{item.label}</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full mr-3">
                        <div
                          className={`h-2 bg-linear-to-r ${item.color} rounded-full`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.value}%</span>
                    </div>
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
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Core Problem Analysis</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-lg mb-2">🎯 Primary Problem</h4>
                    <p className="text-gray-300">
                      The modern professional faces an overwhelming paradox: infinite learning resources but no clear
                      path to mastery. Career development is fragmented across multiple platforms, creating inefficiency
                      and decision paralysis.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-2">👥 Target Audience</h4>
                    <p className="text-gray-300">
                      Knowledge workers, career switchers, and organizations seeking efficient skill development.
                      Primary demographics: 25-45 years old, college-educated, earning $50K-$200K annually.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-2">⚡ Urgency Level</h4>
                    <div className="flex items-center mb-2">
                      <span className="text-red-400 font-bold text-xl mr-2">CRITICAL</span>
                      <div className="flex text-red-400">
                        {[...Array(3)].map((_, i) => (
                          <Zap key={i} className="w-5 h-5" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Skills become obsolete every 2-5 years. The "learn fast or become irrelevant" reality creates
                      immediate, pressing demand.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-2">💰 Willingness to Pay</h4>
                    <div className="flex items-center mb-2">
                      <span className="text-green-400 font-bold text-xl mr-2">HIGH</span>
                      <div className="flex text-green-400">
                        {[...Array(3)].map((_, i) => (
                          <DollarSign key={i} className="w-5 h-5" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Target users already spend $5K-$15K annually on courses, bootcamps, and coaching. Our integrated
                      solution at $29-$99/month represents 70%+ cost savings.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value Propositions */}
        <section id="value-props" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Value Proposition Suite
          </motion.h2>

          <div className="max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Primary Value Proposition</h3>
              <p className="text-xl text-gray-200 font-medium">
                "Kairoo transforms chaotic career development into strategic growth by combining AI-powered
                learning paths, comprehensive career tools, and business intelligence in one integrated platform, helping
                professionals and organizations accelerate skill acquisition and achieve measurable career outcomes."
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, color: 'text-purple-400', title: 'Action-Oriented Tone', desc: '"Stop wasting time on scattered resources. Kairoo delivers personalized career acceleration with AI precision, giving you the competitive edge you need today."' },
              { icon: Shield, color: 'text-cyan-400', title: 'Trust-Building Tone', desc: '"Trusted by thousands of professionals worldwide, Kairoo provides scientifically-backed learning methods and proven career strategies to ensure your growth investment pays dividends."' },
              { icon: Heart, color: 'text-pink-400', title: 'Aspirational Tone', desc: '"Unlock your unlimited potential. Kairoo doesn\'t just teach skills—it transforms lives, turning ambitious dreams into achievable realities through intelligent guidance."' },
            ].map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className={`${prop.color} mb-4`}>
                  <prop.icon className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-bold text-lg mb-3">{prop.title}</h4>
                <p className="text-gray-300">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ideal Customer Profiles */}
        <section id="icps" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Ideal Customer Profiles
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                initials: 'SC',
                name: 'Sarah Chen',
                title: 'The Ambitious Career Switcher',
                gradient: 'from-pink-500 to-red-500',
                accent: '#F59E0B',
                demographics: 'Marketing Manager → Data Scientist, Age 29, San Francisco, $85K salary',
                painPoints: [
                  'Overwhelmed by scattered learning resources',
                  'Imposter syndrome about technical skills',
                  'Limited time after work hours',
                  'Uncertain about career transition timeline',
                ],
                buyingBehavior: [
                  'Researches extensively before purchasing',
                  'Values structured learning paths',
                  'Willing to pay premium for efficiency',
                  'Seeks peer community and mentorship',
                ],
                successMetrics: 'Land $120K+ data science role within 12 months, build portfolio of 5 projects',
              },
              {
                initials: 'MR',
                name: 'Marcus Rodriguez',
                title: 'The Efficiency-Focused Professional',
                gradient: 'from-cyan-500 to-blue-500',
                accent: '#2DD4BF',
                demographics: 'Senior Software Engineer, Age 34, Austin, $140K salary, Team Lead',
                painPoints: [
                  'Staying current with rapidly evolving tech',
                  'Balancing learning with management duties',
                  'Finding quality content that\'s not too basic',
                  'Justifying learning time to leadership',
                ],
                buyingBehavior: [
                  'Quick decision-maker with clear ROI',
                  'Values time efficiency above cost savings',
                  'Prefers practical, project-based learning',
                  'Influences team\'s tool adoption decisions',
                ],
                successMetrics: 'Master new framework in 4-6 weeks, lead team transition, earn promotion to Staff Engineer',
              },
              {
                initials: 'AP',
                name: 'Amanda Park',
                title: 'The Strategic L&D Leader',
                gradient: 'from-purple-500 to-indigo-500',
                accent: '#0B1F3A',
                demographics: 'L&D Director, Age 41, Enterprise SaaS Company, $165K salary, Manages 500+ employees',
                painPoints: [
                  'Proving ROI of learning investments',
                  'Scaling personalized development programs',
                  'Outdated LMS with poor engagement',
                  'Tracking skill gaps across departments',
                ],
                buyingBehavior: [
                  'Requires extensive pilot programs',
                  'Focuses on measurable business outcomes',
                  'Needs executive stakeholder buy-in',
                  'Values vendor partnership and support',
                ],
                successMetrics: '80% employee engagement in learning, 25% faster skill acquisition, $2M+ in productivity gains',
              },
            ].map((icp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="icp-card glass-card p-8 rounded-2xl"
                style={{ '--accent-color': icp.accent } as React.CSSProperties}
              >
                <div className="text-center mb-6">
                  <div
                    className={`w-20 h-20 bg-linear-to-r ${icp.gradient} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
                  >
                    {icp.initials}
                  </div>
                  <h3 className="text-2xl font-bold">{icp.name}</h3>
                  <p className="text-cyan-400">{icp.title}</p>
                </div>

                <div className="text-left space-y-4">
                  <div>
                    <h4 className={`font-bold text-sm mb-1`} style={{ color: icp.accent }}>
                      DEMOGRAPHICS
                    </h4>
                    <p className="text-sm text-gray-300">{icp.demographics}</p>
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm mb-1`} style={{ color: icp.accent }}>
                      DAILY PAIN POINTS
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {icp.painPoints.map((point, i) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm mb-1`} style={{ color: icp.accent }}>
                      BUYING BEHAVIOR
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {icp.buyingBehavior.map((behavior, i) => (
                        <li key={i}>• {behavior}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm mb-1`} style={{ color: icp.accent }}>
                      SUCCESS METRICS
                    </h4>
                    <p className="text-sm text-gray-300">{icp.successMetrics}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Prioritization (MoSCoW) */}
        <section id="moscow" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Feature Prioritization Framework (MoSCoW)
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-80 w-full">
                <Doughnut data={moscowData} options={moscowOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  title: 'Must Have (Critical)',
                  color: 'red',
                  items: [
                    'AI-powered career roadmap generation',
                    'Core career tools suite (resume, interview, salary)',
                    'Basic learning path creation',
                    'User authentication and profiles',
                    'Payment processing and subscriptions',
                    'Mobile-responsive interface',
                  ],
                },
                {
                  title: 'Should Have (Important)',
                  color: 'orange',
                  items: [
                    'Advanced AI tutoring chatbot',
                    'Team analytics dashboard',
                    'Progress tracking and analytics',
                    'Integration with external platforms',
                    'Advanced customization options',
                    'Email automation and notifications',
                  ],
                },
                {
                  title: 'Could Have (Nice to Have)',
                  color: 'yellow',
                  items: [
                    'AI-powered content creation tools',
                    'Virtual reality learning modules',
                    'Advanced business intelligence features',
                    'White-label solutions',
                    'Mobile app (iOS/Android)',
                    'Advanced gamification elements',
                  ],
                },
                {
                  title: "Won't Have (Out of Scope)",
                  color: 'gray',
                  items: [
                    'Direct job placement services',
                    'Physical training or certification',
                    'Academic degree programs',
                    'HR management tools',
                    'Recruitment platform features',
                    'Enterprise ERP integrations',
                  ],
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`glass-card p-6 rounded-2xl border-l-4 border-${category.color}-500`}
                >
                  <h3 className={`text-xl font-bold text-${category.color}-400 mb-3`}>{category.title}</h3>
                  <ul className="text-sm text-gray-300 space-y-2 text-left">
                    {category.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Strategic Next Steps */}
        <section id="next-steps" className="text-center glass-card p-12 rounded-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Strategic Implementation Roadmap
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { phase: 'Phase 1', title: 'MVP Development', desc: 'Build core Must-Have features, establish user base, validate market fit', time: 'Months 1-3', color: 'text-cyan-400' },
              { phase: 'Phase 2', title: 'Feature Expansion', desc: 'Add Should-Have features, enterprise customers, scale operations', time: 'Months 4-8', color: 'text-purple-400' },
              { phase: 'Phase 3', title: 'Market Leadership', desc: 'Advanced features, partnerships, international expansion', time: 'Months 9-12', color: 'text-pink-400' },
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl font-bold ${phase.color} mb-2`}>{phase.phase}</div>
                <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                <p className="text-gray-300">{phase.desc}</p>
                <p className={`text-sm ${phase.color} mt-2`}>{phase.time}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

