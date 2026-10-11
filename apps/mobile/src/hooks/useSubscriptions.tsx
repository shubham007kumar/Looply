import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { useAuth } from "@clerk/expo";
import {
  addUserSubscription,
  deleteUserSubscription,
  getUserSubscriptions,
  isSupabaseConfigured,
  NewSubscription,
  updateSubscriptionStatus,
} from "@looply/backend";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { getSubscriptionIcon } from "@/constants/icons";

export interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  totalBalance: number;
  upcomingSubscriptions: UpcomingSubscription[];
  nextRenewalDate: string;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  addSubscription: (newSub: Omit<Subscription, "id"> & { id?: string }) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null);

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const { userId, isSignedIn, getToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    isSupabaseConfigured() ? [] : HOME_SUBSCRIPTIONS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetchingRef = React.useRef(false);

  // Helper to obtain Clerk JWT for Supabase RLS (Native Third-Party Auth)
  const getClerkToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!isSignedIn) return null;
      // Modern Supabase projects (ES256/Third-Party Auth) accept Clerk's native RS256 session token
      const token = await getToken();
      if (token) {
        try {
          const parts = token.split(".");
          if (parts.length >= 2) {
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            console.log(
              "[Clerk Session Token] alg:",
              header.alg,
              "| kid:",
              header.kid,
              "| iss:",
              payload.iss,
              "| sub:",
              payload.sub
            );
          }
        } catch {}
        return token;
      }
      return null;
    } catch (err: any) {
      console.warn("[Clerk Auth] Error getting session token:", err?.message || err);
      return null;
    }
  }, [isSignedIn, getToken]);

  // Load subscriptions from Supabase or fallback
  const fetchSubscriptions = useCallback(
    async (showRefreshIndicator = false) => {
      if (!isSupabaseConfigured() || isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const token = await getClerkToken();
        if (!token) {
          // No Supabase-compatible JWT template found yet; fallback to sample data
          setSubscriptions((prev) => (prev.length === 0 ? HOME_SUBSCRIPTIONS : prev));
          return;
        }

        const { data, error } = await getUserSubscriptions(token);

        if (error) {
          console.warn("Could not fetch subscriptions from Supabase:", error.message);
          setSubscriptions((prev) => (prev.length === 0 ? HOME_SUBSCRIPTIONS : prev));
          return;
        }

        if (data && data.length > 0) {
          const mapped: Subscription[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            icon: getSubscriptionIcon(item.name, item.iconKey),
            plan: item.plan,
            planDetails: item.planDetails,
            category: item.category,
            paymentMethod: item.paymentMethod,
            status: item.status,
            startDate: item.startDate,
            price: item.price,
            currency: item.currency,
            billing: item.billing,
            renewalDate: item.renewalDate,
            color: item.color,
          }));
          setSubscriptions(mapped);
        } else if (data && data.length === 0) {
          // Connected to Supabase, but user has no subscriptions saved yet
          setSubscriptions([]);
        }
      } catch (err) {
        console.warn("Error fetching subscriptions:", err);
        setSubscriptions((prev) => (prev.length === 0 ? HOME_SUBSCRIPTIONS : prev));
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getClerkToken]
  );

  useEffect(() => {
    if (isSignedIn) {
      fetchSubscriptions();
    }
  }, [isSignedIn]); // Only trigger when sign-in status changes, avoiding rapid re-fetch loops

  // Add subscription handler (optimistic update + remote insert)
  const addSubscription = useCallback(
    async (newSub: Omit<Subscription, "id"> & { id?: string }) => {
      const tempId = newSub.id || `sub-${Date.now()}`;
      const subWithIcon: Subscription = {
        ...newSub,
        id: tempId,
        icon: newSub.icon || getSubscriptionIcon(newSub.name),
      };

      // 1. Optimistic UI update (always preserve in UI)
      setSubscriptions((prev) => [subWithIcon, ...prev]);

      // 2. Persist to Supabase if configured & user is signed in
      if (isSupabaseConfigured()) {
        if (!userId) {
          Alert.alert(
            "Saved Locally",
            "Subscription added locally. Sign in with Clerk to sync with Supabase cloud."
          );
          return;
        }

        try {
          const token = await getClerkToken();
          if (!token) {
            Alert.alert(
              "Saved Locally (Offline Mode)",
              "Subscription added! To sync with your Supabase database:\n\n1. In Clerk Dashboard -> JWT Templates, create a template named 'supabase'.\n2. Enter your Supabase JWT secret from Supabase Settings -> API."
            );
            return;
          }

          const payload: NewSubscription = {
            name: newSub.name,
            plan: newSub.plan,
            planDetails: newSub.planDetails,
            category: newSub.category || "General",
            price: newSub.price,
            currency: newSub.currency || "USD",
            billing: newSub.billing,
            status: (newSub.status as any) || "active",
            paymentMethod: newSub.paymentMethod,
            startDate: newSub.startDate,
            renewalDate: newSub.renewalDate,
            color: newSub.color,
            iconKey: undefined,
          };

          const { data, error } = await addUserSubscription(token, userId, payload);
          if (error) {
            console.warn("Failed to persist subscription to Supabase:", error.message);
            // Retain the local addition so user data is not lost, but inform them
            Alert.alert(
              "Saved Locally (Sync Error)",
              `Subscription kept locally. Supabase sync error: ${error.message}\n\nPlease add Clerk as a Third-Party Auth provider in Supabase Dashboard (Authentication -> Third-Party Auth) with your Clerk domain.`
            );
          } else if (data) {
            // Replace temporary optimistic ID with real Supabase UUID
            setSubscriptions((prev) =>
              prev.map((item) =>
                item.id === tempId ? { ...item, id: data.id } : item
              )
            );
          }
        } catch (err: any) {
          console.warn("Error calling addUserSubscription:", err);
          Alert.alert(
            "Saved Locally",
            `Subscription kept locally. Sync error: ${err?.message || "Unknown error"}`
          );
        }
      }
    },
    [getClerkToken, userId]
  );

  // Cancel subscription handler
  const cancelSubscription = useCallback(
    async (id: string) => {
      // 1. Optimistic UI update
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, status: "cancelled" } : sub
        )
      );

      // 2. Persist to Supabase
      if (isSupabaseConfigured()) {
        try {
          const token = await getClerkToken();
          const { error } = await updateSubscriptionStatus(token, id, "cancelled");
          if (error) {
            console.warn("Failed to update status in Supabase:", error.message);
          }
        } catch (err) {
          console.warn("Error cancelling subscription:", err);
        }
      }
    },
    [getClerkToken]
  );

  // Delete subscription handler
  const deleteSubscription = useCallback(
    async (id: string) => {
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));

      if (isSupabaseConfigured()) {
        try {
          const token = await getClerkToken();
          const { error } = await deleteUserSubscription(token, id);
          if (error) {
            console.warn("Failed to delete subscription in Supabase:", error.message);
          }
        } catch (err) {
          console.warn("Error deleting subscription:", err);
        }
      }
    },
    [getClerkToken]
  );

  // Calculate dynamic total balance from active subscriptions
  const totalBalance = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "active");
    if (active.length === 0 && !isSupabaseConfigured()) return HOME_BALANCE.amount;
    return Number(
      active.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0).toFixed(2)
    );
  }, [subscriptions]);

  // Derive upcoming renewal subscriptions
  const upcomingSubscriptions = useMemo((): UpcomingSubscription[] => {
    const active = subscriptions.filter((s) => s.status === "active");
    if (active.length === 0 && !isSupabaseConfigured()) return UPCOMING_SUBSCRIPTIONS;

    return active.slice(0, 5).map((sub, idx) => ({
      id: sub.id,
      name: sub.name,
      price: sub.price,
      currency: sub.currency || "USD",
      icon: sub.icon || getSubscriptionIcon(sub.name),
      daysLeft: (idx + 1) * 2,
    }));
  }, [subscriptions]);

  const value = useMemo(
    () => ({
      subscriptions,
      setSubscriptions,
      totalBalance,
      upcomingSubscriptions,
      nextRenewalDate: HOME_BALANCE.nextRenewalDate,
      isLoading,
      isRefreshing,
      refresh: () => fetchSubscriptions(true),
      addSubscription,
      cancelSubscription,
      deleteSubscription,
    }),
    [
      subscriptions,
      totalBalance,
      upcomingSubscriptions,
      isLoading,
      isRefreshing,
      fetchSubscriptions,
      addSubscription,
      cancelSubscription,
      deleteSubscription,
    ]
  );

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
}
