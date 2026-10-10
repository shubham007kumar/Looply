import React from "react";
import { Pressable, Text, View } from "react-native";

export const ListHeading: React.FC<ListHeadingProps> = ({
  title,
  actionLabel = "View all",
  onActionPress,
}) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      {onActionPress && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="list-action active:opacity-70"
        >
          <Text className="list-action-text">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ListHeading;
