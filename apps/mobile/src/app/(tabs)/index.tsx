import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import HomeHeader from "@/components/HomeHeader";
import BalanceCard from "@/components/BalanceCard";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    subscriptions,
    totalBalance,
    upcomingSubscriptions,
    nextRenewalDate,
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
        <HomeHeader onAddPress={() => setIsAddModalVisible(true)} />

        <BalanceCard
          amount={totalBalance}
          renewalDate={nextRenewalDate}
        />

        <ListHeading
          title="Upcoming"
          actionLabel="View all"
          onActionPress={() => router.push("/(tabs)/subscription")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 4 }}
        >
          {upcomingSubscriptions.map((item) => (
            <UpcomingSubscriptionCard
              key={item.id}
              icon={item.icon}
              name={item.name}
              price={item.price}
              currency={item.currency}
              daysLeft={item.daysLeft}
              onPress={() => router.push("/(tabs)/subscription")}
            />
          ))}
        </ScrollView>

        <ListHeading
          title="All Subscriptions"
          actionLabel="View all"
          onActionPress={() => router.push("/(tabs)/subscription")}
        />

        {subscriptions.length === 0 ? (
          <Text className="home-empty-state">No subscriptions found</Text>
        ) : (
          subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              icon={sub.icon}
              name={sub.name}
              plan={sub.plan}
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
