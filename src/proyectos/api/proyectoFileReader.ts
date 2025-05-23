import type { ProyectoToUpload } from "@/proyectos"

import { validateProyectosToAdd } from "./proyectoValidator"

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

      if (fields.length >= 5) {
        const [ip, coip] = fields[1].split(";")
        fields.splice(1, 1, ip, coip ?? null)
        relevantLines.push(fields)
      }
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
      if (
        row[index] &&
        row[index].startsWith('"') &&
        row[index].endsWith('"')
      ) {
        proyecto[header] = row[index].slice(1, -1)
      } else if (row[index] && row[index].startsWith('"')) {
        proyecto[header] = row[index].slice(1)
      } else if (row[index] && row[index].endsWith('"')) {
        proyecto[header] = row[index].slice(0, -1)
      } else {
        proyecto[header] = row[index]
      }
    })
    result.push(proyecto)
  }
  return result
}

export const processProyectoLines = async (
  lines: string[]
): Promise<ProyectoToUpload[]> => {
  const [headers, ...rows] = parseLine(lines)
  const result = mapLines(headers, rows)
  const validatedProyectos = await validateProyectosToAdd(result)

  return validatedProyectos
}
