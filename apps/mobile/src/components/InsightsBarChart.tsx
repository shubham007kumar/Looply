import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import clsx from "clsx";
import { colors } from "@/constants/theme";

export interface InsightsBarChartProps {
  data: DailyExpense[];
  initialSelectedDay?: string;
  onSelectDay?: (item: DailyExpense) => void;
}

const Y_AXIS_VALUES = [45, 35, 25, 5, 0];
const MAX_VAL = 45;
const CHART_BAR_MAX_HEIGHT = 125;

export const InsightsBarChart: React.FC<InsightsBarChartProps> = ({
  data,
  initialSelectedDay = "Thr",
  onSelectDay,
}) => {
  const [selectedDay, setSelectedDay] = useState(initialSelectedDay);

  const handleBarPress = (item: DailyExpense) => {
    setSelectedDay(item.day);
    if (onSelectDay) {
      onSelectDay(item);
    }
  };

  return (
    <View className="rounded-3xl border border-black/10 bg-card p-5">
      <View className="flex-row">
        {/* Y-Axis Labels */}
        <View className="mr-3 h-44 justify-between pb-7">
          {Y_AXIS_VALUES.map((val) => (
            <Text
              key={val}
              className="text-[11px] font-sans-medium text-muted-foreground text-right"
              style={{ width: 18 }}
            >
              {val}
            </Text>
          ))}
        </View>

        {/* Chart Drawing Area with Grid Lines and Bars */}
        <View className="flex-1">
          {/* Dashed Horizontal Grid Lines */}
          <View className="absolute inset-x-0 top-0 h-44 justify-between pb-8 pointer-events-none">
            {Y_AXIS_VALUES.slice(0, 4).map((val) => (
              <View
                key={val}
                style={styles.gridLine}
              />
            ))}
          </View>

          {/* Bars Row */}
          <View className="h-44 flex-row items-end justify-between px-1 pb-7">
            {data.map((item) => {
              const isSelected = selectedDay === item.day;
              const barHeight = Math.max(
                12,
                (item.amount / MAX_VAL) * CHART_BAR_MAX_HEIGHT
              );

              return (
                <Pressable
                  key={item.day}
                  onPress={() => handleBarPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.day}: $${item.amount}`}
                  className="items-center justify-end px-1"
                >
                  {/* Tooltip badge for selected bar */}
                  {isSelected ? (
                    <View className="items-center mb-1.5">
                      <View className="rounded-lg bg-white px-2 py-0.5 shadow-sm border border-black/5">
                        <Text className="text-[11px] font-sans-bold text-accent">
                          ${item.amount}
                        </Text>
                      </View>
                      <View style={styles.tooltipPointer} />
                    </View>
                  ) : (
                    <View className="h-6" />
                  )}

                  {/* Bar Capsule */}
                  <View
                    style={{ height: barHeight }}
                    className={clsx(
                      "w-2.5 rounded-full",
                      isSelected ? "bg-accent" : "bg-primary"
                    )}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* X-Axis Labels */}
          <View className="flex-row justify-between px-1 -mt-5">
            {data.map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <Pressable
                  key={item.day}
                  onPress={() => handleBarPress(item)}
                  className="items-center"
                  style={{ width: 28 }}
                >
                  <Text
                    className={clsx(
                      "text-xs font-sans-medium",
                      isSelected ? "text-primary font-sans-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    borderStyle: "dashed",
  },
  tooltipPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffffff",
    alignSelf: "center",
  },
});

export default InsightsBarChart;
