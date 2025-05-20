import { describe } from "node:test"

import { act, renderHook } from "@testing-library/react"

import type { ParticipaType } from "@/participa"

import { useEditProyectoForm } from "./useEditProyectoForm"

jest.mock("@/app/assets/logo-mini.svg", () => ({
  default: jest.fn(),
}))

const mockRouterRefresh = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ refresh: mockRouterRefresh })),
}))

const mockFetchProyectoByCode = jest.fn()
jest.mock("@/db", () => ({
  fetchProyectoByCode: (codigo: string) => mockFetchProyectoByCode(codigo),
}))

const mockAddCommandExecute = jest.fn()
const mockDeleteCommandExecute = jest.fn()
const mockAddCommandInstances: Array<{
  execute: jest.Mock
  type: string
  participa: ParticipaType
}> = []
const mockDeleteCommandInstances: Array<{
  execute: jest.Mock
  type: string
  participa: ParticipaType
}> = []

jest.mock("@/participa", () => ({
  ...jest.requireActual("@/participa"),
  AddParticipaCommand: jest
    .fn()
    .mockImplementation((participa: ParticipaType) => {
      const instance = {
        execute: mockAddCommandExecute,
        type: "add",
        participa,
      }
      mockAddCommandInstances.push(instance)
      return instance
    }),
  DeleteParticipaCommand: jest
    .fn()
    .mockImplementation((participa: ParticipaType) => {
      const instance = {
        execute: mockDeleteCommandExecute,
        type: "delete",
        participa,
      }
      mockDeleteCommandInstances.push(instance)
      return instance
    }),
}))

const initialInputErrors = {
  codigo: "",
  ip: "",
  coip: "",
  titulo: "",
  financiado: "",
  fechaInicio: "",
  fechaFin: "",
}

const mockProyecto = {
  codigo: "PROJ1",
  ip: "Investigador Principal Original",
  coip: "Co-Investigador Original",
  titulo: "Proyecto Original",
  financiado: "Fuente Original",
  inicio: new Date("2023-01-01"),
  fin: new Date("2023-12-31"),
}

const mockParticipante1: ParticipaType = {
  email: "p1@example.com",
  nombreAutor: "Participante Uno",
  codigo: "PROJ1",
}
const mockParticipante2: ParticipaType = {
  email: "p2@example.com",
  nombreAutor: "Participante Dos",
  codigo: "PROJ1",
}

