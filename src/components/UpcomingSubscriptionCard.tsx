import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";

export const UpcomingSubscriptionCard: React.FC<UpcomingSubscriptionCardProps> = ({
  icon,
  name,
  price,
  currency = "USD",
  daysLeft,
  onPress,
}) => {
  const content = (
    <>
      <View className="upcoming-row">
        <Image
          source={icon}
          className="upcoming-icon"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="upcoming-price" numberOfLines={1}>
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft} days left
          </Text>
        </View>
      </View>
      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="upcoming-card active:opacity-80"
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View className="upcoming-card">{content}</View>;
};

export default UpcomingSubscriptionCard;
