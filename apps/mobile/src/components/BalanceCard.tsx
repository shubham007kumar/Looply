import React from "react";
import { Text, View } from "react-native";
import { HOME_BALANCE } from "@/constants/data";
import { formatCurrency, formatShortDate } from "@/lib/utils";

export interface BalanceCardProps {
  amount?: number;
  renewalDate?: string;
  currency?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  amount = HOME_BALANCE.amount,
  renewalDate = HOME_BALANCE.nextRenewalDate,
  currency = "USD",
}) => {
  return (
    <View className="home-balance-card">
      <View className="home-balance-row">
        <Text className="home-balance-label">Balance</Text>
        <Text className="home-balance-date">{formatShortDate(renewalDate)}</Text>
      </View>
      <Text className="home-balance-amount">
        {formatCurrency(amount, currency)}
      </Text>
    </View>
  );
};

export default BalanceCard;
