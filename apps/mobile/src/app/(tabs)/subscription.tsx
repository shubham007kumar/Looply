import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@/components/ScreenHeader";
import SubscriptionCard from "@/components/SubscriptionCard";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const {
    subscriptions,
    setSubscriptions,
    addSubscription,
    cancelSubscription,
    refresh,
    isRefreshing,
  } = useSubscriptions();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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
            "Add New Subscription",
            "Sort by Price (High to Low)",
            "Sort by Price (Low to High)",
            "Refresh Subscriptions",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            setIsAddModalVisible(true);
          } else if (buttonIndex === 2) {
            setSubscriptions((prev) =>
              [...prev].sort((a, b) => b.price - a.price)
            );
          } else if (buttonIndex === 3) {
            setSubscriptions((prev) =>
              [...prev].sort((a, b) => a.price - b.price)
            );
          } else if (buttonIndex === 4) {
            refresh();
          }
        }
      );
    } else {
      Alert.alert(
        "Subscription Options",
        "Choose an action",
        [
          { text: "Add New Subscription", onPress: () => setIsAddModalVisible(true) },
          {
            text: "Sort by Price",
            onPress: () =>
              setSubscriptions((prev) =>
                [...prev].sort((a, b) => b.price - a.price)
              ),
          },
          {
            text: "Refresh Subscriptions",
            onPress: () => refresh(),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleAddSubscription = (newSub: Subscription) => {
    addSubscription(newSub);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24) + 96,
        }}
      >
        <ScreenHeader
          title="My Subscriptions"
          onMenuPress={handleMenuPress}
        />

        {subscriptions.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-base font-sans-medium text-muted-foreground">
              No subscriptions found
            </Text>
          </View>
        ) : (
          subscriptions.map((sub) => (
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
          ))
        )}
      </ScrollView>

      <AddSubscriptionModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSubscription={handleAddSubscription}
      />
    </View>
  );
}
