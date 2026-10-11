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
import { useAuth, useSignUp } from "@clerk/expo";
import { icons } from "@/constants/icons";
import { BrandLogo } from "@/components";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { signUp } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSignUp = async () => {
    if (!emailAddress.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to create account. Please try again.");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrorMessage(
          sendError.message || "Failed to send verification code to your email."
        );
        return;
      }

      setIsVerifying(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        setErrorMessage(error.message || "Invalid verification code. Please try again.");
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setErrorMessage(
          finalizeError.message || "Failed to complete account setup. Please try again."
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

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setErrorMessage(error.message || "Failed to resend verification code.");
      } else {
        setErrorMessage("Verification code resent! Please check your email.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resend code.");
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
            <BrandLogo variant="lockup" size="lg" className="mt-4" />

            {/* Title & Subtitle */}
            <View className="mt-10 items-center">
              <Text className="text-3xl font-sans-bold text-primary text-center">
                {isVerifying ? "Verify your email" : "Create an account"}
              </Text>
              <Text className="mt-2 text-base font-sans-medium text-muted-foreground text-center">
                {isVerifying
                  ? `Enter the verification code sent to ${emailAddress}`
                  : "Sign up to track and manage your subscriptions"}
              </Text>
            </View>

            {/* Error / Status Message */}
            {errorMessage && (
              <View className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Text className="text-sm font-sans-medium text-destructive text-center">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Verification Flow */}
            {isVerifying ? (
              <View className="mt-8 gap-5">
                <View className="gap-2">
                  <Text className="text-base font-sans-semibold text-primary">
                    Verification Code
                  </Text>
                  <TextInput
                    value={code}
                    onChangeText={(text) => {
                      setCode(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="rgba(0, 0, 0, 0.35)"
                    keyboardType="numeric"
                    autoFocus
                    className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-center text-xl font-sans-bold tracking-[6px] text-primary"
                  />
                </View>

                {/* Verify Button */}
                <Pressable
                  onPress={handleVerify}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel="Verify code"
                  className="mt-3 w-full items-center justify-center rounded-2xl bg-accent py-4 active:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-base font-sans-bold text-white">
                      Verify & Continue
                    </Text>
                  )}
                </Pressable>

                {/* Secondary Actions */}
                <View className="mt-2 flex-row items-center justify-between">
                  <Pressable
                    onPress={handleResendCode}
                    disabled={isLoading}
                    hitSlop={8}
                  >
                    <Text className="text-sm font-sans-semibold text-accent">
                      Resend code
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setIsVerifying(false);
                      setCode("");
                      setErrorMessage(null);
                    }}
                    disabled={isLoading}
                    hitSlop={8}
                  >
                    <Text className="text-sm font-sans-medium text-muted-foreground">
                      Change email
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              /* Normal Sign-Up Flow */
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
                      placeholder="Create a password"
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
                  onPress={handleSignUp}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel="Sign up"
                  className="mt-3 w-full items-center justify-center rounded-2xl bg-accent py-4 active:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-base font-sans-bold text-white">
                      Sign up
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          {/* Footer Link */}
          <View className="mt-8 flex-row items-center justify-center gap-1.5 pb-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Already have an account?
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={8}>
                <Text className="text-sm font-sans-bold text-accent">
                  Sign in
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
