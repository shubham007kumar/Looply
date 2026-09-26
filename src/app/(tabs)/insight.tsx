import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);
export default function Insight() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Text>Insight</Text>
        </SafeAreaView>
    );
}