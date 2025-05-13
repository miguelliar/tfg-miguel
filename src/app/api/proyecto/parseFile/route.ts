import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import XLSX from "xlsx"

import { processProyectoLines } from "@/proyectos"

export async function POST(request: NextRequest) {
  try {
    // Read the request body as FormData
    const formData = await request.formData()
    const file = formData.get("proyectoFile") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in the request." },
        { status: 400 }
      )
    }

    // Get the filename and extension
    const filename = file.name
    const fileExtension = filename.split(".").pop()?.toLowerCase()

    // Get the file content as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let fileContent

    // Process depending on the file extension
    if (fileExtension === "xlsx") {
      try {
        // Open and process the document
        const data = new Uint8Array(buffer)
        const workbook = XLSX.read(data, { type: "array" })
        const first_sheet_name = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[first_sheet_name]

        // Map the document to CSV
        const dataFileCSV = XLSX.utils.sheet_to_csv(worksheet, { FS: ";" })
        const blob = new Blob(["\ufeff", dataFileCSV])

        // Obtain the content of the CSV
        const csvBuffer = await blob.arrayBuffer()
        const utfDecoder = new TextDecoder("utf-8")

        fileContent = utfDecoder.decode(csvBuffer)
      } catch (xlsxError) {
        return NextResponse.json(
          { error: "Error parsing the XLSX file." },
          { status: 500 }
        )
      }
    } else if (fileExtension === "csv") {
      const winDecoder = new TextDecoder("windows-1252")
      fileContent = winDecoder.decode(buffer)
      if (fileContent.includes("CÃ³digo")) {
        const utfDecoder = new TextDecoder("utf-8")

        fileContent = utfDecoder.decode(buffer)
      }
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file type: .${fileExtension}. Please upload a .csv or .xlsx file.`,
        },
        { status: 400 }
      )
    }

    const lines = fileContent.split("\n")

    const result = await processProyectoLines(lines)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing the document" },
      { status: 400 }
    )
  }
}
