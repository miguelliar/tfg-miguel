import type { NextRequest } from "next/server"

import { processProyectoLines } from "@/proyectos"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    const buffer = await request.arrayBuffer()

    const winDecoder = new TextDecoder("windows-1252")
    let fileContent = winDecoder.decode(buffer)
    if (fileContent.startsWith("CÃ³digo")) {
      const utfDecoder = new TextDecoder("utf-8")

      fileContent = utfDecoder.decode(buffer)
    }

    const lines = fileContent.split("\n")

    const result = await processProyectoLines(lines)
    return Response.json(result, { status: 200 })
  } catch (error) {
    return new Response("Error processing the document", { status: 400 })
  }
}
