import { mealSeed } from "@/lib/seed";
import { getData, saveData } from "@/lib/storage";
import { randomUUID } from "expo-crypto";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const MEALS_KEY = "meals";

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};
export type MealInsert = Omit<Meal, "id" | "createdAt">;

type Action =
  | { type: "fetch"; payload: Meal[] }
  | { type: "add"; payload: MealInsert }
  | { type: "remove"; payload: string }
  | { type: "update"; payload: MealInsert & { id: string } }
  | { type: "clear" };

interface MealContextType {
  meals: Meal[];
  mealDispatcher: (action: Action) => void;
  totals: {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
}

const Context = createContext<MealContextType | undefined>(undefined);

const MealContextProvider = ({ children }: { children: ReactNode }) => {
  const [meals, dispatch] = useReducer(reducer, []);
  const mealDispatcher = (action: Action) => dispatch(action);

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
        protein: acc.protein + meal.protein,
      }),
      {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
      },
    );
  }, [meals]);

  useEffect(() => {
    const fetchMeals = async () => {
      const meals = await getData<Meal[]>(MEALS_KEY, []);

      if (meals.length === 0) {
        // Seed Meals
        saveData(MEALS_KEY, mealSeed);
        dispatch({ type: "fetch", payload: mealSeed });
        return;
      }
      dispatch({ type: "fetch", payload: meals });
    };
    fetchMeals();
  }, []);

  return (
    <Context.Provider value={{ meals, mealDispatcher, totals }}>
      {children}
    </Context.Provider>
  );
};

export default MealContextProvider;

export const useMealContext = () => {
  const context = useContext(Context);

  if (!context) throw Error("useMealContext must be used within a MealContext");
  return context;
};

const reducer = (state: Meal[], action: Action): Meal[] => {
  const { type } = action;

  switch (type) {
    case "fetch": {
      return action.payload;
    }
    case "add": {
      const { payload } = action;

      const meals: Meal[] = [
        {
          ...payload,
          id: randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...state,
      ];

      saveData<Meal[]>(MEALS_KEY, meals);
      return meals;
    }
    case "remove": {
      const meals = state.filter((meal) => meal.id !== action.payload);

      saveData<Meal[]>(MEALS_KEY, meals);
      return meals;
    }
    case "update": {
      const meals = state.map((meal) =>
        meal.id === action.payload.id ? { ...meal, ...action.payload } : meal,
      );

      saveData<Meal[]>(MEALS_KEY, meals);
      return meals;
    }
    case "clear": {
      saveData<Meal[]>(MEALS_KEY, []);
      return [];
    }
    default: {
      return state;
    }
  }
};
