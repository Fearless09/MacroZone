import { MealInsert, useMealContext } from "@/context/MealContext";
import {
  buttonStyles,
  colors,
  globalStyles,
  inputStyles,
} from "@/styles/globalStyles";
import * as Heptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export const emptyForm = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};
const AddMeal = () => {
  const { mealDispatcher } = useMealContext();
  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = useCallback(
    (field: keyof MealInsert, value: string, format: boolean = false) => {
      const formattedValue = format ? value.replace(/\D/g, "") : value;
      setFormData((prevState) => ({ ...prevState, [field]: formattedValue }));
    },
    [],
  );

  const handleAddMeal = () => {
    const { calories, carbs, fat, name, protein } = formData;

    if (!name || !calories) {
      Alert.alert("Error", "Please enter a meal name and calories.");
      return;
    }

    mealDispatcher({
      type: "add",
      payload: {
        name,
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        protein: Number(protein) || 0,
      },
    });

    Alert.alert("Success", "Meal added successfully!");
    setFormData(emptyForm);
    Heptics.notificationAsync(Heptics.NotificationFeedbackType.Success);

    router.push("/");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Add Meal</Text>

      <TextInput
        style={inputStyles.input}
        placeholder="Meal name"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <TextInput
        style={inputStyles.input}
        placeholder="Calories"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={formData.calories}
        onChangeText={(value) => handleInputChange("calories", value, true)}
        inputMode="numeric"
      />

      <View style={inputStyles.row}>
        <TextInput
          style={[inputStyles.input, inputStyles.rowInput]}
          placeholder="Protein (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.protein}
          onChangeText={(value) => handleInputChange("protein", value, true)}
          inputMode="numeric"
        />
        <TextInput
          style={[inputStyles.input, inputStyles.rowInput]}
          placeholder="Carbs (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.carbs}
          onChangeText={(value) => handleInputChange("carbs", value, true)}
          inputMode="numeric"
        />
        <TextInput
          style={[inputStyles.input, inputStyles.rowInput]}
          placeholder="Fat (g)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={formData.fat}
          onChangeText={(value) => handleInputChange("fat", value, true)}
          inputMode="numeric"
        />
      </View>

      <TouchableOpacity style={buttonStyles.button} onPress={handleAddMeal}>
        <Text style={buttonStyles.buttonText}>Add Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddMeal;
