import stringFormatter from "@json2csv/formatters/string.js"
import { AsyncParser } from "@json2csv/node/index.js"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const proyectosJson = await request.json()

    if (!proyectosJson || !Array.isArray(proyectosJson)) {
      return new Response("Error in body", { status: 412 })
    }

    const dateToCSVFormat = (date: Date) => {
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      const month =
        date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()

      return `${day}/${month}/${date.getFullYear()}`
    }

    const mappedProyectos = proyectosJson.map((proyecto) => ({
      Código: proyecto.codigo,
      "Investigador principal": `${proyecto.coip ? '"' : ""}${proyecto.ip}${proyecto.coip ? `;${proyecto.coip}"` : ""}`,
      Título: proyecto.titulo,
      "Ent. Financiadora": proyecto.financiado,
      "F. Inicio": dateToCSVFormat(new Date(proyecto.inicio)),
      "F. Fin": proyecto.fin ? dateToCSVFormat(new Date(proyecto.fin)) : null,
    }))

    const options = {
      delimiter: ";",
      formatters: {
        string: stringFormatter({ quote: "" }),
      },
    }

    const parser = new AsyncParser(options)
    const csv = await parser.parse(mappedProyectos).promise()

    const headers = new Headers()
    headers.append("Content-Type", "text/csv")
    headers.append("Content-Disposition", "attachment; filename=data.csv")

    const response = new Response(csv, { status: 200, headers })

    return response
  } catch (error) {
    return new Response("Error downloading the file", { status: 400 })
  }
}
