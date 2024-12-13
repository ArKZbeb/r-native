import {
  StorageError,
  StorageGetResult,
  StorageRemoveResult,
  StorageStoreResult,
} from "@/types/storage.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function store(
  key: string,
  value: any
): Promise<StorageStoreResult> {
  try {
    let serializedValue: string;

    try {
      // Handle different types of values
      if (typeof value === "string") {
        serializedValue = value;
      } else if (value instanceof Date) {
        serializedValue = JSON.stringify({
          _type: "Date",
          value: value.toISOString(),
        });
      } else if (value && typeof value === "object") {
        // Handle class instances by preserving constructor name
        const constructor = value.constructor?.name;
        serializedValue = JSON.stringify({
          _type: constructor !== "Object" ? constructor : undefined,
          ...value,
        });
      } else if (value === null || value === undefined) {
        serializedValue = JSON.stringify(null);
      } else {
        serializedValue = JSON.stringify(value);
      }
    } catch (e) {
      return {
        success: false,
        error: StorageError.STORAGE_SERIALIZATION_ERROR,
      };
    }

    await AsyncStorage.setItem(key, serializedValue);
    return { success: true };
  } catch (error) {
    return { success: false, error: StorageError.STORAGE_SET_ERROR };
  }
}

export async function get<T>(key: string): Promise<StorageGetResult<T>> {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return { success: false, error: StorageError.STORAGE_KEY_NOT_FOUND };
    }

    try {
      // Try to parse as JSON first
      if (value.startsWith("{") || value.startsWith("[")) {
        const parsed = JSON.parse(value);

        // Handle special types
        if (parsed && typeof parsed === "object" && parsed._type) {
          if (parsed._type === "Date") {
            return {
              success: true,
              data: new Date(parsed.value) as unknown as T,
            };
          }
          // You can add more special type handling here if needed
          // For class instances, you would need to implement your own deserialization logic
        }

        return { success: true, data: parsed as T };
      }

      // Return as is if it's a simple string
      return { success: true, data: value as unknown as T };
    } catch (e) {
      return { success: false, error: StorageError.STORAGE_PARSE_ERROR };
    }
  } catch (error) {
    return { success: false, error: StorageError.STORAGE_GET_ERROR };
  }
}

export async function remove(key: string): Promise<StorageRemoveResult> {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    return { success: false, error: StorageError.STORAGE_DELETION_ERROR };
  }
}
