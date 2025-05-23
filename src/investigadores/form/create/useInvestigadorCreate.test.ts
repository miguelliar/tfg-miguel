import { act, renderHook } from "@testing-library/react"

import type { InvestigadorType } from "@/investigadores/types"
import type { InvestigadorValidationErrors } from "@/investigadores/utils"

import { useInvestigadorCreate } from "./useInvestigadorCreate"

const mockRouterPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: mockRouterPush })),
}))

const mockGetInvestigadorErrors = jest.fn()
const mockValidateInvestigadorErrors = jest.fn()
const mockAddInvestigador = jest.fn()

jest.mock("@/investigadores/utils", () => {
  return {
    getInvestigadorErrors: (investigador: InvestigadorType) =>
      mockGetInvestigadorErrors(investigador),
    validateInvestigadorErrors: (errors: InvestigadorValidationErrors) =>
      mockValidateInvestigadorErrors(errors),
    addInvestigador: (investigador: InvestigadorType) =>
      mockAddInvestigador(investigador),
  }
})

const mockValidInvestigadorData: InvestigadorType = {
  email: "test@example.com",
  nombre: "Test",
  apellidos: "User",
  universidad: "University Test",
  departamento: "Test Department",
  area: "Test Area",
  figura: "Test Figure",
}

describe("Given the useInvestigadorCreate hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetInvestigadorErrors.mockReturnValue({})
    mockValidateInvestigadorErrors.mockReturnValue(true)
    mockAddInvestigador.mockResolvedValue(undefined)
  })

  test("When initialized, Then it should return the correct initial state", () => {
    const { result } = renderHook(() => useInvestigadorCreate())

    expect(result.current.errors).toBe("")
  })

  describe("When handleChange is called", () => {
    test("Then it should update the internal investigador state and trim string values", async () => {
      const { result } = renderHook(() => useInvestigadorCreate())
      const mockEvent = { target: { name: "nombre", value: "  Test Nombre  " } }

      act(() => {
        result.current.handleChange(mockEvent as any)
      })

      const mockSubmitEvent = { preventDefault: jest.fn() } as any
      await act(async () => {
        await result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockGetInvestigadorErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: "Test Nombre",
        })
      )

      expect(mockAddInvestigador).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: "Test Nombre",
        })
      )
    })

    test("Then it should update different fields correctly", async () => {
      const { result } = renderHook(() => useInvestigadorCreate())
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        } as any)
      })
      act(() => {
        result.current.handleChange({
          target: { name: "universidad", value: " Test Uni " },
        } as any)
      })

      const mockSubmitEvent = { preventDefault: jest.fn() } as any
      await act(async () => {
        await result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockGetInvestigadorErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          universidad: "Test Uni", // Trimmed
        })
      )
    })
  })

  describe("When onSubmit is called", () => {
    const mockPreventDefault = jest.fn()
    const mockSubmitEvent = { preventDefault: mockPreventDefault } as any

    beforeEach(() => {
      mockPreventDefault.mockClear()
    })

    test("And validation fails (validateInvestigadorErrors returns false), Then it should set errors and not proceed to add or navigate", async () => {
      const validationErrors: InvestigadorValidationErrors = {
        email: "Email es inválido",
      }
      mockGetInvestigadorErrors.mockReturnValue(validationErrors)
      mockValidateInvestigadorErrors.mockReturnValue(false)

      const { result } = renderHook(() => useInvestigadorCreate())

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "bad" },
        } as any)
      })

      await act(async () => {
        await result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockPreventDefault).toHaveBeenCalledTimes(1)
      expect(mockGetInvestigadorErrors).toHaveBeenCalledTimes(1)
      expect(mockValidateInvestigadorErrors).toHaveBeenCalledWith(
        validationErrors
      )
      expect(result.current.errors).toEqual(validationErrors)
      expect(mockAddInvestigador).not.toHaveBeenCalled()
      expect(mockRouterPush).not.toHaveBeenCalled()
    })

    test("And validation succeeds (validateInvestigadorErrors returns true), Then it should call addInvestigador and navigate", async () => {
      const noErrors: InvestigadorValidationErrors = {}
      mockGetInvestigadorErrors.mockReturnValue(noErrors)
      mockValidateInvestigadorErrors.mockReturnValue(true)

      const { result } = renderHook(() => useInvestigadorCreate())

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: mockValidInvestigadorData.email },
        } as any)
        result.current.handleChange({
          target: { name: "nombre", value: mockValidInvestigadorData.nombre },
        } as any)
        result.current.handleChange({
          target: {
            name: "apellidos",
            value: mockValidInvestigadorData.apellidos,
          },
        } as any)
        result.current.handleChange({
          target: {
            name: "universidad",
            value: mockValidInvestigadorData.universidad,
          },
        } as any)
        result.current.handleChange({
          target: {
            name: "departamento",
            value: mockValidInvestigadorData.departamento,
          },
        } as any)
        result.current.handleChange({
          target: { name: "area", value: mockValidInvestigadorData.area },
        } as any)
        result.current.handleChange({
          target: { name: "figura", value: mockValidInvestigadorData.figura },
        } as any)
      })

      await act(async () => {
        await result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockPreventDefault).toHaveBeenCalledTimes(1)
      expect(mockGetInvestigadorErrors).toHaveBeenCalledTimes(1)
      expect(mockValidateInvestigadorErrors).toHaveBeenCalledWith(noErrors)
      expect(result.current.errors).toEqual(noErrors)

      expect(mockAddInvestigador).toHaveBeenCalledTimes(1)
      expect(mockAddInvestigador).toHaveBeenCalledWith(
        mockValidInvestigadorData
      )

      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith("/investigadores")
    })

    test("And addInvestigador is called but an exception raises, Then errors change and there is no navigation", async () => {
      // Arrange
      mockGetInvestigadorErrors.mockReturnValue({})
      mockValidateInvestigadorErrors.mockReturnValue(true)

      mockAddInvestigador.mockRejectedValue(false)

      const { result } = renderHook(() => useInvestigadorCreate())
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        } as any)
      })

      await act(async () => {
        await result.current.onSubmit(mockSubmitEvent)
      })

      expect(mockAddInvestigador).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).not.toHaveBeenCalled()

      expect(result.current.errors).toBe(
        "Ha habido un problema añadiendo el proyecto. Por favor, inténtalo de nuevo"
      )
    })
  })
})
