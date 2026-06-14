import { pgTable, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  careerGoal: text('career_goal'),
  timezone: text('timezone').default('UTC'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).notNull().default('free'),
  status: text('status', { enum: ['active', 'cancelled', 'past_due', 'trialing'] }).notNull().default('active'),
  razorpaySubscriptionId: text('razorpay_subscription_id'),
  razorpayCustomerId: text('razorpay_customer_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const usageEvents = pgTable('usage_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  featureId: text('feature_id').notNull(),
  tokensUsed: integer('tokens_used').notNull().default(0),
  creditsUsed: integer('credits_used').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const roadmaps = pgTable('roadmaps', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  goal: text('goal').notNull(),
  planJson: jsonb('plan_json'),
  status: text('status', { enum: ['active', 'completed', 'archived'] }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const activityLog = pgTable('activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'ai_run' | 'roadmap_created' | 'goal_completed' | 'streak_milestone'
  featureId: text('feature_id'),
  title: text('title').notNull(),
  payloadJson: jsonb('payload_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  xpReward: integer('xp_reward').notNull().default(50),
  completed: boolean('completed').notNull().default(false),
  weekOf: text('week_of').notNull(), // ISO week string e.g. "2026-W24"
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
