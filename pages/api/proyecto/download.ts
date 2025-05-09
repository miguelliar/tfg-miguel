import stringFormatter from "@json2csv/formatters/string.js"
import { AsyncParser } from "@json2csv/node/index.js"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const proyectosJson = req.body

      if (!proyectosJson || !Array.isArray(proyectosJson)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of objects",
        })
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

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", "attachment; filename=data.csv")

      res.status(200).send(csv)
    } catch (error) {
      res.status(500).json({ error: "Error processing the file" })
    }
  } else {
    return res
      .status(500)
      .json({ error: "There is no method for this endpoint" })
  }
}

export default handler
