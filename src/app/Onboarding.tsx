import React from "react";
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-accent">
      <StatusBar barStyle="light-content" />

      {/* Background Graphic Pattern */}
      <View className="flex-1 justify-center items-center overflow-hidden">
        <Image
          source={images.splashPattern}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Bottom Content Card */}
      <View
        className="px-6 pb-6 pt-4 bg-accent"
        style={{ paddingBottom: Math.max(insets.bottom, 24) + 16 }}
      >
        <Text className="text-4xl font-sans-extrabold text-white text-center leading-tight">
          Gain Financial Clarity
        </Text>
        <Text className="mt-3 text-base font-sans-medium text-white/90 text-center">
          Track, analyze and cancel with ease
        </Text>

        <Pressable
          onPress={() => router.push("/(auth)/sign-in")}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          className="mt-8 w-full items-center justify-center rounded-full bg-white py-4 active:opacity-90 shadow-sm"
        >
          <Text className="text-base font-sans-bold text-primary">
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}