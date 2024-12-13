export enum StorageError {
  STORAGE_KEY_NOT_FOUND = "STORAGE_KEY_NOT_FOUND",
  STORAGE_GET_ERROR = "STORAGE_GET_ERROR",
  STORAGE_SET_ERROR = "STORAGE_SET_ERROR",
  STORAGE_INVALID_DATA = "STORAGE_INVALID_DATA",
  STORAGE_SERIALIZATION_ERROR = "STORAGE_SERIALIZATION_ERROR",
  STORAGE_PARSE_ERROR = "STORAGE_PARSE_ERROR",
  STORAGE_DELETION_ERROR = "STORAGE_DELETION_ERROR",
}

export type StorageStoreResult =
  | { success: true }
  | { success: false; error: StorageError };

export type StorageGetResult<T> =
  | { success: true; data: T }
  | { success: false; error: StorageError };

export type StorageRemoveResult = StorageStoreResult;
