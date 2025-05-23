import type { ProyectoType } from "../types"
import { getProyectoErrors } from "./validation"

const mockFetchProyectoByCode = jest.fn()
jest.mock("@/db", () => ({
  fetchProyectoByCode: (codigo: string) => mockFetchProyectoByCode(codigo),
}))

const message = {
  EMPTY: {
    CODIGO: "El codigo no puede estar vacío",
    IP: "El investigador principal no puede estar vacío",
    TITULO: "El titulo no puede estar vacío",
    FINANCIADO: "La financiación no puede estar vacía",
    FECHA_INICIO: "La fecha de inicio no puede estar vacía",
  },
  INVALID_DATA: {
    DUPLICATED_IP:
      "El co-investigador principal no ser el mismo que el investigador principal",
    FIN_ANTES_INICIO:
      "La fecha de finalización no puede ser anterior a la de inicio",
    DUPLICATED_CODIGO:
      "El código empleado ya está siendo utilizado en otro proyecto. Comprueba que tu proyecto no haya sido añadido.",
  },
}

const createTestProyecto = (
  overrides: Partial<ProyectoType> = {}
): ProyectoType => {
  const defaults: ProyectoType = {
    codigo: "P001",
    ip: "Dr. Test Investigator",
    coip: "Dr. Co-Test Investigator",
    titulo: "A Valid Project Title",
    financiado: "Valid Funder",
    inicio: new Date("2023-01-01T00:00:00.000Z"),
    fin: new Date("2023-12-31T00:00:00.000Z"),
  }
  return { ...defaults, ...overrides }
}

