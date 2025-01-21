export const getStringDate = (
  date: Date | null,
  message: string = "No date"
): string => {
  return date
    ? date.toLocaleDateString(undefined, {
        formatMatcher: "basic",
      })
    : message
}

export const parseDateToString = (date: Date): string =>
  date.toISOString().substring(0, 10)
