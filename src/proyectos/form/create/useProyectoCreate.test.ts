import { act, renderHook } from "@testing-library/react"
import type { FormEvent } from "react"

import { type ParticipaType } from "@/participa"
import type { ProyectoType } from "@/proyectos/types"

import type { UseProyectoCreateReturn } from "./useProyectoCreate"
import { useProyectoCreate } from "./useProyectoCreate"

const mockRouterPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: mockRouterPush })),
}))

jest.mock("use-debounce", () => ({
  useDebouncedCallback: jest.fn((callback) => callback),
}))

const mockCommandExecute = jest.fn()
const mockCommandInstances: Array<{
  execute: jest.Mock
  participaPassedToConstructor: ParticipaType
}> = []

jest.mock("@/participa", () => {
  return {
    AddParticipaCommand: jest
      .fn()
      .mockImplementation((participa: ParticipaType) => {
        const instance = {
          execute: mockCommandExecute,
          participaPassedToConstructor: participa,
        }
        mockCommandInstances.push(instance)
        return instance
      }),
  }
})

const mockGetProyectoErrors = jest.fn()
const mockAddProyecto = jest.fn()
jest.mock("@/proyectos/utils", () => {
  return {
    getProyectoErrors: (proyecto: ProyectoType) =>
      mockGetProyectoErrors(proyecto),
    addProyecto: (proyecto: ProyectoType) => mockAddProyecto(proyecto),
  }
})

const mockParticipante1: ParticipaType = {
  email: "test1@example.com",
  nombreAutor: "Test Author 1",
  codigo: "TEMP",
}
const mockParticipante2: ParticipaType = {
  email: "test2@example.com",
  nombreAutor: "Test Author 2",
  codigo: "TEMP",
}

