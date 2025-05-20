import type { ProyectoToUpload } from "@/proyectos"

import { processProyectoLines } from "./proyectoFileReader"

const mockValidateProyectosToAdd = jest.fn()
jest.mock("./proyectoValidator", () => ({
  validateProyectosToAdd: (proyectos: ProyectoToUpload[]) =>
    mockValidateProyectosToAdd(proyectos),
}))

const expectedProyectHeaders = [
  "codigo",
  "ip",
  "coip",
  "titulo",
  "financiado",
  "inicio",
  "fin",
] as const

describe("Utility: Project Line Processing", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateProyectosToAdd.mockImplementation(
      (proyectos: ProyectoToUpload[]) => Promise.resolve(proyectos)
    )
  })

  describe("processProyectoLines function", () => {
    test("should parse, map and validate when lines are valid", async () => {
      const lines = [
        "Irrelevant line",
        "Código;IP;COIP;Título;Financiado;Inicio;Fin",
        "Line to ignore",
        'P001;"IP One;COIP One";"Awesome Project";FunderX;01/01/2025;31/12/2025',
        'P002;IP Two;"Cool Study";FunderY;02/02/2025;28/02/2026',
      ]
      const expectedParsedAndMapped: ProyectoToUpload[] = [
        {
          codigo: "P001",
          ip: "IP One",
          coip: "COIP One",
          titulo: "Awesome Project",
          financiado: "FunderX",
          inicio: "01/01/2025",
          fin: "31/12/2025",
          participantes: [],
          messages: {},
        },
        {
          codigo: "P002",
          ip: "IP Two",
          titulo: "Cool Study",
          financiado: "FunderY",
          inicio: "02/02/2025",
          fin: "28/02/2026",
          participantes: [],
          messages: {},
        },
      ]
      const expectedResult = expectedParsedAndMapped.map((p) => ({
        ...p,
        coip: p.coip ?? null,
        participantes: undefined,
        messages: undefined,
      }))

      const result = await processProyectoLines(lines)

      expect(mockValidateProyectosToAdd).toHaveBeenCalledTimes(1)
      expect(mockValidateProyectosToAdd).toHaveBeenCalledWith(expectedResult)
      expect(result).toEqual(expectedResult)
    })

    test("should call validate with empty array when data is empty", async () => {
      const lines = ["Código;Only;Header;Row"]

      const result = await processProyectoLines(lines)

      expect(mockValidateProyectosToAdd).toHaveBeenCalledTimes(1)
      expect(mockValidateProyectosToAdd).toHaveBeenCalledWith([])
      expect(result).toEqual([])
    })

    test('should also call validate with empty array when lines with no header starting with "Código"', async () => {
      const lines = ["No header here", "Data line 1", "Data line 2"]

      const result = await processProyectoLines(lines)

      expect(mockValidateProyectosToAdd).toHaveBeenCalledTimes(1)
      expect(mockValidateProyectosToAdd).toHaveBeenCalledWith([])
      expect(result).toEqual([])
    })

    test('Given no line starts with "Código", When parseLine is called, Then it should return only headers', () => {
      // Arrange
      const lines = ["No header here", "Data line 1", "Data line 2"]
      // Act
      const result = processProyectoLines(lines)
      // Assert
      expect(result).toEqual([expectedProyectHeaders])
      expect(result).toHaveLength(1)
    })

    test("Given lines with semicolons inside double quotes should split correctly", async () => {
      const lines = [
        "Código;IP;Título;Financiado;Inicio;Fin",
        '"C;O;D;E";"IP;COIP";"Title containing ""quotes"" and ; semicolons";FunderX;01/01/2025;31/12/2025',
      ]

      const expectedParsedAndMapped: ProyectoToUpload[] = [
        {
          codigo: "C;O;D;E",
          ip: "IP",
          coip: "COIP",
          titulo: 'Title containing ""quotes"" and ; semicolons',
          financiado: "FunderX",
          inicio: "01/01/2025",
          fin: "31/12/2025",
          participantes: [],
          messages: {},
        },
      ]

      const expectedResult = expectedParsedAndMapped.map((p) => ({
        ...p,
        participantes: undefined,
        messages: undefined,
      }))

      const result = await processProyectoLines(lines)

      expect(result).toEqual(expectedResult)
    })
  })
})
