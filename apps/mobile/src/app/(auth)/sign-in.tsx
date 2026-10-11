import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, Redirect, router } from "expo-router";
import { useAuth, useSignIn } from "@clerk/expo";
import { icons } from "@/constants/icons";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { signIn } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSignIn = async () => {
    if (!emailAddress.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setErrorMessage(
          finalizeError.message || "Failed to finalize session. Please try again."
        );
        return;
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: Math.max(insets.bottom, 24) + 24,
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* Top Brand Block */}
            <View className="mt-4 flex-row items-center justify-center gap-3">
              <Image
                source={icons.logo}
                className="size-14 rounded-2xl"
                resizeMode="contain"
              />
              <View className="justify-center">
                <Text className="text-2xl font-sans-bold text-primary tracking-tight">
                  Recurly
                </Text>
                <Text className="text-[11px] font-sans-semibold uppercase tracking-[1.5px] text-muted-foreground -mt-0.5">
                  SMART BILLING
                </Text>
              </View>
            </View>

            {/* Title & Subtitle */}
            <View className="mt-10 items-center">
              <Text className="text-3xl font-sans-bold text-primary text-center">
                Welcome back
              </Text>
              <Text className="mt-2 text-base font-sans-medium text-muted-foreground text-center">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Error Message */}
            {errorMessage && (
              <View className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Text className="text-sm font-sans-medium text-destructive text-center">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Form */}
            <View className="mt-8 gap-5">
              {/* Email Field */}
              <View className="gap-2">
                <Text className="text-base font-sans-semibold text-primary">
                  Email
                </Text>
                <TextInput
                  value={emailAddress}
                  onChangeText={(text) => {
                    setEmailAddress(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0, 0, 0, 0.35)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary"
                />
              </View>

              {/* Password Field */}
              <View className="gap-2">
                <Text className="text-base font-sans-semibold text-primary">
                  Password
                </Text>
                <View className="relative justify-center">
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0, 0, 0, 0.35)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="w-full rounded-2xl border border-border bg-card pl-4 pr-14 py-4 text-base font-sans-medium text-primary"
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={12}
                    className="absolute right-4 items-center justify-center py-2"
                  >
                    <Text className="text-xs font-sans-semibold text-muted-foreground">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSignIn}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                className="mt-3 w-full items-center justify-center rounded-2xl bg-accent py-4 active:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-base font-sans-bold text-white">
                    Sign in
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Footer Link */}
          <View className="mt-8 flex-row items-center justify-center gap-1.5 pb-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              New to Recurly?
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable hitSlop={8}>
                <Text className="text-sm font-sans-bold text-accent">
                  Create an account
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
