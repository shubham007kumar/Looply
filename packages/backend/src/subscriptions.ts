import {
  DatabaseSubscription,
  mapDatabaseSubscription,
  mapSubscriptionToDatabase,
  NewSubscription,
  Subscription,
  SubscriptionStatus,
  UserSettings,
} from "@looply/types";
import { createSupabaseClient, isSupabaseConfigured } from "./client";

/**
 * Fetches all subscriptions belonging to the authenticated Clerk user.
 */
export async function getUserSubscriptions(
  clerkToken?: string | null
): Promise<{ data: Subscription[] | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const { data, error } = await client
      .from("subscriptions")
      .select("*")
      .order("renewal_date", { ascending: true, nullsFirst: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const subscriptions = (data as DatabaseSubscription[]).map(
      mapDatabaseSubscription
    );
    return { data: subscriptions, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Inserts a new subscription for the authenticated Clerk user.
 */
export async function addUserSubscription(
  clerkToken: string | null | undefined,
  userId: string,
  newSub: NewSubscription
): Promise<{ data: Subscription | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const payload = mapSubscriptionToDatabase(newSub, userId);

    const { data, error } = await client
      .from("subscriptions")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const created = mapDatabaseSubscription(data as DatabaseSubscription);
    return { data: created, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Updates the status (active, paused, cancelled) of a subscription.
 */
export async function updateSubscriptionStatus(
  clerkToken: string | null | undefined,
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<{ data: Subscription | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const { data, error } = await client
      .from("subscriptions")
      .update({ status })
      .eq("id", subscriptionId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const updated = mapDatabaseSubscription(data as DatabaseSubscription);
    return { data: updated, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Deletes a subscription for the authenticated user.
 */
export async function deleteUserSubscription(
  clerkToken: string | null | undefined,
  subscriptionId: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const { error } = await client
      .from("subscriptions")
      .delete()
      .eq("id", subscriptionId);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Retrieves the user settings.
 */
export async function getUserSettings(
  clerkToken: string | null | undefined
): Promise<{ data: UserSettings | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const { data, error } = await client
      .from("user_settings")
      .select("*")
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const settings: UserSettings = {
      userId: data.user_id,
      preferredCurrency: data.preferred_currency,
      monthlyBudget: data.monthly_budget ? Number(data.monthly_budget) : undefined,
      reminderDaysBefore: data.reminder_days_before ?? 2,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: settings, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Upserts user settings (preferred currency, monthly budget, etc.).
 */
export async function upsertUserSettings(
  clerkToken: string | null | undefined,
  settings: Partial<UserSettings> & { userId: string }
): Promise<{ data: UserSettings | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  try {
    const client = createSupabaseClient(clerkToken);
    const payload = {
      user_id: settings.userId,
      preferred_currency: settings.preferredCurrency || "USD",
      monthly_budget: settings.monthlyBudget ?? null,
      reminder_days_before: settings.reminderDaysBefore ?? 2,
    };

    const { data, error } = await client
      .from("user_settings")
      .upsert(payload)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        userId: data.user_id,
        preferredCurrency: data.preferred_currency,
        monthlyBudget: data.monthly_budget ? Number(data.monthly_budget) : undefined,
        reminderDaysBefore: data.reminder_days_before,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err };
  }
}
