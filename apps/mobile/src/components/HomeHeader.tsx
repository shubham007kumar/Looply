import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useUser } from "@clerk/expo";
import { HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export interface HomeHeaderProps {
  userName?: string;
  userAvatar?: ImageSourcePropType;
  onAddPress?: () => void;
  onProfilePress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  userAvatar,
  onAddPress,
  onProfilePress,
}) => {
  const { user } = useUser();

  const getDisplayName = (): string => {
    if (userName) return userName;
    if (user?.fullName) return user.fullName;
    if (user?.firstName) {
      return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`;
    }
    if (user?.username) return user.username;
    if (user?.primaryEmailAddress?.emailAddress) {
      const emailPrefix = user.primaryEmailAddress.emailAddress.split("@")[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return HOME_USER.name;
  };

  const getAvatarSource = (): ImageSourcePropType => {
    if (userAvatar) return userAvatar;
    if (user?.imageUrl) return { uri: user.imageUrl };
    return images.avatar;
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push("/(tabs)/setting");
    }
  };

  return (
    <View className="home-header">
      <Pressable
        onPress={handleProfilePress}
        accessibilityRole="button"
        accessibilityLabel="View profile"
        className="home-user active:opacity-75"
      >
        <Image
          source={getAvatarSource()}
          className="home-avatar"
          resizeMode="cover"
        />
        <View className="ml-3.5 justify-center">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Image
              source={icons.logo}
              className="size-3.5"
              resizeMode="contain"
            />
            <Text className="text-[11px] font-sans-bold uppercase tracking-wider text-muted-foreground">
              Looply
            </Text>
          </View>
          <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
            {getDisplayName()}
          </Text>
        </View>
      </Pressable>

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
