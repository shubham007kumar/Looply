import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { UserDetailsCard } from "@/components";
import { colors } from "@/constants/theme";

export default function Setting() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24) + 96,
        }}
      >
        <View className="mb-6">
          <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
        </View>

        {/* Profile Card */}
        <View className="mb-6">
          <UserDetailsCard />
        </View>

        {/* App Info Card */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-6 gap-4">
          <Text className="text-base font-sans-bold text-primary">
            Application
          </Text>
          <View className="flex-row items-center justify-between py-2 border-b border-border">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              App Name
            </Text>
            <Text className="text-sm font-sans-semibold text-primary">
              Recurly Smart Billing
            </Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-border">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Version
            </Text>
            <Text className="text-sm font-sans-semibold text-primary">1.0.0</Text>
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Authentication
            </Text>
            <Text className="text-sm font-sans-semibold text-primary">
              Clerk Auth
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          className="items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 py-4 active:opacity-80"
        >
          {isSigningOut ? (
            <ActivityIndicator color={colors.destructive} />
          ) : (
            <Text className="text-base font-sans-bold text-destructive">
              Sign out
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}