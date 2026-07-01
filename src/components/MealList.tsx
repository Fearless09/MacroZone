import { Meal, useMealContext } from "@/context/MealContext";
import { globalStyles } from "@/styles/globalStyles";
import * as Heptics from "expo-haptics";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  recent?: boolean;
}
const MealList = ({ recent = false }: Props) => {
  const { mealDispatcher, meals } = useMealContext();

  const handleLongPress = (meal: Meal) => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete "${meal.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            mealDispatcher({ type: "remove", payload: meal.id });
            Heptics.notificationAsync(Heptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  if (meals.length === 0) {
    return <Text style={globalStyles.empty}>No meals logged yet.</Text>;
  }

  return (recent ? meals.slice(0, 5) : meals).map((meal, idx) => (
    <TouchableOpacity
      style={syles.container}
      key={idx}
      onLongPress={() => handleLongPress(meal)}
      onPress={() => router.push(`/update-meal/${meal.id}`)}
    >
      <Text style={syles.name}>{meal.name}</Text>
      <Text style={syles.macros}>
        {meal.calories} cal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g
        F
      </Text>
    </TouchableOpacity>
  ));
};

export default MealList;

export const syles = StyleSheet.create({
  container: {
    backgroundColor: "#16213e",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  macros: {
    fontSize: 13,
    color: "#a0a0b0",
    marginTop: 4,
  },
});
