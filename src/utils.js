
export function isIndexableType (value) {
  return value != null && (// Using "!=" instead of "!==" to check for both null and undefined!
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Date ||
      (Array.isArray(value) && value.every(isIndexableType))
    )
}
