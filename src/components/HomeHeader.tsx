import React from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";
import { HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export interface HomeHeaderProps {
  userName?: string;
  userAvatar?: ImageSourcePropType;
  onAddPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = HOME_USER.name,
  userAvatar = images.avatar,
  onAddPress,
}) => {
  return (
    <View className="home-header">
      <View className="home-user">
        <Image
          source={userAvatar}
          className="home-avatar"
          resizeMode="cover"
        />
        <Text className="home-user-name" numberOfLines={1}>
          {userName}
        </Text>
      </View>

      <Pressable
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add subscription"
        className="home-add-icon items-center justify-center rounded-full border border-black/10 bg-card active:opacity-70"
      >
        <Image
          source={icons.plus}
          className="size-5"
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

export default HomeHeader;
