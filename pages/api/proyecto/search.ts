import type { NextApiRequest, NextApiResponse } from "next"

import { fetchProyectoByQuery, fetchProyectoData } from "@/db"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { query, page = "1", offset = "20" } = req.query

      if (typeof query !== "string") {
        return res.status(400).json({ error: "Query must be a string" })
      }

      if (typeof page !== "string") {
        return res.status(400).json({ error: "Page must be a string" })
      }

      if (typeof offset !== "string") {
        return res.status(400).json({ error: "Offset must be a string" })
      }

      if (!query) {
        const results = await fetchProyectoData(
          parseInt(page, 10),
          parseInt(offset, 10)
        )
        return res.status(200).json({ results })
      }

      const results = await fetchProyectoByQuery(
        query,
        parseInt(page, 10),
        parseInt(offset, 10)
      )

      return res.status(200).json({ results })
    } catch (error: any) {
      res
        .status(500)
        .json({ error: `There was an unexpected error: ${error.message}` })
    }
  } else {
    return res
      .status(500)
      .json({ error: "There is no method for this endpoint" })
  }
}

export default handler
