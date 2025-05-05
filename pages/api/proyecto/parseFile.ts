import type { NextApiRequest, NextApiResponse } from "next"
import { processProyectoLines } from "utils"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const content: any = []

  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ error: "There is no method for this endpoint" })
  }

  req.on("data", (data) => {
    content.push(data)
  })

  req.on("end", async () => {
    try {
      const buffer = Buffer.concat(content)

      const decoder = new TextDecoder("windows-1252")
      const fileContent = decoder.decode(buffer)

      const lines = fileContent.split("\n")

      const result = await processProyectoLines(lines)
      res.status(200).json(result)
      res.end()
    } catch (error) {
      res.status(500).json({ error: "Error parsing the file" })
      res.end()
    }
  })

  req.on("error", () => {
    res.status(500).json({ error: "Error processing the file" })
    res.end()
  })
}

export default handler
