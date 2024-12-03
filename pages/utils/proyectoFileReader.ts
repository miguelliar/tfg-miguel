import type { ProyectoToUpload } from "@/app/utils"

const proyectHeaders = [
  "codigo",
  "ip",
  "coip",
  "titulo",
  "financiado",
  "inicio",
  "fin",
] as const
const MATCH_SEMICOLOMNS_OUTSIDE_DOUBLE_QUOTES_REGEXP =
  /;(?=(?:(?:[^"]*"[^"]*")*[^"]*$))/

const parseLine = (lines: string[]) => {
  const relevantLines: [typeof proyectHeaders, ...Array<string[]>] = [
    proyectHeaders,
  ]
  let foundHeader = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!foundHeader && trimmedLine.startsWith("Código")) {
      foundHeader = true
    } else if (foundHeader && trimmedLine && !trimmedLine.includes(";;;")) {
      const fields = trimmedLine.split(
        MATCH_SEMICOLOMNS_OUTSIDE_DOUBLE_QUOTES_REGEXP
      )
      const [ip, coip] = fields[1].split(";")
      fields.splice(1, 1, ip, coip ?? null)
      relevantLines.push(fields)
    }
  }
  return relevantLines
}

const mapLines = (
  headers: typeof proyectHeaders,
  rows: string[][]
): ProyectoToUpload[] => {
  const result: ProyectoToUpload[] = []

  for (const row of rows) {
    const proyecto: any = {}
    headers.forEach((header, index) => {
      if (row[index] && row[index].startsWith('"')) {
        proyecto[header] = row[index].slice(1, -1)
      } else {
        proyecto[header] = row[index]
      }
    })
    result.push(proyecto)
  }
  return result
}

export const processProyectoLines = (lines: string[]) => {
  const [headers, ...rows] = parseLine(lines)
  const result = mapLines(headers, rows)

  return result
}
