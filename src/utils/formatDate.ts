export const getStringDate = (
  date?: Date,
  message: string = "No date"
): string => {
  return date ? date.toLocaleDateString("en-GB") : message
}

export const parseDateToString = (date: Date | string | null): string => {
  if (typeof date === "string") return date
  return date ? date.toLocaleDateString("en-CA") : ""
}
