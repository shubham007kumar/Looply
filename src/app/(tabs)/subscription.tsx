import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Subscription() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>Subscription</Text>
    </SafeAreaView>
  );
}
