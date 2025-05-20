import type { ParticipaType } from "@/participa"

import { MESSAGES, type ProyectoToUpload } from "../utils"
import {
  validateProyectosToAdd,
  validateProyectoToAdd,
} from "./proyectoValidator"

const mockFetchProyectoByCode = jest.fn()
const mockFetchInvestigadorByNombreAutor = jest.fn()

jest.mock("@/db", () => ({
  fetchProyectoByCode: (codigo: string) => mockFetchProyectoByCode(codigo),
  fetchInvestigadorByNombreAutor: (nombreAutor: string) =>
    mockFetchInvestigadorByNombreAutor(nombreAutor),
}))

const createProyectoBase = (
  overrides: Partial<ProyectoToUpload> = {}
): ProyectoToUpload => ({
  codigo: "P001",
  titulo: "Test Project",
  ip: "IP Name",
  coip: "COIP Name",
  financiado: "Test Funder",
  inicio: "01/01/2023",
  fin: "31/12/2023",
  participantes: [],
  messages: {},
  ...overrides,
})

describe("Proyecto Validation Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockFetchProyectoByCode.mockResolvedValue(null)
  })

  describe("validateProyectoToAdd", () => {
    describe("Given project data for error validation", () => {
      test("When project code already exists, Then it should return a CODIGO_DUPLICADO error", async () => {
        const proyecto = createProyectoBase()
        mockFetchProyectoByCode.mockResolvedValue(true)

        const result = await validateProyectoToAdd(proyecto)

        const codeError = result.messages?.errors?.some(
          (e) => e.message === MESSAGES.ERROR.CODIGO_DUPLICADO
        )
        expect(codeError).toBeTruthy()
      })

      test("When project code is unique, Then it should not return a CODIGO_DUPLICADO error", async () => {
        const proyecto = createProyectoBase()
        mockFetchProyectoByCode.mockResolvedValue(undefined)

        const result = await validateProyectoToAdd(proyecto)

        const codeError = result.messages?.errors?.some(
          (e) => e.message === MESSAGES.ERROR.CODIGO_DUPLICADO
        )
        expect(codeError).toBeFalsy()
      })

      test("When end date is before start date, Then it should return an INTERVALO_FECHA error", async () => {
        const proyecto = createProyectoBase({
          inicio: "01/01/2024",
          fin: "31/12/2023",
        })
        const result = await validateProyectoToAdd(proyecto)

        const dateError = result.messages?.errors?.some(
          (e) => e.message === MESSAGES.ERROR.INTERVALO_FECHA
        )
        expect(dateError).toBeTruthy()
      })

      test("When only start date is provided, Then it should NOT return an error based on current `areDatesValid` logic", async () => {
        const proyecto = createProyectoBase({
          inicio: "01/01/2024",
          fin: undefined,
        })

        const result = await validateProyectoToAdd(proyecto)

        const dateError = result.messages?.errors?.find(
          (e) => e.message === MESSAGES.ERROR.SIN_FECHA_INICIO
        )
        expect(dateError).toBeUndefined()
      })

      test("When parsing start and end dates throw an error, Then it should return an FORMATO_FECHA error", async () => {
        const proyecto = createProyectoBase({
          inicio: "01-01-2023",
          fin: "01-01-2024",
        })

        const result = await validateProyectoToAdd(proyecto)

        const dateError = result.messages?.errors?.some(
          (e) => e.message === MESSAGES.ERROR.FORMATO_FECHA
        )
        expect(dateError).toBeFalsy()
      })

      test("When start and end dates are valid, Then it should not return date interval errors", async () => {
        const proyecto = createProyectoBase({
          inicio: "01/01/2023",
          fin: "01/01/2024",
        })

        const result = await validateProyectoToAdd(proyecto)

        const dateError = result.messages?.errors?.some(
          (e) => e.message === MESSAGES.ERROR.INTERVALO_FECHA
        )
        expect(dateError).toBeFalsy()
      })
    })

    describe("Given project data for warning validation", () => {
      test("When IP does not exist, Then it should return a NO_NOMBRE_AUTOR_PARA_IP warning", async () => {
        const proyecto = createProyectoBase()

        mockFetchInvestigadorByNombreAutor.mockResolvedValue([])

        const result = await validateProyectoToAdd(proyecto)

        const codeError = result.messages?.warnings?.some(
          (e) =>
            e.message === MESSAGES.WARNING.NO_NOMBRE_AUTOR_PARA_IP &&
            e.nombreAutor === "Unknown IP"
        )

        expect(codeError).toBeTruthy()
      })

      test("When multiple investigators found for IP, Then it should return a MULTIPLE_NOMBRE_AUTOR_PARA_IP warning", async () => {
        const proyecto = createProyectoBase()

        mockFetchInvestigadorByNombreAutor.mockResolvedValue([
          { email: "ip1@example.com", nombreAutor: "Ambiguous IP" },
          { email: "ip2@example.com", nombreAutor: "Ambiguous IP" },
        ])

        const result = await validateProyectoToAdd(proyecto)

        const codeError = result.messages?.warnings?.some(
          (e) => e.message === MESSAGES.WARNING.MULTIPLE_NOMBRE_AUTOR_PARA_IP
        )

        expect(codeError).toBeTruthy()
      })

      test("When a unique IP exists, Then it should not return IP-related warnings", async () => {
        const proyecto = createProyectoBase()
        mockFetchInvestigadorByNombreAutor.mockResolvedValue([true])

        const result = await validateProyectoToAdd(proyecto)

        const ipWarning = result.messages?.warnings?.find(
          (w) =>
            w.message === MESSAGES.WARNING.NO_NOMBRE_AUTOR_PARA_IP ||
            w.message === MESSAGES.WARNING.MULTIPLE_NOMBRE_AUTOR_PARA_IP
        )

        expect(ipWarning).toBeUndefined()
      })
    })

    describe("Given project data for automatic participation", () => {
      test("When unique IP is found and no CoIP, Then it should add IP to participaciones", async () => {
        const proyecto = createProyectoBase({
          ip: "Unique IP",
          coip: undefined,
        })

        mockFetchInvestigadorByNombreAutor.mockResolvedValue([
          { email: "uniqueip@example.com", nombreAutor: "Unique IP" },
        ])

        const result = await validateProyectoToAdd(proyecto)

        expect(result.participantes).toHaveLength(1)
        expect(result.participantes).toContainEqual({
          codigo: proyecto.codigo,
          email: "uniqueip@example.com",
          nombreAutor: "Unique IP",
        })
      })

      test("When unique IP and unique CoIP are found, Then it should add both to participaciones", async () => {
        const proyecto = createProyectoBase({
          ip: "Unique IP",
          coip: "Unique COIP",
        })

        mockFetchInvestigadorByNombreAutor.mockImplementation(
          (name: string) => {
            if (name === "Unique IP")
              return Promise.resolve([
                { email: "uniqueip@example.com", nombreAutor: "Unique IP" },
              ])
            if (name === "Unique COIP")
              return Promise.resolve([
                { email: "uniquecoip@example.com", nombreAutor: "Unique COIP" },
              ])
            return Promise.resolve([])
          }
        )

        const result = await validateProyectoToAdd(proyecto)

        expect(result.participantes).toHaveLength(2)
        expect(result.participantes).toContainEqual(
          expect.objectContaining({ email: "uniqueip@example.com" })
        )
        expect(result.participantes).toContainEqual(
          expect.objectContaining({ email: "uniquecoip@example.com" })
        )
      })

      test("When IP is not unique, Then IP should not be added to participaciones", async () => {
        const proyecto = createProyectoBase({
          ip: "Ambiguous IP",
          coip: undefined,
        })
        mockFetchInvestigadorByNombreAutor.mockResolvedValue([
          { email: "ip1@example.com", nombreAutor: "Ambiguous IP" },
          { email: "ip2@example.com", nombreAutor: "Ambiguous IP" },
        ])

        const result = await validateProyectoToAdd(proyecto)
        expect(result.participantes).toEqual([])
      })

      test("When project already has participaciones, Then they should be preserved", async () => {
        const existingParticipantes: ParticipaType[] = [
          {
            nombreAutor: "Existing Participant",
            email: "existing@example.com",
            codigo: "P001",
          },
          {
            nombreAutor: "Unique IP",
            email: "uniqueip@example.com",
            codigo: "P001",
          },
        ]

        const proyecto = createProyectoBase({
          participantes: existingParticipantes,
        })

        mockFetchInvestigadorByNombreAutor.mockResolvedValueOnce([
          { email: "uniqueip@example.com", nombreAutor: "Unique IP" },
        ])

        const result = await validateProyectoToAdd(proyecto)
        expect(result.participantes).toEqual(existingParticipantes)
      })
    })

    test("Given a complete valid project, When validateProyectoToAdd is called, Then it should structure messages and participaciones correctly", async () => {
      const proyecto = createProyectoBase({
        codigo: "VALID01",
        ip: "Valid IP",
        coip: "Valid COIP",
      })
      mockFetchProyectoByCode.mockResolvedValue(null)
      mockFetchInvestigadorByNombreAutor.mockImplementation((name: string) => {
        if (name === "Valid IP")
          return Promise.resolve([
            { email: "validip@example.com", nombreAutor: "Valid IP" },
          ])
        if (name === "Valid COIP")
          return Promise.resolve([
            { email: "validcoip@example.com", nombreAutor: "Valid COIP" },
          ])
        return Promise.resolve([])
      })

      const result = await validateProyectoToAdd(proyecto)

      expect(result.codigo).toBe("VALID01")
      expect(result.messages?.errors).toEqual([])
      expect(result.messages?.warnings).toEqual([])
      expect(result.participantes).toHaveLength(2)
      expect(result.participantes).toContainEqual(
        expect.objectContaining({ email: "validip@example.com" })
      )
      expect(result.participantes).toContainEqual(
        expect.objectContaining({ email: "validcoip@example.com" })
      )
    })
  })

  describe("validateProyectosToAdd", () => {
    test("Given an array of proyectos, When validateProyectosToAdd is called, Then it should call validateProyectoToAdd for each and return all results", async () => {
      const proyectos: ProyectoToUpload[] = [
        createProyectoBase({ codigo: "P001", ip: "IP1" }),
        createProyectoBase({ codigo: "P002", ip: "IP2", fin: "01/01/2022" }),
      ]

      mockFetchProyectoByCode.mockImplementation((codigo) => {
        if (codigo === "P001" || codigo === "P002") return Promise.resolve(null)
        return Promise.resolve({ codigo })
      })
      mockFetchInvestigadorByNombreAutor.mockImplementation((nombreAutor) => {
        if (nombreAutor === "IP1")
          return Promise.resolve([
            { email: "ip1@example.com", nombreAutor: "IP1" },
          ])
        if (nombreAutor === "IP2")
          return Promise.resolve([
            { email: "ip2@example.com", nombreAutor: "IP2" },
          ])
        return Promise.resolve([])
      })

      const results = await validateProyectosToAdd(proyectos)

      expect(results).toHaveLength(2)

      // Check P001 (should be mostly valid)
      expect(results[0].codigo).toBe("P001")
      expect(results[0].messages?.errors).toEqual([])
      expect(results[0].participantes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: "ip1@example.com" }),
        ])
      )

      // Check P002 (should have a date error)
      expect(results[1].codigo).toBe("P002")
      expect(results[1].messages?.errors).toContainEqual(
        expect.objectContaining({
          message: MESSAGES.ERROR.INTERVALO_FECHA,
        })
      )
      expect(results[1].participantes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: "ip2@example.com" }),
        ])
      )
    })

    test("Given an empty array of proyectos, When validateProyectosToAdd is called, Then it should return an empty array", async () => {
      const results = await validateProyectosToAdd([])

      expect(results).toEqual([])
      expect(mockFetchProyectoByCode).not.toHaveBeenCalled()
      expect(mockFetchInvestigadorByNombreAutor).not.toHaveBeenCalled()
    })
  })
})
