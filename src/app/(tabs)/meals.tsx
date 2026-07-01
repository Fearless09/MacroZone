import MealList from "@/components/MealList";
import { useMealContext } from "@/context/MealContext";
import { globalStyles } from "@/styles/globalStyles";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Meals = () => {
  const { mealDispatcher } = useMealContext();

  const handleClearMeals = () => {
    mealDispatcher({ type: "clear" });
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>All Meals</Text>
        <TouchableOpacity onPress={handleClearMeals}>
          <Text style={styles.clearBtn}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <MealList />
      </View>
    </ScrollView>
  );
};

export default Meals;

const styles = StyleSheet.create({
  clearBtn: {
    color: "red",
    fontSize: 16,
  },
});
