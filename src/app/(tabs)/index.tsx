import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center bg-background p-6">
      {/* Test Card using global.css classes: home-balance-card, home-balance-label, home-balance-amount */}
      <View className="home-balance-card">
        <Text className="home-balance-label">NativeWind v5 Setup</Text>
        <Text className="home-balance-amount">Styles Loaded</Text>
        <Text className="text-sm font-sans-medium text-white/90">
          CSS applied directly from global.css with Tailwind CSS v4!
        </Text>
      </View>

      <Link href="/Onboarding" asChild>
        <Pressable className="mt-4 bg-accent p-3 rounded-lg w-full">
          <Text className="auth-button-text text-white text-center">Go to Onboarding</Text>
        </Pressable>
      </Link>
    </View>
  );
}
