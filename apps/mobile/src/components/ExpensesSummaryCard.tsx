import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";

export interface ExpensesSummaryCardProps {
  title?: string;
  period?: string;
  amount: number;
  percentageChange?: string;
}

export const ExpensesSummaryCard: React.FC<ExpensesSummaryCardProps> = ({
  title = "Expenses",
  period = "March 2026",
  amount = -424.63,
  percentageChange = "+12%",
}) => {
  const formattedAmount =
    amount < 0
      ? `-${formatCurrency(Math.abs(amount))}`
      : formatCurrency(amount);

  return (
    <View className="mt-4 rounded-3xl border border-black/10 bg-card p-5 flex-row items-center justify-between">
      <View>
        <Text className="text-xl font-sans-bold text-primary">{title}</Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          {period}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-2xl font-sans-bold text-primary">
          {formattedAmount}
        </Text>
        {percentageChange && (
          <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
            {percentageChange}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ExpensesSummaryCard;
