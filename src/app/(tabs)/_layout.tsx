import { colors } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ComponentProps } from "react";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surface,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      {tabs.map(({ icon, name, title }, idx) => (
        <Tabs.Screen
          key={idx}
          name={name}
          options={{
            title,
            tabBarIcon: (props) => <Ionicons name={icon} {...props} />,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;

type Tab = {
  name: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

const tabs: Tab[] = [
  {
    name: "index",
    title: "Home",
    icon: "home",
  },
  {
    name: "add-meal",
    title: "Add Meal",
    icon: "add-circle",
  },
  {
    name: "meals",
    title: "Meals",
    icon: "fast-food",
  },
];
