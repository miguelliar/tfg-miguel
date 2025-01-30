import type { NextApiRequest, NextApiResponse } from "next"

import { searchProyectoByTitulo } from "@/db"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { query, page = '1', offset = '20' } = req.query

      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" })
      }

      if (typeof query !== "string") {
        return res.status(400).json({ error: "Query must be a string" })
      }

      if (typeof page !== "string") {
        return res.status(400).json({ error: "Page must be a string" })
      }

      if (typeof offset !== "string" ) {
        return res.status(400).json({ error: "Offset must be a string" })
      }

      const results = await searchProyectoByTitulo(
        query,
        parseInt(page),
        parseInt(offset)
      )

      return res.status(200).json({ results })
    } catch (error: any) {
      res.status(500).json({ error: `There was an unexpected error: ${error.message}` })
    }
  } else {
    return res
      .status(500)
      .json({ error: "There is no method for this endpoint" })
  }
}

export default handler
