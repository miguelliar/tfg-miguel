import type { NextApiRequest } from "next"

import { fetchProyectoByQuery, fetchProyectoData } from "@/db"

export async function GET(request: NextApiRequest) {
  try {
    const params = new URLSearchParams(request.url?.split("?")[1] ?? "")
    const query = params.get("query")
    const page = params.get("page") ?? "1"
    const offset = params.get("offset") ?? "20"

    if (typeof query !== "string") {
      return Response.json({ error: "Query must be a string" }, { status: 400 })
    }

    if (typeof page !== "string") {
      return Response.json({ error: "Page must be a string" }, { status: 400 })
    }

    if (typeof offset !== "string") {
      return Response.json(
        { error: "Offset must be a string" },
        { status: 400 }
      )
    }

    if (!query) {
      console.log(query)
      const results = await fetchProyectoData(
        parseInt(page, 10),
        parseInt(offset, 10)
      )
      return Response.json({ results }, { status: 200 })
    }

    const results = await fetchProyectoByQuery(
      query,
      parseInt(page, 10),
      parseInt(offset, 10)
    )

    return Response.json({ results }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      { error: `There was an unexpected error: ${error.message}` },
      { status: 500 }
    )
  }
}
