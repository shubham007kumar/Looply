import clsx from "clsx";
import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "../../../constants/data";
import { colors, components } from "../../../constants/theme";

interface TabIconProps {
  focused: boolean;
  image: any;
}

const tabBar = components.tabBar;

const TabIcon = ({ focused, image }: TabIconProps) => {
  return (
    <View className="tabs-icon">
      <View className={clsx("tabs-pill", focused && "tabs-active")}>
        <Image source={image} resizeMode="contain" className="tabs-glyph" />
      </View>
    </View>
  );
};

const TabLayout = () => {
  const inset = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(inset.bottom, tabBar.horizontalInset),
          left: Math.max(inset.left, tabBar.horizontalInset),
          right: Math.max(inset.right, tabBar.horizontalInset),
          height: tabBar.height,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: 'center'
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tabs.Screen
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} image={tab.icon} />
            ),
          }}
          key={index}
        />
      ))}
    </Tabs>
  );
};

const styles = StyleSheet.create({});

export default TabLayout;
