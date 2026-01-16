/**
 * Transform Helpers - Payload Transformation Utilities
 * Cung cấp các helper function để transform form data sang API payload format
 */

/**
 * Generic transform function type
 * @template TFormData - Form data type from frontend
 * @template TPayload - API payload type for backend
 */
export type TransformFunction<TFormData, TPayload> = (data: TFormData) => TPayload

/**
 * Remove undefined/null values from object
 * @param obj - Object to clean
 * @returns Object without undefined/null values
 */
export const removeEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key as keyof T] = value
    }
    return acc
  }, {} as Partial<T>)
}

/**
 * Transform form data with safe defaults
 * @param data - Form data
 * @param defaults - Default values
 * @returns Merged object with defaults
 */
export const withDefaults = <T extends Record<string, any>>(
  data: Partial<T>,
  defaults: Partial<T>
): T => {
  return { ...defaults, ...data } as T
}

/**
 * Pick only specified fields from object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only specified keys
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {} as Pick<T, K>)
}

/**
 * Omit specified fields from object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without specified keys
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result as Omit<T, K>
}

/**
 * Rename object keys
 * @param obj - Source object
 * @param keyMap - Mapping of old key to new key
 * @returns New object with renamed keys
 */
export const renameKeys = <T extends Record<string, any>>(
  obj: T,
  keyMap: Record<string, string>
): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = keyMap[key] || key
    acc[newKey] = value
    return acc
  }, {} as Record<string, any>)
}

/**
 * Transform nested object values
 * @param obj - Source object
 * @param transformer - Function to transform each value
 * @returns Transformed object
 */
export const mapValues = <T extends Record<string, any>, R>(
  obj: T,
  transformer: (value: any, key: string) => R
): Record<keyof T, R> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key as keyof T] = transformer(value, key)
    return acc
  }, {} as Record<keyof T, R>)
}
export const createTransform = <TForm, TPayload>(config: {
  pick?: (keyof TForm)[]
  omit?: (keyof TForm)[]
  defaults?: Partial<TPayload>
  rename?: Record<string, string>
  clean?: boolean
  custom?: (data: any) => any
}): TransformFunction<TForm, TPayload> => {
  return (data: TForm) => {
    let result: any = { ...data }

    // Pick specific fields
    if (config.pick) {
      result = pick(result, config.pick)
    }

    // Omit specific fields
    if (config.omit) {
      result = omit(result, config.omit)
    }

    // Rename keys
    if (config.rename) {
      result = renameKeys(result, config.rename)
    }

    // Apply defaults
    if (config.defaults) {
      result = withDefaults(result, config.defaults)
    }

    // Remove empty fields
    if (config.clean) {
      result = removeEmptyFields(result)
    }

    // Apply custom transform
    if (config.custom) {
      result = config.custom(result)
    }

    return result as TPayload
  }
}