describe("Given the useProyectoCreate hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCommandInstances.splice(0, mockCommandInstances.length)

    mockGetProyectoErrors.mockResolvedValue({})
    mockAddProyecto.mockResolvedValue(undefined)
  })

  test("When initialized, Then it should return the correct initial state", () => {
    const { result } = renderHook(() => useProyectoCreate())

    expect(result.current.codigo).toBe("")
    expect(result.current.addedParticipantes).toEqual([])
    expect(result.current.errors).toBeNull()
  })

  test("When addParticipa is called, should correctly update the addedParticipantes state", () => {
    // Arrange
    const { result } = renderHook(() => useProyectoCreate())
    act(() => {
      result.current.handleChange({
        target: { name: "codigo", value: "TEMP" },
      })
    })

    act(() => {
      result.current.addParticipa(mockParticipante1)
    })
    expect(result.current.addedParticipantes).toEqual([mockParticipante1])

    act(() => {
      result.current.addParticipa(mockParticipante2)
    })
    expect(result.current.addedParticipantes).toEqual([
      mockParticipante1,
      mockParticipante2,
    ])
  })

  test("When removeParticipa is called, should correctly update the addedParticipantes state", () => {
    // Arrange
    const { result } = renderHook(() => useProyectoCreate())
    act(() => {
      result.current.handleChange({
        target: { name: "codigo", value: "TEMP" },
      })
    })

    act(() => {
      result.current.addParticipa(mockParticipante1)
    })
    act(() => {
      result.current.addParticipa(mockParticipante2)
    })

    // Act & Assert for removeParticipa
    act(() => {
      result.current.removeParticipa(mockParticipante1)
    })
    expect(result.current.addedParticipantes).toEqual([mockParticipante2])

    act(() => {
      result.current.removeParticipa(mockParticipante2)
    })
    expect(result.current.addedParticipantes).toEqual([])
  })

  describe("When handleChange is called", () => {
    test("Should update the proyecto state for a standard field", async () => {
      const { result } = renderHook(() => useProyectoCreate())
      const mockEvent = { target: { name: "titulo", value: "New Title " } }

      act(() => {
        result.current.handleChange(mockEvent)
      })

      // We can't directly access internal `proyecto` state, but `onSubmit` will use it.
      // We can test this by submitting and checking what `addProyecto` or `getProyectoErrors` receives.
      // For now, we'll set up onSubmit to check.
      mockGetProyectoErrors.mockResolvedValueOnce({ titulo: undefined }) // No error for titulo
      await act(async () => {
        await result.current.onSubmit({ preventDefault: jest.fn() } as any)
      })

      // Check the argument passed to getProyectoErrors (which reflects internal proyecto state)
      expect(mockGetProyectoErrors).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: "New Title" })
      )
    })

    test('Should update proyecto.codigo when "codigo" field changes', async () => {
      const { result } = renderHook(() => useProyectoCreate())

      const mockEvent = { target: { name: "codigo", value: "NEW_CODE " } }

      act(() => {
        result.current.handleChange(mockEvent)
      })

      expect(result.current.codigo).toBe("NEW_CODE")

      mockGetProyectoErrors.mockResolvedValueOnce({})

      await act(async () => {
        await result.current.onSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(mockGetProyectoErrors).toHaveBeenCalledWith(
        expect.objectContaining({ codigo: "NEW_CODE" })
      )
    })

    test('Should update all addedParticipantes codigos when "codigo" field changes', async () => {
      const { result } = renderHook(() => useProyectoCreate())
      const mockInitialCodeEvent = {
        target: { name: "codigo", value: "OLD_CODE " },
      }

      act(() => {
        result.current.handleChange(mockInitialCodeEvent)
      })

      act(() => {
        result.current.addParticipa({
          ...mockParticipante1,
        })
        result.current.addParticipa({
          ...mockParticipante2,
        })
      })

      const mockEvent = { target: { name: "codigo", value: "NEW_CODE " } }

      act(() => {
        result.current.handleChange(mockEvent)
      })

      result.current.addedParticipantes.forEach((p) => {
        expect(p.codigo).toBe("NEW_CODE ")
      })
    })
  })

  describe("When onSubmit is called", () => {
    const mockPreventDefault = jest.fn()
    const mockSubmitEvent = {
      preventDefault: mockPreventDefault,
    } as any as FormEvent<HTMLFormElement>

    beforeEach(() => {
      mockPreventDefault.mockClear()
    })

    test("And validation fails, Then it should set errors and not proceed", async () => {
      const validationErrors: any = {
        codigo: "Código es requerido",
      }
      mockGetProyectoErrors.mockResolvedValueOnce(validationErrors)
      const { result } = renderHook(() => useProyectoCreate())

      await act(async () => {
        result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockPreventDefault).toHaveBeenCalledTimes(1)
      expect(mockGetProyectoErrors).toHaveBeenCalledTimes(1)
      expect(result.current.errors).toEqual(validationErrors)
      expect(mockAddProyecto).not.toHaveBeenCalled()
      expect(mockRouterPush).not.toHaveBeenCalled()
    })

    describe("And Validation passes (specific fields in validateParameters are not errors)", () => {
      const testCodigo = "P123"
      const testTitulo = "Test Proj"
      let resultObtained: { current: UseProyectoCreateReturn }

      beforeEach(async () => {
        mockGetProyectoErrors.mockResolvedValue({})
        mockAddProyecto.mockResolvedValue(undefined)

        const { result } = renderHook(() => useProyectoCreate())
        resultObtained = result

        act(() => {
          result.current.handleChange({
            target: { name: "codigo", value: testCodigo },
          })
          result.current.handleChange({
            target: { name: "titulo", value: testTitulo },
          })
        })

        act(() => {
          result.current.addParticipa(mockParticipante1)
        })

        act(() => {
          result.current.addParticipa(mockParticipante2)
        })

        await act(async () => {
          await result.current.onSubmit(mockSubmitEvent)
        })
      })

      test("should call validate proyectos", () => {
        expect(mockPreventDefault).toHaveBeenCalledTimes(1)
        expect(mockGetProyectoErrors).toHaveBeenCalledTimes(1)
        expect(mockGetProyectoErrors).toHaveBeenCalledWith(
          expect.objectContaining({ codigo: testCodigo, titulo: testTitulo })
        )
        expect(resultObtained.current.errors).toEqual({})
      })

      test("should call addProyecto", () => {
        expect(mockAddProyecto).toHaveBeenCalledTimes(1)
        expect(mockAddProyecto).toHaveBeenCalledWith(
          expect.objectContaining({ codigo: testCodigo, titulo: testTitulo })
        )
      })

      test("should call AddParticipaCommands execute", () => {
        const expectedParticipant1 = {
          ...mockParticipante1,
          codigo: testCodigo,
        }
        const expectedParticipant2 = {
          ...mockParticipante2,
          codigo: testCodigo,
        }

        expect(mockCommandInstances[0].participaPassedToConstructor).toEqual(
          expect.objectContaining({
            email: expectedParticipant1.email,
            codigo: testCodigo,
            nombreAutor: expectedParticipant1.nombreAutor,
          })
        )
        expect(mockCommandInstances[1].participaPassedToConstructor).toEqual(
          expect.objectContaining({
            email: expectedParticipant2.email,
            codigo: testCodigo,
            nombreAutor: expectedParticipant2.nombreAutor,
          })
        )

        expect(mockCommandExecute).toHaveBeenCalledTimes(2)
      })
      test("should call router.push", () => {
        expect(mockRouterPush).toHaveBeenCalledWith("/proyectos")
      })
    })

    describe("And validation passes but addProyecto fails", () => {
      let resultObtained: { current: UseProyectoCreateReturn }
      beforeEach(async () => {
        mockGetProyectoErrors.mockResolvedValueOnce({})
        mockAddProyecto.mockRejectedValue(new Error("Failed to add proyecto"))

        const { result } = renderHook(() => useProyectoCreate())
        resultObtained = result

        act(() => {
          result.current.addParticipa(mockParticipante1)
        })

        await act(async () => {
          await result.current.onSubmit(mockSubmitEvent)
        })
      })

      test("should not execute commands", () => {
        expect(mockPreventDefault).toHaveBeenCalledTimes(1)
        expect(mockGetProyectoErrors).toHaveBeenCalledTimes(1)
        expect(mockAddProyecto).toHaveBeenCalledTimes(1)
      })

      test("should not execute push", () => {
        expect(mockCommandExecute).not.toHaveBeenCalled()
        expect(mockRouterPush).not.toHaveBeenCalled()
      })

      test("should set unexpectedError", () => {
        expect(resultObtained.current.errors?.unexpectedError).toBe(
          "Ha habido un problema añadiendo el proyecto. Por favor, inténtalo de nuevo"
        )
      })
    })

    test("And validation logic based on specific error keys in `validateParameters` is met", async () => {
      // `validateParameters` returns true if !errors.codigo && !errors.ip && etc. are all true
      // Meaning if getProyectoErrors returns { someOtherError: "problem" }, it's still "valid" by validateParameters
      const irrelevantErrors = {
        anUncheckedErrorField: "This won't cause validation to fail",
      }
      mockGetProyectoErrors.mockResolvedValueOnce(irrelevantErrors as any)
      mockAddProyecto.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useProyectoCreate())

      await act(async () => {
        result.current.onSubmit(mockSubmitEvent)
      })

      expect(result.current.errors).toEqual(irrelevantErrors) // Errors state IS set
      expect(mockAddProyecto).toHaveBeenCalledTimes(1) // But addProyecto still proceeds
      expect(mockRouterPush).toHaveBeenCalledWith("/proyectos")
    })
  })
})
