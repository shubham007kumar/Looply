import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { useUser } from "@clerk/expo";
import { images } from "@/constants/images";
import { HOME_USER } from "@/constants/data";

export interface UserDetailsCardProps {
  name?: string;
  email?: string;
  avatar?: ImageSourcePropType;
  badgeLabel?: string;
  subtitle?: string;
  onPress?: () => void;
}

export const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
  name,
  email,
  avatar,
  badgeLabel = "Active Account",
  subtitle,
  onPress,
}) => {
  const { user } = useUser();

  const displayName =
    name ||
    user?.fullName ||
    (user?.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
      : null) ||
    user?.username ||
    (user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress.split("@")[0].charAt(0).toUpperCase() +
        user.primaryEmailAddress.emailAddress.split("@")[0].slice(1)
      : HOME_USER.name);

  const displayEmail =
    email ||
    subtitle ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "No email registered";

  const avatarSource: ImageSourcePropType =
    avatar || (user?.imageUrl ? { uri: user.imageUrl } : images.avatar);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className="rounded-3xl border border-border bg-card p-5 active:opacity-80"
    >
      <View className="flex-row items-center gap-4">
        <Image
          source={avatarSource}
          className="size-16 rounded-full border border-black/10"
          resizeMode="cover"
        />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-xl font-sans-bold text-primary flex-1"
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {badgeLabel ? (
              <View className="rounded-full bg-success/15 px-2.5 py-0.5">
                <Text className="text-[11px] font-sans-semibold text-success">
                  {badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            className="text-sm font-sans-medium text-muted-foreground mt-0.5"
            numberOfLines={1}
          >
            {displayEmail}
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default UserDetailsCard;
