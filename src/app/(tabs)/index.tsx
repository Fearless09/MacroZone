import MealList from "@/components/MealList";
import { useMealContext } from "@/context/MealContext";
import {
  cancelMealReminders,
  requestPermissions,
  scheduleMealReminders,
} from "@/lib/notification";
import { saveData } from "@/lib/storage";
import { colors, globalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const currentDate = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const REMINDERS_KEY = "remindersEnabled";

export default function Index() {
  const { totals, meals } = useMealContext();
  const [reminder, setReminder] = useState<boolean>(false);

  const kpis = useMemo(() => {
    return [
      {
        label: "Calories",
        value: totals.calories.toString(),
        goal: "$15,000",
        color: "#ff6b6b",
      },
      {
        label: "Proteins",
        value: `${totals.protein}g`,
        goal: "150g",
        color: "#4ecdc4",
      },
      {
        label: "Carbs",
        value: `${totals.carbs}g`,
        goal: "250g",
        color: "#ffd93d",
      },
      {
        label: "Fats",
        value: `${totals.fat}g`,
        goal: "65g",
        color: "#6bcb77",
      },
    ];
  }, [totals]);

  const handleShare = async () => {
    await Share.share({
      message: `MacroZone Daily Summary\n\nCalories: ${totals.calories}\nProtein: ${totals.protein}g\nCarbs: ${totals.carbs}g\nFat: ${totals.fat}g\n\nMeals: ${meals.length} logged today`,
    });
  };

  const handleCopy = async () => {
    const summary = `MacroZone Daily Summary\n\nCalories: ${totals.calories}\nProtein: ${totals.protein}g\nCarbs: ${totals.carbs}g\nFat: ${totals.fat}g\n\nMeals: ${meals.length} logged today`;

    await Clipboard.setStringAsync(summary);
    Alert.alert("Copied!", "Macro summary copied to clipboard.");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToggleReminders = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleMealReminders();
    } else {
      await cancelMealReminders();
    }
    setReminder(value);
    await saveData(REMINDERS_KEY, value.toString());
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>MacroZone</Text>

        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.date}>{currentDate}</Text>

      {/* KPIs Grid */}
      <View style={kpiStyles.container}>
        {kpis.map(({ color, goal, label, value }, idx) => (
          <View key={idx} style={[kpiStyles.card, { borderLeftColor: color }]}>
            <Text style={kpiStyles.label}>{label}</Text>
            <Text style={kpiStyles.value}>{value}</Text>
            <Text style={kpiStyles.goal}>/ {goal}</Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <TouchableOpacity style={styles.button} onPress={handleCopy}>
        <Ionicons name="copy-outline" size={18} color={colors.primary} />
        <Text style={styles.text}>Copy Summary</Text>
      </TouchableOpacity>

      {/* Reminders */}
      <View style={reminderStyles.container}>
        <Text style={reminderStyles.label}>Meal Reminders</Text>
        <Switch
          value={reminder}
          onValueChange={handleToggleReminders}
          trackColor={{ false: colors.surface, true: colors.primary }}
        />
      </View>

      {/* Recent Meals  */}
      <View>
        <Text style={globalStyles.sectionTitle}>Recent Meals</Text>
        <MealList recent />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: "#a0a0b0",
    marginTop: 4,
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  text: {
    color: colors.primary,
    fontSize: 14,
  },
});

const kpiStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    borderLeftWidth: 4,
  },
  label: {
    fontSize: 14,
    color: "#a0a0b0",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  goal: {
    fontSize: 14,
    color: "#a0a0b0",
    marginTop: 2,
  },
});

const reminderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
});
