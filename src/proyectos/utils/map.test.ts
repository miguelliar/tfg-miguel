import type { ParticipaType } from "@/participa"

import type { ProyectoType } from "../types"
import type { ProyectoMessage } from "./infoMessage"
import type { ProyectoToUpload } from "./map"
import {
  mapProyectosToUploadToProyectsType,
  mapProyectoToUploadToProyectType,
  mapProyectoTypeToProyectoToUpload,
  parseDate,
} from "./map"

describe("Proyecto Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("parseDate", () => {
    test('Given a "DD/MM/YYYY" string and "/" separator, When parseDate is called, Then it should return the correct Date object', () => {
      expect(parseDate("01/12/2023", "/").toISOString()).toBe(
        new Date(2023, 11, 1).toISOString()
      )
      expect(parseDate("15/10/2022", "/").toISOString()).toBe(
        new Date(2022, 9, 15).toISOString()
      )
    })

    test('Given a "YYYY-MM-DD" string and "-" separator, When parseDate is called, Then it should return the correct Date object', () => {
      expect(parseDate("2023-12-01", "-").toISOString()).toBe(
        new Date(2023, 11, 1).toISOString()
      )
      expect(parseDate("2022-10-15", "-").toISOString()).toBe(
        new Date(2022, 9, 15).toISOString()
      )
    })

    test("Given an invalid date string, When parseDate is called, Then it should return an Invalid Date object", () => {
      expect(parseDate("invalid-date", "/").getTime()).toBeNaN()
      expect(parseDate("32/01/2023", "/").getTime()).toBeNaN()
      expect(parseDate("01/13/2023", "/").getTime()).toBeNaN()
    })

    test("Given an empty date string, When parseDate is called, Then it should return an Invalid Date object", () => {
      expect(parseDate("", "/").getTime()).toBeNaN()
    })
  })

  describe("mapProyectoTypeToProyectoToUpload", () => {
    const baseProyecto: ProyectoType = {
      codigo: "P001",
      titulo: "Test Proy",
      ip: "Test IP",
      financiado: "Test Fin",
      inicio: new Date(2023, 0, 15), // Jan 15, 2023
      fin: new Date(2023, 11, 20), // Dec 20, 2023
    }
    const mockParticipaciones: ParticipaType[] = [
      { codigo: "P001", email: "test@example.com", nombreAutor: "Test Author" },
    ]
    const mockMensajes: ProyectoMessage = {
      errors: [{ message: "e1" } as any],
      warnings: [{ message: "w1" } as any],
    }

    test("Given a ProyectoType with Date objects, When mapped, Then inicio and fin should be formatted strings", () => {
      const result = mapProyectoTypeToProyectoToUpload({
        proyecto: baseProyecto,
      })

      expect(result.inicio).toBe("15/01/2023")
      expect(result.fin).toBe("20/12/2023")
      expect(result.codigo).toBe("P001")
    })

    test("Given a ProyectoType with ISO date strings, When mapped, Then new Date() should parse them before formatting", () => {
      const proyectoWithStringDates: ProyectoType = {
        ...baseProyecto,
        inicio: new Date(2024, 1, 20), // Feb 20, 2024
        fin: new Date(2024, 2, 10), // Mar 10, 2024
      }
      const result = mapProyectoTypeToProyectoToUpload({
        proyecto: proyectoWithStringDates,
      })
      expect(result.inicio).toBe("20/02/2024")
      expect(result.fin).toBe("10/03/2024")
    })

    test("Given optional participaciones and mensajes, When mapped, Then they should be correctly assigned", () => {
      const result = mapProyectoTypeToProyectoToUpload({
        proyecto: baseProyecto,
        participaciones: mockParticipaciones,
        mensajes: mockMensajes,
      })
      expect(result.participantes).toEqual(mockParticipaciones)
      expect(result.messages.errors).toEqual(mockMensajes.errors)
      expect(result.messages.warnings).toEqual(mockMensajes.warnings)
    })

    test("Given undefined participaciones and mensajes, When mapped, Then participaciones is empty array and messages fields are undefined", () => {
      const result = mapProyectoTypeToProyectoToUpload({
        proyecto: baseProyecto,
      })
      expect(result.participantes).toEqual([])
      expect(result.messages.errors).toBeUndefined()
      expect(result.messages.warnings).toBeUndefined()
    })

    test('Given proyecto.fin is undefined, When mapped, Then fin string should be "No Date"', () => {
      const proyectoWithNullFin: ProyectoType = {
        ...baseProyecto,
        fin: undefined,
      }
      const result = mapProyectoTypeToProyectoToUpload({
        proyecto: proyectoWithNullFin,
      })

      expect(result.fin).toBe("No date")
    })
  })

  describe("mapProyectoToUploadToProyectType", () => {
    const baseProyectoToUpload: ProyectoToUpload = {
      codigo: "P002",
      titulo: "Upload Proy",
      ip: "Upload IP",
      financiado: "Upload Fin",
      inicio: "10/02/2024",
      fin: "25/11/2024",
      participantes: [],
      messages: {},
    }

    test("Given a ProyectoToUpload with valid date strings, When mapped, Then inicio and fin should be Date objects", () => {
      const result = mapProyectoToUploadToProyectType(baseProyectoToUpload)
      expect(result.inicio).toBeInstanceOf(Date)
      expect(result.inicio.toISOString()).toBe(
        new Date(2024, 1, 10).toISOString()
      ) // Feb 10
      expect(result.fin).toBeInstanceOf(Date)
      expect((result.fin as Date).toISOString()).toBe(
        new Date(2024, 10, 25).toISOString()
      ) // Nov 25
      expect(result.codigo).toBe("P002")
    })

    test("Given ProyectoToUpload with fin undefined, When mapped, Then fin should be undefined", () => {
      const result = mapProyectoToUploadToProyectType({
        ...baseProyectoToUpload,
        fin: undefined,
      })
      expect(result.fin).toBeUndefined()
    })

    test('Given ProyectoToUpload with fin as empty string, When mapped, Then fin should be Invalid Date (due to parseDate(""))', () => {
      // This tests the current behavior of: proyecto.fin ? parseDate(proyecto.fin) : undefined
      // If proyecto.fin is "", it's truthy, so parseDate("") is called.
      const result = mapProyectoToUploadToProyectType({
        ...baseProyectoToUpload,
        fin: "",
      })
      expect(result.fin).toBeUndefined()
    })

    test("Given ProyectoToUpload with invalid date string for inicio, When mapped, Then inicio should be Invalid Date", () => {
      const result = mapProyectoToUploadToProyectType({
        ...baseProyectoToUpload,
        inicio: "invalid",
      })
      expect(result.inicio).toBeInstanceOf(Date)
      expect(result.inicio.getTime()).toBeNaN()
    })
  })

  describe("mapProyectosToUploadToProyectsType", () => {
    const proyectosToUpload: ProyectoToUpload[] = [
      {
        codigo: "P003",
        titulo: "Proy A",
        ip: "IP A",
        financiado: "Fund A",
        inicio: "01/03/2023",
        fin: "01/04/2023",
        participantes: [],
        messages: {},
      },
      {
        codigo: "P004",
        titulo: "Proy B",
        ip: "IP B",
        financiado: "Fund B",
        inicio: "10/05/2023",
        participantes: [],
        messages: {},
      },
    ]

    test("Given an array of ProyectoToUpload, When mapped, Then it should return an array of ProyectoType", () => {
      const results = mapProyectosToUploadToProyectsType(proyectosToUpload)
      expect(results).toHaveLength(2)
      expect(results[0].codigo).toBe("P003")
      expect(results[0].inicio).toBeInstanceOf(Date)
      expect((results[0].inicio as Date).toISOString()).toBe(
        new Date(2023, 2, 1).toISOString()
      ) // Mar 1
      expect(results[0].fin).toBeInstanceOf(Date)
      expect((results[0].fin as Date).toISOString()).toBe(
        new Date(2023, 3, 1).toISOString()
      ) // Apr 1

      expect(results[1].codigo).toBe("P004")
      expect(results[1].inicio).toBeInstanceOf(Date)
      expect((results[1].inicio as Date).toISOString()).toBe(
        new Date(2023, 4, 10).toISOString()
      ) // May 10
      expect(results[1].fin).toBeUndefined()
    })

    test("Given an empty array, When mapped, Then it should return an empty array", () => {
      const results = mapProyectosToUploadToProyectsType([])
      expect(results).toEqual([])
    })
  })
})
