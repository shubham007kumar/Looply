import React from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import clsx from "clsx";
import { icons } from "@/constants/icons";

export type BrandLogoVariant = "lockup" | "badge" | "icon";
export type BrandLogoSize = "sm" | "md" | "lg";
export type BrandLogoTheme = "cream" | "light" | "dark";

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  theme?: BrandLogoTheme;
  showSubtitle?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "lockup",
  size = "md",
  theme = "cream",
  showSubtitle = true,
  className,
  style,
}) => {
  if (variant === "icon") {
    const iconSizeClasses = {
      sm: "size-8",
      md: "size-12",
      lg: "size-16",
    }[size];

    return (
      <View className={clsx("items-center justify-center", className)} style={style}>
        <Image
          source={icons.logo}
          className={iconSizeClasses}
          resizeMode="contain"
          accessibilityLabel="Looply Logo"
        />
      </View>
    );
  }

  if (variant === "badge") {
    const badgeBgClass = {
      cream: "bg-card border-black/10",
      light: "bg-white/20 border-white/30",
      dark: "bg-primary border-white/10",
    }[theme];

    const textColorClass = {
      cream: "text-primary",
      light: "text-white",
      dark: "text-white",
    }[theme];

    const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5";
    const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

    return (
      <View
        className={clsx(
          "flex-row items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-sm",
          badgeBgClass,
          className
        )}
        style={style}
      >
        <Image
          source={icons.logo}
          className={iconSize}
          resizeMode="contain"
          accessibilityLabel="Looply"
        />
        <Text className={clsx("font-sans-bold tracking-tight", textSize, textColorClass)}>
          Looply
        </Text>
      </View>
    );
  }

  // variant === "lockup"
  const imageSizeClass = {
    sm: "size-10",
    md: "size-12",
    lg: "size-14",
  }[size];

  const titleSizeClass = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const titleColorClass = {
    cream: "text-primary",
    light: "text-white",
    dark: "text-white",
  }[theme];

  const subtitleColorClass = {
    cream: "text-muted-foreground",
    light: "text-white/80",
    dark: "text-white/70",
  }[theme];

  return (
    <View
      className={clsx("flex-row items-center justify-center gap-3", className)}
      style={style}
    >
      <Image
        source={icons.logo}
        className={imageSizeClass}
        resizeMode="contain"
        accessibilityLabel="Looply"
      />
      <View className="justify-center">
        <Text
          className={clsx(
            "font-sans-bold tracking-tight",
            titleSizeClass,
            titleColorClass
          )}
        >
          Looply
        </Text>
        {showSubtitle && (
          <Text
            className={clsx(
              "text-[10px] font-sans-semibold uppercase tracking-[1.5px] -mt-0.5",
              subtitleColorClass
            )}
          >
            SMART SUBSCRIPTIONS
          </Text>
        )}
      </View>
    </View>
  );
};

export default BrandLogo;
