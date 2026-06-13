'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardBody } from '@heroui/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FeatureModal from '@/components/FeatureModal';
import TeamSkillChart from '@/components/TeamSkillChart';
import IconRenderer from '@/components/IconRenderer';
import Modal from '@/components/Modal';
import { careerTools, learningFeatures } from '@/lib/ai-tools';
import {
  Sparkles,
  Rocket,
  PlayCircle,
  Star,
  Briefcase,
  GraduationCap,
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Check,
  ArrowRight,
  CheckCircle,
  Clock,
  Headphones,
  Calendar,
} from 'lucide-react';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<typeof careerTools[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const allFeatures = [...careerTools, ...learningFeatures].slice(0, 32);
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };
  const heroMetrics = [
    { label: 'Teams onboarded', value: '180+', color: 'from-cyan-400 to-blue-500' },
    { label: 'Avg. time saved / week', value: '11 hrs', color: 'from-purple-400 to-pink-500' },
    { label: 'AI actions automated', value: '48K', color: 'from-emerald-400 to-cyan-400' },
  ];

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <header className="pt-32 pb-16 text-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI • Gemini Integration
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Your AI-Powered Career & Learning
            <span className="block gradient-text mt-2">Command Center</span>
          </h1>
          <p className="max-w-4xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
            Stop wasting time on scattered career resources. Kairoo merges{' '}
            <span className="text-cyan-400 font-semibold">advanced career development tools</span> with{' '}
            <span className="text-purple-400 font-semibold">intelligent learning systems</span> and{' '}
            <span className="text-pink-400 font-semibold">strategic business insights</span>. From personalized AI
            roadmaps to enterprise team analytics, we provide everything you need to accelerate professional growth.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>94/100 Market Validation Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>$142B+ Market Opportunity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>32+ AI-Powered Tools</span>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              radius="full"
              size="lg"
              className="group bg-linear-to-r from-brand-navy via-brand-teal to-brand-teal-bright font-semibold text-white shadow-lg shadow-cyan-500/30"
            >
              <span className="flex items-center gap-2">
                Launch Your Journey
                <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              variant="bordered"
              radius="full"
              size="lg"
              className="group border-white/40 font-semibold text-gray-100 hover:border-cyan-400"
              onPress={() => setIsDemoModalOpen(true)}
            >
              <span className="flex items-center gap-2">
                Watch Demo
                <PlayCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
              </span>
            </Button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-3">Join 1,000+ professionals already using Kairoo</p>
            <div className="flex justify-center items-center space-x-1">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  SC
                </div>
                <div className="w-8 h-8 bg-linear-to-r from-purple-400 to-pink-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  MR
                </div>
                <div className="w-8 h-8 bg-linear-to-r from-orange-400 to-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  AP
                </div>
                <div className="w-8 h-8 bg-linear-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <div className="ml-3 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-400">4.9/5 rating</span>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroMetrics.map((metric, idx) => (
              <Card key={metric.label} className="border border-white/10 bg-white/5 backdrop-blur">
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-400">{metric.label}</p>
                    <p className="text-2xl font-black text-white">{metric.value}</p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-full bg-linear-to-br ${metric.color} opacity-80 blur-[1px]`}
                    aria-hidden="true"
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 space-y-24 md:space-y-32">
        {/* Platform Overview */}
        <motion.section
          className="section-shell"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="mb-6">
              <Briefcase className="w-12 h-12 text-brand-navy mb-4" />
              <h3 className="text-2xl font-bold mb-2">Career Development Suite</h3>
              <p className="text-gray-400">32+ AI-powered tools for every aspect of your professional journey</p>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div>✨ Dynamic Career Roadmaps</div>
              <div>✨ AI Interview Coach</div>
              <div>✨ Salary Negotiation Assistant</div>
              <div>✨ Performance Review Helper</div>
              <div className="text-cyan-400 font-semibold">+28 more tools</div>
            </div>
          </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="mb-6">
              <GraduationCap className="w-12 h-12 text-brand-amber mb-4" />
              <h3 className="text-2xl font-bold mb-2">Intelligent Learning Paths</h3>
              <p className="text-gray-400">AI-curated learning journeys from the best web resources</p>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div>🎯 Personalized Curricula</div>
              <div>🤖 AI Tutor Chatbot</div>
              <div>📊 Progress Tracking</div>
              <div>🛠️ Project-Based Learning</div>
              <div>🔄 Dynamic Adaptation</div>
            </div>
          </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="mb-6">
              <BarChart3 className="w-12 h-12 text-brand-teal-bright mb-4" />
              <h3 className="text-2xl font-bold mb-2">Strategic Business Intelligence</h3>
              <p className="text-gray-400">Comprehensive market analysis and competitive insights</p>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div>📈 Market Research Tools</div>
              <div>🎯 User Persona Development</div>
              <div>💼 GTM Strategy Planning</div>
              <div>📊 Growth Forecasting</div>
              <div>🏢 Enterprise Analytics</div>
            </div>
          </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          id="features"
          className="section-shell text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            The Most Complete Professional Toolkit Ever Built
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mt-4 text-lg text-gray-400 mb-12"
          >
            Every tool you need to plan, execute, and accelerate your professional growth, learning journey, and
            business strategy.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {allFeatures.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-card feature-card p-4 rounded-xl text-center cursor-pointer"
                onClick={() => {
                  setSelectedTool(tool);
                  setIsModalOpen(true);
                }}
              >
                <IconRenderer name={tool.icon} className={`w-8 h-8 mx-auto text-${tool.color} mb-2`} />
                <h3 className="font-bold text-sm mt-2">{tool.name}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-4">Experience the Power of AI Integration</h3>
            <p className="text-gray-400 mb-8">
              Every feature is powered by advanced AI models, providing personalized, contextual, and intelligent
              assistance for your unique needs.
            </p>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-linear-to-r from-brand-navy to-brand-teal-bright text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
            >
              Try Interactive Demo
            </button>
          </motion.div>
        </motion.section>

        {/* Success Stories & Testimonials */}
        <motion.section
          id="testimonials"
          className="section-shell text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Real Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mt-4 text-lg text-gray-400 mb-12"
          >
            See how professionals and organizations are transforming their careers with Kairoo
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Career Switch Success',
                quote:
                  "I went from marketing to data science in just 8 months using Kairoo. The personalized learning path saved me thousands of hours of research. I landed a $125K role at Google!",
                name: 'Sarah Chen',
                role: 'Data Scientist at Google',
                tag: 'Career Switcher Success',
                initials: 'SC',
                gradient: 'from-cyan-400 to-blue-500',
                tagColor: 'text-cyan-400',
              },
              {
                title: 'Leadership Growth',
                quote:
                  "Kairoo's AI coaching helped me navigate my promotion to Staff Engineer. The interview prep and salary negotiation tools were game-changers. Got a 40% raise!",
                name: 'Marcus Rodriguez',
                role: 'Staff Engineer at Stripe',
                tag: '40% Salary Increase',
                initials: 'MR',
                gradient: 'from-purple-400 to-pink-500',
                tagColor: 'text-purple-400',
              },
              {
                title: 'Enterprise Transformation',
                quote:
                  "Our team's productivity increased 300% after implementing Kairoo. The analytics dashboard gives us incredible insights into skill gaps and development ROI.",
                name: 'Amanda Park',
                role: 'L&D Director at Salesforce',
                tag: '300% Productivity Gain',
                initials: 'AP',
                gradient: 'from-orange-400 to-red-500',
                tagColor: 'text-pink-400',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl text-left"
              >
                <div className="flex items-start mb-6">
                  <div className="flex text-yellow-400 mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <div className={`text-sm ${testimonial.tagColor} font-bold`}>{testimonial.title}</div>
                </div>
                <blockquote className="text-gray-300 mb-6 italic">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 bg-linear-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold mr-4`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className={`text-xs ${testimonial.tagColor}`}>{testimonial.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-8">Measurable Impact Across Industries</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '75%', label: 'Faster Skill Acquisition', color: 'text-cyan-400' },
                { value: '$50K+', label: 'Average Salary Increase', color: 'text-purple-400' },
                { value: '6 Months', label: 'Average Career Transition Time', color: 'text-pink-400' },
                { value: '95%', label: 'User Satisfaction Rate', color: 'text-orange-400' },
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Team Analytics Demo */}
        <motion.section
          id="team-analytics"
          className="section-shell"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Team Analytics</h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your organization with AI-powered team skill tracking, development planning, and performance
              analytics.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Users, color: 'text-cyan-400', title: 'Real-Time Team Insights', desc: 'Monitor skill development across your entire organization' },
                { icon: TrendingUp, color: 'text-purple-400', title: 'Predictive Analytics', desc: 'Forecast skill gaps and plan strategic development initiatives' },
                { icon: Target, color: 'text-pink-400', title: 'Goal Alignment', desc: 'Connect individual development with business objectives' },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className={`w-8 h-8 ${item.color} shrink-0`} />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 glass-card rounded-2xl"
          >
            <h3 className="font-bold text-lg mb-4 text-center">Team Skill Matrix</h3>
            <TeamSkillChart />
          </motion.div>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          id="pricing"
          className="section-shell text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Choose Your Growth Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mt-4 text-lg text-gray-400 mb-12"
          >
            Start free and scale with your success
          </motion.p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Explorer',
                desc: 'For curious learners starting their journey',
                price: '$0',
                period: 'forever',
                features: ['5 AI career tools', '1 learning path', 'Basic progress tracking'],
                popular: false,
              },
              {
                name: 'Professional',
                desc: 'For ambitious professionals',
                price: '$29',
                period: '/mo',
                features: ['All 32+ AI career tools', 'Unlimited learning paths', 'Advanced analytics', 'Priority support'],
                popular: true,
              },
              {
                name: 'Enterprise',
                desc: 'For forward-thinking organizations',
                price: 'Custom',
                period: '',
                features: ['Everything in Professional', 'Team analytics dashboard', 'Custom integrations', 'Dedicated success manager'],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-8 rounded-2xl ${plan.popular ? 'border-2 border-cyan-400 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-cyan-400/20 text-cyan-300 font-bold py-1 px-3 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-gray-400">{plan.desc}</p>
                <p className="text-5xl font-extrabold mt-6">
                  {plan.price}
                  {plan.period && <span className="text-lg font-medium text-gray-400">/mo</span>}
                </p>
                <Button
                  radius="full"
                  className={`mt-6 w-full font-semibold ${
                    plan.popular
                      ? 'bg-linear-to-r from-brand-navy via-brand-teal to-brand-teal-bright text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {plan.price === 'Custom'
                    ? 'Contact Sales'
                    : plan.price === '$0'
                    ? 'Get Started'
                    : 'Start 14-Day Free Trial'}
                </Button>
                <ul className="mt-8 text-left space-y-3 text-gray-300">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
        </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="section-shell text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Transform Your Professional Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Join thousands of professionals and organizations already accelerating their growth with Kairoo.{' '}
              <span className="text-cyan-400 font-semibold">Start your transformation today.</span>
            </motion.p>

            {/* Objection Handling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
              {[
                { icon: CheckCircle, color: 'green', title: 'No Risk Trial', desc: '14-day free trial. Cancel anytime. No credit card required for Explorer plan.' },
                { icon: Clock, color: 'blue', title: 'Quick Setup', desc: 'Get started in under 5 minutes. Immediate access to all career tools and AI features.' },
                { icon: Headphones, color: 'purple', title: 'Expert Support', desc: '24/7 AI assistance plus human support from career development experts.' },
              ].map((item, index) => (
                <div key={index} className={`p-4 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-lg`}>
                  <h4 className={`font-bold text-${item.color}-400 mb-2 flex items-center`}>
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                radius="full"
                size="lg"
                className="group bg-linear-to-r from-brand-navy via-brand-teal to-brand-teal-bright text-white shadow-lg"
              >
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="bordered"
                radius="full"
                size="lg"
                className="group border-white/40 text-gray-100 hover:border-cyan-400"
              >
                <span className="flex items-center gap-2">
                  Schedule Demo
                  <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
                </span>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your data is secure and encrypted. SOC 2 Type II compliant. <span className="text-cyan-400">GDPR ready.</span>
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* Modals */}
      <FeatureModal tool={selectedTool} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Interactive Demo"
      >
        <p className="text-gray-300 mb-6">Experience the power of Kairoo with our interactive demo.</p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-bold text-cyan-400">Try a Career Tool</h3>
            <p className="text-sm text-gray-400">Select any tool from our feature grid to see it in action</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-bold text-purple-400">Generate a Learning Path</h3>
            <p className="text-sm text-gray-400">Enter a skill you want to learn and see our AI create a personalized curriculum</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-bold text-pink-400">Explore Team Analytics</h3>
            <p className="text-sm text-gray-400">See how organizations track and develop their team's capabilities</p>
          </div>
    </div>
        <button
          onClick={() => setIsDemoModalOpen(false)}
          className="w-full mt-6 bg-linear-to-r from-purple-500 to-cyan-500 text-white font-bold py-3 rounded-full"
        >
          Start Exploring
        </button>
      </Modal>
    </>
  );
}
