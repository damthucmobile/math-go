/** JSON-serializable value (no unknown). Used for app data and raw parsing. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue }
