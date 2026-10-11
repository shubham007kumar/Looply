import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants/icons";

export interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  onMenuPress,
  showBack = true,
  showMenu = true,
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="mb-4 flex-row items-center justify-between py-2">
      {showBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="size-12 items-center justify-center rounded-full border border-black/10 bg-card active:opacity-70"
        >
          <Image
            source={icons.back}
            className="size-5"
            resizeMode="contain"
          />
        </Pressable>
      ) : (
        <View className="size-12" />
      )}

      <Text
        className="text-2xl font-sans-bold text-primary"
        numberOfLines={1}
      >
        {title}
      </Text>

      {showMenu ? (
        <Pressable
          onPress={onMenuPress}
          accessibilityRole="button"
          accessibilityLabel="More options"
          className="size-12 items-center justify-center rounded-full border border-black/10 bg-card active:opacity-70"
        >
          <Image
            source={icons.menu}
            className="size-5"
            resizeMode="contain"
          />
        </Pressable>
      ) : (
        <View className="size-12" />
      )}
    </View>
  );
};

export default ScreenHeader;
