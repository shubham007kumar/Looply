import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import ScreenHeader from "@/components/ScreenHeader";
import ListHeading from "@/components/ListHeading";
import InsightsBarChart from "@/components/InsightsBarChart";
import ExpensesSummaryCard from "@/components/ExpensesSummaryCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";

import {
  INSIGHTS_HISTORY_SUBSCRIPTIONS,
  MONTHLY_EXPENSES_SUMMARY,
  WEEKLY_EXPENSES_DATA,
} from "@/constants/data";

export default function InsightScreen() {
  const insets = useSafeAreaInsets();
  const { subscriptions, totalBalance, cancelSubscription } = useSubscriptions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const displaySubscriptions =
    subscriptions.length > 0 ? subscriptions : INSIGHTS_HISTORY_SUBSCRIPTIONS;
  const displayAmount =
    subscriptions.length > 0 ? -totalBalance : MONTHLY_EXPENSES_SUMMARY.amount;

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCancelPress = (id: string, name: string) => {
    Alert.alert(
      "Cancel Subscription",
      `Are you sure you want to cancel your ${name} subscription?`,
      [
        { text: "Keep Subscription", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: () => {
            setCancellingId(id);
            setTimeout(() => {
              cancelSubscription(id);
              setCancellingId(null);
              setExpandedId(null);
            }, 600);
          },
        },
      ]
    );
  };

  const handleManagePayment = (sub: Subscription) => {
    Alert.alert(
      "Manage Payment",
      `Payment method: ${sub.paymentMethod || "*****8530"}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "Update Card",
          onPress: () => {
            Alert.alert("Success", "Payment method updated.");
          },
        },
      ]
    );
  };

  const handleChangePlan = (sub: Subscription) => {
    Alert.alert(
      "Change Plan",
      `Current plan: ${sub.planDetails || sub.plan || "Standard"}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Upgrade Plan",
          onPress: () => {
            Alert.alert("Success", "Plan change requested.");
          },
        },
      ]
    );
  };

  const handleMenuPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Export Monthly Report",
            "Select Time Period",
            "Share Insights",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            Alert.alert("Export", "Report downloaded as PDF.");
          } else if (buttonIndex === 2) {
            Alert.alert("Time Period", "Viewing: March 2026.");
          } else if (buttonIndex === 3) {
            Alert.alert("Share", "Sharing monthly summary.");
          }
        }
      );
    } else {
      Alert.alert(
        "Insights Options",
        "Choose an action",
        [
          {
            text: "Export Monthly Report",
            onPress: () => Alert.alert("Export", "Report downloaded as PDF."),
          },
          {
            text: "Select Time Period",
            onPress: () => Alert.alert("Time Period", "Viewing: March 2026."),
          },
          {
            text: "Share Insights",
            onPress: () => Alert.alert("Share", "Sharing monthly summary."),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24) + 96,
        }}
      >
        {/* Screen Header */}
        <ScreenHeader
          title="Monthly Insights"
          onMenuPress={handleMenuPress}
        />

        {/* Upcoming Section with Interactive Bar Chart */}
        <ListHeading
          title="Upcoming"
          actionLabel="View all"
          onActionPress={() => router.push("/(tabs)/subscription")}
        />

        <InsightsBarChart data={WEEKLY_EXPENSES_DATA} initialSelectedDay="Thr" />

        {/* Expenses Summary Card */}
        <ExpensesSummaryCard
          title={MONTHLY_EXPENSES_SUMMARY.title}
          period={MONTHLY_EXPENSES_SUMMARY.period}
          amount={displayAmount}
          percentageChange={MONTHLY_EXPENSES_SUMMARY.percentageChange}
        />

        {/* History Section */}
        <ListHeading
          title="History"
          actionLabel="View all"
          onActionPress={() => router.push("/(tabs)/subscription")}
        />

        {displaySubscriptions.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            icon={sub.icon}
            name={sub.name}
            plan={sub.plan}
            planDetails={sub.planDetails}
            category={sub.category}
            paymentMethod={sub.paymentMethod}
            status={sub.status}
            startDate={sub.startDate}
            price={sub.price}
            currency={sub.currency}
            billing={sub.billing}
            renewalDate={sub.renewalDate}
            color={sub.color}
            expanded={expandedId === sub.id}
            onPress={() => handleToggleExpand(sub.id)}
            onCancelPress={() => handleCancelPress(sub.id, sub.name)}
            onManagePress={() => handleManagePayment(sub)}
            onChangePlanPress={() => handleChangePlan(sub)}
            isCancelling={cancellingId === sub.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}