describe("getProyectoErrors Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchProyectoByCode.mockResolvedValue(null)
  })

  describe("Given specific project data scenarios", () => {
    test("When `codigo` is empty, Then it should return CODIGO empty error", async () => {
      const proyecto = createTestProyecto({ codigo: "" })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.codigo).toBe(message.EMPTY.CODIGO)
      expect(mockFetchProyectoByCode).not.toHaveBeenCalled()
    })

    test("When `codigo` is only whitespace, Then it should return CODIGO empty error", async () => {
      const proyecto = createTestProyecto({ codigo: "   " })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.codigo).toBe(message.EMPTY.CODIGO)
      expect(mockFetchProyectoByCode).not.toHaveBeenCalled()
    })

    test("When `codigo` is not empty and `WorkspaceProyectoByCode` finds a duplicate, Then it should return DUPLICATED_CODIGO error", async () => {
      const existingCode = "EXISTING"
      const proyecto = createTestProyecto({ codigo: existingCode })
      mockFetchProyectoByCode.mockResolvedValue({ codigo: existingCode })

      const errors = await getProyectoErrors(proyecto)
      expect(errors.codigo).toBe(message.INVALID_DATA.DUPLICATED_CODIGO)
      expect(mockFetchProyectoByCode).toHaveBeenCalledWith(existingCode)
    })

    test("When `codigo` is valid and unique, Then `errors.codigo` should be empty", async () => {
      const proyecto = createTestProyecto({ codigo: "UNIQUE_CODE" })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.codigo).toBe("")
      expect(mockFetchProyectoByCode).toHaveBeenCalledWith("UNIQUE_CODE")
    })

    // --- IP Validation ---
    test("When `ip` is empty, Then it should return IP empty error", async () => {
      const proyecto = createTestProyecto({ ip: "" })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.ip).toBe(message.EMPTY.IP)
    })

    test("When `ip` is valid, Then `errors.ip` should be empty", async () => {
      const proyecto = createTestProyecto({ ip: "Valid IP Name" })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.ip).toBe("")
    })

    // --- CoIP Validation ---
    test("When `coip` is the same as `ip`, Then it should return DUPLICATED_IP error", async () => {
      const sharedName = "Dr. Same Name"
      const proyecto = createTestProyecto({ ip: sharedName, coip: sharedName })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.coip).toBe(message.INVALID_DATA.DUPLICATED_IP)
    })

    test("When `coip` is different from `ip`, Then `errors.coip` should be empty", async () => {
      const proyecto = createTestProyecto({
        ip: "IP Name",
        coip: "Different CoIP Name",
      })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.coip).toBe("")
    })

    test("When `coip` is null or undefined, Then `errors.coip` should be empty", async () => {
      let proyecto = createTestProyecto({ coip: undefined })
      let errors = await getProyectoErrors(proyecto)
      expect(errors.coip).toBe("")

      proyecto = createTestProyecto({ coip: undefined })
      errors = await getProyectoErrors(proyecto)
      expect(errors.coip).toBe("")
    })

    // --- Titulo Validation ---
    test("When `titulo` is empty, Then it should return TITULO empty error", async () => {
      const proyecto = createTestProyecto({ titulo: " " })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.titulo).toBe(message.EMPTY.TITULO)
    })

    // --- Financiado Validation ---
    test("When `financiado` is empty, Then it should return FINANCIADO empty error", async () => {
      const proyecto = createTestProyecto({ financiado: "" })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.financiado).toBe(message.EMPTY.FINANCIADO)
    })

    // --- FechaInicio Validation ---
    test("When `inicio` is falsy (e.g. null passed explicitly), Then it should return FECHA_INICIO empty error", async () => {
      const proyecto = createTestProyecto({ inicio: null as any })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.fechaInicio).toBe(message.EMPTY.FECHA_INICIO)
    })

    test("When `inicio` is a valid Date, Then `errors.fechaInicio` should be empty", async () => {
      const proyecto = createTestProyecto({ inicio: new Date() })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.fechaInicio).toBe("")
    })

    // --- FechaFin (Interval) Validation ---
    test("When `fin` is before `inicio`, Then it should return FIN_ANTES_INICIO error", async () => {
      const proyecto = createTestProyecto({
        inicio: new Date("2024-01-01T00:00:00.000Z"),
        fin: new Date("2023-12-31T00:00:00.000Z"),
      })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.fechaFin).toBe(message.INVALID_DATA.FIN_ANTES_INICIO)
    })

    test("When `fin` is same as `inicio`, Then `errors.fechaFin` should be empty", async () => {
      const sameDate = new Date("2024-01-01T00:00:00.000Z")
      const proyecto = createTestProyecto({
        inicio: sameDate,
        fin: sameDate,
      })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.fechaFin).toBe("")
    })

    test("When `fin` is after `inicio`, Then `errors.fechaFin` should be empty", async () => {
      const proyecto = createTestProyecto({
        inicio: new Date("2023-01-01T00:00:00.000Z"),
        fin: new Date("2024-12-31T00:00:00.000Z"),
      })
      const errors = await getProyectoErrors(proyecto)
      expect(errors.fechaFin).toBe("")
    })

    test("When `fin` is null or undefined, Then `errors.fechaFin` should be empty", async () => {
      let proyecto = createTestProyecto({ fin: undefined })
      let errors = await getProyectoErrors(proyecto)
      expect(errors.fechaFin).toBe("")

      proyecto = createTestProyecto({ fin: undefined })
      errors = await getProyectoErrors(proyecto)
      expect(errors.fechaFin).toBe("")
    })

    // --- All Fields Valid ---
    test("When all fields are valid, Then all error messages should be empty strings", async () => {
      const proyecto = createTestProyecto({
        codigo: "VALID_CODE",
        ip: "Valid IP",
        coip: "Valid CoIP",
        titulo: "Valid Title",
        financiado: "Valid Funder",
        inicio: new Date("2023-01-01T00:00:00.000Z"),
        fin: new Date("2023-12-31T00:00:00.000Z"),
      })
      mockFetchProyectoByCode.mockResolvedValue(null)

      const errors = await getProyectoErrors(proyecto)

      expect(errors.codigo).toBe("")
      expect(errors.ip).toBe("")
      expect(errors.coip).toBe("")
      expect(errors.titulo).toBe("")
      expect(errors.financiado).toBe("")
      expect(errors.fechaInicio).toBe("")
      expect(errors.fechaFin).toBe("")
    })
  })
})
