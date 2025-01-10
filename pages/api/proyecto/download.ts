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

      const options = {
        delimiter: ";",
        formatters: {
          string: stringFormatter({ quote: "" }),
        },
      }

      const parser = new AsyncParser(options)
      const csv = await parser.parse(proyectosJson).promise()

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
