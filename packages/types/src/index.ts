export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Subscription {
  id: string;
  userId?: string;
  name: string;
  plan?: string;
  planDetails?: string;
  category: string;
  price: number;
  currency: string;
  billing: string;
  status: SubscriptionStatus;
  paymentMethod?: string;
  startDate?: string;
  renewalDate?: string;
  color?: string;
  iconKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewSubscription = Omit<Subscription, "id" | "createdAt" | "updatedAt">;

export interface UpcomingSubscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  daysLeft: number;
  iconKey?: string;
  category?: string;
}

export interface DailyExpense {
  day: string;
  amount: number;
}

export interface ExpensesSummary {
  title: string;
  period: string;
  amount: number;
  percentageChange: string;
}

export interface UserSettings {
  userId: string;
  preferredCurrency: string;
  monthlyBudget?: number;
  reminderDaysBefore: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Raw PostgreSQL schema representation for Supabase queries
 */
export interface DatabaseSubscription {
  id: string;
  user_id: string;
  name: string;
  plan: string | null;
  plan_details: string | null;
  category: string;
  price: number;
  currency: string;
  billing: string;
  status: SubscriptionStatus;
  payment_method: string | null;
  start_date: string | null;
  renewal_date: string | null;
  color: string | null;
  icon_key: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Maps a database record (snake_case) to the frontend Subscription model (camelCase)
 */
export function mapDatabaseSubscription(db: DatabaseSubscription): Subscription {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    plan: db.plan ?? undefined,
    planDetails: db.plan_details ?? undefined,
    category: db.category,
    price: Number(db.price),
    currency: db.currency,
    billing: db.billing,
    status: db.status,
    paymentMethod: db.payment_method ?? undefined,
    startDate: db.start_date ?? undefined,
    renewalDate: db.renewal_date ?? undefined,
    color: db.color ?? undefined,
    iconKey: db.icon_key ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/**
 * Maps a frontend Subscription model to the database insert payload (snake_case)
 */
export function mapSubscriptionToDatabase(sub: NewSubscription, userId: string) {
  return {
    user_id: userId,
    name: sub.name,
    plan: sub.plan ?? null,
    plan_details: sub.planDetails ?? null,
    category: sub.category,
    price: sub.price,
    currency: sub.currency || "USD",
    billing: sub.billing,
    status: sub.status || "active",
    payment_method: sub.paymentMethod ?? null,
    start_date: sub.startDate ?? new Date().toISOString(),
    renewal_date: sub.renewalDate ?? null,
    color: sub.color ?? "#e8def8",
    icon_key: sub.iconKey ?? "wallet",
  };
}