describe("useEditProyectoForm", () => {
  let mockFinishEditMode: jest.Mock
  let mockOnUpdate: jest.Mock
  let initialParticipaciones: ParticipaType[]

  beforeEach(() => {
    jest.clearAllMocks()
    mockAddCommandInstances.splice(0, mockAddCommandInstances.length)
    mockDeleteCommandInstances.splice(0, mockDeleteCommandInstances.length)

    mockFinishEditMode = jest.fn()
    mockOnUpdate = jest.fn()
    initialParticipaciones = [mockParticipante1]

    mockFetchProyectoByCode.mockResolvedValue(null)
  })

  const renderTestHook = (
    proyectoProps = mockProyecto,
    participacionesProps = initialParticipaciones,
    unSync = false
  ) => {
    return renderHook(
      (props) =>
        useEditProyectoForm(
          props.proyecto,
          props.finishEditMode,
          props.onUpdate,
          props.participaciones,
          props.unSync
        ),
      {
        initialProps: {
          proyecto: proyectoProps,
          finishEditMode: mockFinishEditMode,
          onUpdate: mockOnUpdate,
          participaciones: participacionesProps,
          unSync,
        },
      }
    )
  }

  test("should set initial states correctly when initialized", () => {
    const { result } = renderTestHook()

    expect(result.current.editedProyecto).toEqual(mockProyecto)
    expect(result.current.editedParticipaciones).toEqual(initialParticipaciones)
    expect(result.current.errors).toEqual(initialInputErrors)
  })

  test("should update `editedParticipaciones` when participaciones prop changes", () => {
    const { result, rerender } = renderTestHook()
    const newParticipaciones = [mockParticipante2]

    rerender({
      proyecto: mockProyecto,
      finishEditMode: mockFinishEditMode,
      onUpdate: mockOnUpdate,
      participaciones: newParticipaciones,
      unSync: false,
    })

    expect(result.current.editedParticipaciones).toEqual(newParticipaciones)
  })

  test("should update `editedProyecto` state and trim string values when handleChange is called", () => {
    const { result } = renderTestHook()
    const mockEvent = { target: { name: "titulo", value: " Nuevo Título " } }

    act(() => {
      result.current.handleChange(mockEvent as any)
    })

    expect(result.current.editedProyecto.titulo).toBe("Nuevo Título")
  })

  describe("When onSubmit is called", () => {
    const mockSubmitEvent = { preventDefault: jest.fn() } as any

    test("no changes were made, should not call validation, onUpdate, or finishEditMode", async () => {
      const { result } = renderTestHook()

      await act(async () => {
        result.current.onSubmit(mockSubmitEvent)
      })
      expect(mockSubmitEvent.preventDefault).toHaveBeenCalledTimes(1)
      expect(mockFetchProyectoByCode).not.toHaveBeenCalled()
      expect(mockOnUpdate).not.toHaveBeenCalled()
      expect(mockFinishEditMode).not.toHaveBeenCalled()
      expect(mockRouterRefresh).not.toHaveBeenCalled()
    })

    test("should set codigo error if fetchProyectoByCode returns a project", async () => {
      const { result } = renderTestHook()
      act(() => {
        result.current.handleChange({
          target: { name: "codigo", value: "EXISTING" },
        } as any)
      })
      mockFetchProyectoByCode.mockResolvedValueOnce({
        codigo: "EXISTING",
      } as any)

      await act(async () => {
        result.current.onSubmit(mockSubmitEvent)
      })
      expect(result.current.errors.codigo).toBe(
        "El codigo EXISTING ya está siendo usado como código en otro proyecto"
      )
    })

    test("should set fechaFin error if fin is before inicio", async () => {
      const { result } = renderTestHook()
      act(() => {
        result.current.handleChange({
          target: { name: "inicio", value: "2024-01-01" },
        } as any)
      })
      act(() => {
        result.current.handleChange({
          target: { name: "fin", value: "2023-01-01" },
        } as any)
      })

      await act(async () => {
        result.current.onSubmit(mockSubmitEvent)
      })
      expect(result.current.errors.fechaFin).toBe(
        "La fecha de finalización no puede ser anterior a la de inicio"
      )
    })
  })

  describe("When not unSync", () => {
    describe("When managing participaciones", () => {
      test("addParticipa should update state and add command", () => {
        const { result } = renderTestHook(mockProyecto, [], false)
        act(() => {
          result.current.addParticipa(mockParticipante2)
        })

        expect(result.current.editedParticipaciones).toEqual([
          mockParticipante2,
        ])
        expect(mockAddCommandInstances).toHaveLength(1)
        expect(mockAddCommandInstances[0].participa).toEqual(mockParticipante2)
      })

      test("removeParticipa should update state and add command", () => {
        const { result } = renderTestHook(
          mockProyecto,
          [mockParticipante1, mockParticipante2],
          false
        )
        act(() => {
          result.current.removeParticipa(mockParticipante1)
        })

        expect(result.current.editedParticipaciones).toEqual([
          mockParticipante2,
        ])
        expect(mockDeleteCommandInstances).toHaveLength(1)
        expect(mockDeleteCommandInstances[0].participa).toEqual(
          mockParticipante1
        )
      })
    })

    describe("When onSubmit is called", () => {
      const mockSubmitEvent = { preventDefault: jest.fn() } as any

      test("project changed and validation fails, should set errors, call finishEditMode and refresh, but not onUpdate or commands", async () => {
        const { result } = renderTestHook()
        act(() => {
          result.current.handleChange({
            target: { name: "ip", value: "" },
          } as any)
        })
        mockFetchProyectoByCode.mockResolvedValue(null)

        await act(async () => {
          result.current.onSubmit(mockSubmitEvent)
        })

        expect(mockSubmitEvent.preventDefault).toHaveBeenCalledTimes(1)
        expect(mockFetchProyectoByCode).toHaveBeenCalledTimes(1)
        expect(result.current.errors.ip).toBe(
          "El investigador principal no puede estar vacío"
        )

        expect(mockOnUpdate).not.toHaveBeenCalled()
        expect(mockAddCommandExecute).not.toHaveBeenCalled()
        expect(mockDeleteCommandExecute).not.toHaveBeenCalled()

        expect(mockFinishEditMode).toHaveBeenCalledTimes(1)
        expect(mockRouterRefresh).toHaveBeenCalledTimes(1)
      })

      test("project changed, validation passes and participaciones unchanged, should call onUpdate, finishEditMode, and refresh", async () => {
        const { result } = renderTestHook(mockProyecto, [], false)
        act(() => {
          result.current.handleChange({
            target: { name: "titulo", value: "New Valid Title" },
          } as any)
        })
        mockFetchProyectoByCode.mockResolvedValue(null)

        await act(async () => {
          result.current.onSubmit(mockSubmitEvent)
        })

        expect(result.current.errors.titulo).toBe("")
        expect(mockOnUpdate).toHaveBeenCalledWith(
          result.current.editedProyecto,
          result.current.editedParticipaciones
        )
        expect(mockAddCommandExecute).not.toHaveBeenCalled()
        expect(mockDeleteCommandExecute).not.toHaveBeenCalled()
        expect(mockFinishEditMode).toHaveBeenCalledTimes(1)
        expect(mockRouterRefresh).toHaveBeenCalledTimes(1)
      })

      test("project unchanged, validation passes and participaciones changed, should call onUpdate, execute commands, finishEditMode, and refresh", async () => {
        const { result } = renderTestHook(mockProyecto, [], false)
        act(() => {
          result.current.addParticipa(mockParticipante2)
        })

        mockFetchProyectoByCode.mockResolvedValue(null)

        await act(async () => {
          result.current.onSubmit(mockSubmitEvent)
        })

        expect(mockOnUpdate).toHaveBeenCalledWith(mockProyecto, [
          mockParticipante2,
        ])
        expect(mockAddCommandInstances).toHaveLength(1)
        expect(mockAddCommandExecute).toHaveBeenCalledTimes(1)
        expect(mockFinishEditMode).toHaveBeenCalledTimes(1)
        expect(mockRouterRefresh).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("When unSync", () => {
    describe("When managing participaciones", () => {
      test("addParticipa should update state but NOT add command", () => {
        const { result } = renderTestHook(mockProyecto, [], true)
        act(() => {
          result.current.addParticipa(mockParticipante2)
        })

        expect(result.current.editedParticipaciones).toEqual([
          mockParticipante2,
        ])
        expect(mockAddCommandInstances).toHaveLength(0)
      })

      test("removeParticipa should update state but NOT add command", () => {
        const { result } = renderTestHook(
          mockProyecto,
          [mockParticipante1, mockParticipante2],
          true
        )
        act(() => {
          result.current.removeParticipa(mockParticipante1)
        })

        expect(result.current.editedParticipaciones).toEqual([
          mockParticipante2,
        ])
        expect(mockDeleteCommandInstances).toHaveLength(0)
      })
    })

    describe("When onSubmit is called", () => {
      const mockSubmitEvent = { preventDefault: jest.fn() } as any

      test("project changed, should call onUpdate, finishEditMode, and refresh, regardless of validation result", async () => {
        const { result } = renderTestHook(mockProyecto, [], true)
        act(() => {
          result.current.handleChange({
            target: { name: "ip", value: "" },
          } as any)
        })
        mockFetchProyectoByCode.mockResolvedValue({
          codigo: "OTHER_CODE",
        } as any)

        await act(async () => {
          result.current.onSubmit(mockSubmitEvent)
        })

        expect(mockFetchProyectoByCode).toHaveBeenCalledTimes(1)
        expect(result.current.errors.ip).toBe(
          "El investigador principal no puede estar vacío"
        )

        expect(mockOnUpdate).toHaveBeenCalledWith(
          result.current.editedProyecto,
          result.current.editedParticipaciones
        )
        expect(mockAddCommandExecute).not.toHaveBeenCalled()
        expect(mockDeleteCommandExecute).not.toHaveBeenCalled()
        expect(mockFinishEditMode).toHaveBeenCalledTimes(1)
        expect(mockRouterRefresh).toHaveBeenCalledTimes(1)
      })
    })
  })
})
