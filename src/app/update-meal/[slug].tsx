import { MealInsert, useMealContext } from "@/context/MealContext";
import {
  buttonStyles,
  colors,
  globalStyles,
  inputStyles,
} from "@/styles/globalStyles";
import * as Heptics from "expo-haptics";
import { RoutePath, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { emptyForm } from "../(tabs)/add-meal";

const Updatemeal = () => {
  const { slug } = useLocalSearchParams<RoutePath>();
  const { meals, mealDispatcher } = useMealContext();
  const meal = meals.find((m) => m.id === slug);

  if (!meal) {
    return <Text style={globalStyles.empty}>No meal found.</Text>;
  }

  const [formData, setFormData] = useState({
    name: meal.name,
    calories: meal.calories.toString(),
    protein: meal.protein.toString(),
    carbs: meal.carbs.toString(),
    fat: meal.fat.toString(),
  });

  const handleInputChange = (
    field: keyof MealInsert,
    value: string,
    format: boolean = false,
  ) => {
    const formattedValue = format ? value.replace(/\D/g, "") : value;
    setFormData((prevState) => ({ ...prevState, [field]: formattedValue }));
  };

  const handleUpdateMeal = () => {
    const { calories, carbs, fat, name, protein } = formData;

    if (!name || !calories) {
      Alert.alert("Error", "Please enter a meal name and calories.");
      return;
    }

    mealDispatcher({
      type: "update",
      payload: {
        id: meal.id,
        name,
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        protein: Number(protein) || 0,
      },
    });

    Alert.alert("Success", "Meal updated successfully!");
    setFormData(emptyForm);
    Heptics.notificationAsync(Heptics.NotificationFeedbackType.Success);

    router.back();
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>Update {meal.name}</Text>

      <TextInput
        style={[inputStyles.input, { backgroundColor: colors.background }]}
        placeholder="Meal name"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <TextInput
        style={[inputStyles.input, { backgroundColor: colors.background }]}
        placeholder="Calories"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={formData.calories}
        onChangeText={(value) => handleInputChange("calories", value, true)}
        inputMode="numeric"
      />

      <View style={inputStyles.row}>
        <TextInput
          style={[
            inputStyles.input,
            inputStyles.rowInput,
            { backgroundColor: colors.background },
          ]}
          placeholder="Protein (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.protein}
          onChangeText={(value) => handleInputChange("protein", value, true)}
          inputMode="numeric"
        />
        <TextInput
          style={[
            inputStyles.input,
            inputStyles.rowInput,
            { backgroundColor: colors.background },
          ]}
          placeholder="Carbs (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.carbs}
          onChangeText={(value) => handleInputChange("carbs", value, true)}
          inputMode="numeric"
        />
        <TextInput
          style={[
            inputStyles.input,
            inputStyles.rowInput,
            { backgroundColor: colors.background },
          ]}
          placeholder="Fat (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.fat}
          onChangeText={(value) => handleInputChange("fat", value, true)}
          inputMode="numeric"
        />
      </View>

      <TouchableOpacity
        style={[buttonStyles.button]}
        onPress={handleUpdateMeal}
      >
        <Text style={buttonStyles.buttonText}>Update Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Updatemeal;

const style = StyleSheet.create({
  container: {
    paddingInline: 20,
    paddingTop: 30,
    backgroundColor: colors.surface,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
});
