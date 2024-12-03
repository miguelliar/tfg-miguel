export const getStringDate = (date: Date | null, message: string): string => {
  return date
    ? date.toLocaleDateString(undefined, {
        formatMatcher: "basic",
      })
    : message
}
