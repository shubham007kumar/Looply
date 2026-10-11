import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import clsx from "clsx";
import { icons } from "@/constants/icons";

export interface AddSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSubscription: (sub: Subscription) => void;
}

const CATEGORIES = [
  "Design",
  "AI Tools",
  "Developer Tools",
  "Entertainment",
  "Productivity",
];

const BILLING_OPTIONS = ["Monthly", "Yearly"];

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  visible,
  onClose,
  onAddSubscription,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState("Monthly");
  const [category, setCategory] = useState("Design");

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;

    const numPrice = parseFloat(price) || 0;
    const newSubscription: Subscription = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon: icons.wallet,
      price: numPrice,
      billing,
      category,
      plan: `${category} Plan`,
      status: "active",
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      color: "#e8def8",
    };

    onAddSubscription(newSubscription);
    setName("");
    setPrice("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="modal-overlay justify-end"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              onPress={onClose}
              className="modal-close"
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 32 }}
            className="modal-body"
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-field">
              <Text className="auth-label">Subscription Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Netflix, Spotify, OpenAI"
                placeholderTextColor="rgba(8, 17, 38, 0.4)"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price (USD)</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 19.99"
                keyboardType="decimal-pad"
                placeholderTextColor="rgba(8, 17, 38, 0.4)"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Billing Cycle</Text>
              <View className="picker-row">
                {BILLING_OPTIONS.map((item) => {
                  const isActive = billing === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setBilling(item)}
                      className={clsx(
                        "picker-option",
                        isActive && "picker-option-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          isActive && "picker-option-text-active"
                        )}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx(
                        "category-chip",
                        isActive && "category-chip-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          isActive && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!name.trim() || !price.trim()}
              className={clsx(
                "auth-button mt-4",
                (!name.trim() || !price.trim()) && "opacity-50"
              )}
            >
              <Text className="auth-button-text">Add Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddSubscriptionModal;
