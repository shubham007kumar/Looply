import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import clsx from "clsx";
import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  icon,
  name,
  plan,
  planDetails,
  category,
  paymentMethod,
  status,
  startDate,
  price,
  currency = "USD",
  billing,
  renewalDate,
  color,
  expanded,
  onPress,
  onCancelPress,
  onManagePress,
  onChangePlanPress,
  isCancelling = false,
}) => {
  const billingLabel = billing
    ? /^\d+\s*month/i.test(billing) || /^\d+\s*year/i.test(billing)
      ? billing
      : billing.toLowerCase() === "monthly"
      ? "per month"
      : billing.toLowerCase() === "yearly"
      ? "per year"
      : billing
    : "per month";

  const subtitle = plan || category || formatSubscriptionDateTime(startDate);

  return (
    <View
      className={clsx("sub-card mb-3.5", expanded && "sub-card-expanded")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${name} subscription card, ${expanded ? "expanded" : "collapsed"}`}
        className="sub-head"
      >
        <View className="sub-main">
          <View
            className={clsx(
              "size-14 items-center justify-center rounded-2xl",
              expanded ? "bg-white" : "bg-muted/80"
            )}
          >
            <Image
              source={icon}
              className="size-8"
              resizeMode="contain"
            />
          </View>
          <View className="sub-copy">
            <Text className="sub-title" numberOfLines={1}>
              {name}
            </Text>
            <Text className="sub-meta" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="sub-billing">{billingLabel}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment info:</Text>
                <Text className="sub-value" numberOfLines={1}>
                  {paymentMethod || "*****8530"}
                </Text>
              </View>
              <Pressable
                onPress={onManagePress}
                accessibilityRole="button"
                accessibilityLabel="Manage payment info"
                className="rounded-full border border-black/20 bg-background/50 px-3 py-1 active:opacity-70"
              >
                <Text className="text-xs font-sans-semibold text-primary">
                  Manage
                </Text>
              </Pressable>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Plan details:</Text>
                <Text className="sub-value" numberOfLines={1}>
                  {planDetails || plan || category || "Standard"}
                </Text>
              </View>
              <Pressable
                onPress={onChangePlanPress}
                accessibilityRole="button"
                accessibilityLabel="Change plan details"
                className="rounded-full border border-black/20 bg-background/50 px-3 py-1 active:opacity-70"
              >
                <Text className="text-xs font-sans-semibold text-primary">
                  Change
                </Text>
              </Pressable>
            </View>

            {renewalDate && (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Renewal:</Text>
                  <Text className="sub-value" numberOfLines={1}>
                    {formatSubscriptionDateTime(renewalDate)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Pressable
            onPress={onCancelPress}
            disabled={isCancelling}
            accessibilityRole="button"
            accessibilityLabel="Cancel subscription"
            className={clsx(
              "sub-cancel active:opacity-80",
              isCancelling && "sub-cancel-disabled"
            )}
          >
            <Text className="sub-cancel-text">
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default SubscriptionCard;
