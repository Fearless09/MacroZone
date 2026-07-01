import AsyncStorage from "@react-native-async-storage/async-storage";

// To save data
export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error(`Error saving data for key ${key}: ${msg}`);
    throw Error(`Error saving data for key ${key}: ${msg}`);
  }
}

// To retrieve data
export async function getData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : defaultValue;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";

    console.error(`Error retrieving data for ${key}: ${msg}`);
    throw Error(`Error retrieving data for ${key}: ${msg}`);
  }
}

// To remove data
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";

    console.error(`Error removing data for key ${key}: ${msg}`);
    throw Error(`Error removing data for key ${key}: ${msg}`);
  }
}
