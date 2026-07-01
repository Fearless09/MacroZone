import MealContextProvider from "@/context/MealContext";
import { colors } from "@/styles/globalStyles";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <MealContextProvider>
      <View
        style={{
          height: 50,
          width: "100%",
          top: 0,
          left: 0,
          backgroundColor: colors.background,
        }}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="update-meal/[slug]"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </MealContextProvider>
  );
}
