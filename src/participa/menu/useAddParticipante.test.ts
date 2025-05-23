import { act, renderHook, waitFor } from "@testing-library/react"

import type { InvestigadorMinimumDataType } from "@/investigadores"

import type { ParticipaType } from "../type"
import { useAddParticipante } from "./useAddParticipante"

const mockUseDebouncedCallback = jest.fn((callback, _timeout) => {
  return callback
})
jest.mock("use-debounce", () => ({
  useDebouncedCallback: (...args: any[]) =>
    mockUseDebouncedCallback(args[0], args[1]),
}))

const mockFetchInvestigadoresByQuery = jest.fn()
const mockFetchInvestigadoresNotParticipatingInProject = jest.fn()
const mockFetchNombresDeAutor = jest.fn()

jest.mock("@/db", () => ({
  fetchInvestigadoresByQuery: (...args: any[]) =>
    mockFetchInvestigadoresByQuery(...args),
  fetchInvestigadoresNotParticipatingInProject: (...args: any[]) =>
    mockFetchInvestigadoresNotParticipatingInProject(...args),
  fetchNombresDeAutor: (...args: any[]) => mockFetchNombresDeAutor(...args),
}))

const mockInvestigador1: InvestigadorMinimumDataType = {
  apellidos: "apellido",
  email: "inv1@example.com",
  nombre: "Investigador Uno",
}
const mockInvestigador2: InvestigadorMinimumDataType = {
  apellidos: "apellido",
  email: "inv2@example.com",
  nombre: "Investigador Dos",
}
const mockInvestigador3: InvestigadorMinimumDataType = {
  apellidos: "apellido",
  email: "inv3@example.com",
  nombre: "Investigador Tres",
}

const mockParticipanteAdded1: ParticipaType = {
  codigo: "PROJ1",
  email: "inv1@example.com",
  nombreAutor: "Investigador Uno",
}

describe("Given the useAddParticipante hook", () => {
  const defaultCodigo = "PROJ1"

  beforeEach(() => {
    jest.clearAllMocks()

    mockFetchInvestigadoresByQuery.mockResolvedValue([])
    mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValue([])
    mockFetchNombresDeAutor.mockResolvedValue([])

    mockUseDebouncedCallback.mockImplementation((callback) => {
      return callback
    })
  })

  const renderTestHook = (props: {
    codigo: string
    participaAdded?: ParticipaType[]
  }) => {
    return renderHook(() => useAddParticipante(props))
  }

  test("When initialized, Then it should return the correct initial state", () => {
    const { result } = renderTestHook({ codigo: defaultCodigo })

    expect(result.current.query).toBe("")
    expect(result.current.nombreDeAutor).toBe("")
    expect(result.current.investigadoresSearched).toEqual([])
    expect(result.current.investigadorSelected).toBeNull()
    expect(result.current.nombresAutorForSelected).toEqual([])
    expect(result.current.isOtherSelected).toBe(false)
  })

  describe("When handleSearch is called (and effect for investigator search runs)", () => {
    test("And a non-empty term is provided with a codigo, Then it should update query and fetch/filter investigadores", async () => {
      const searchTerm = "TestInv"
      mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValue([
        mockInvestigador1,
        mockInvestigador2,
      ])
      const { result } = renderTestHook({
        codigo: defaultCodigo,
        participaAdded: [mockParticipanteAdded1],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)

      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledWith(searchTerm, defaultCodigo)
      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador2,
        ])
      })
    })

    test("And a non-empty term is provided with a codigo, but no participaAdded, Then it should fetch investigadores", async () => {
      const searchTerm = "TestInv"
      mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValue([
        mockInvestigador1,
        mockInvestigador2,
      ])
      const { result } = renderTestHook({ codigo: defaultCodigo })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledWith(searchTerm, defaultCodigo)
      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador1,
          mockInvestigador2,
        ])
      })
    })

    test("And a non-empty term is provided with a codigo, but no participaAdded and investigadores are undefined, Then it should set investigadoresSearched to empty array", async () => {
      const searchTerm = "TestInv"
      mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValue(
        undefined
      )
      const { result } = renderTestHook({ codigo: defaultCodigo })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledWith(searchTerm, defaultCodigo)
      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([])
      })
    })

    test("And a non-empty term is provided but the fetch investigators fails, Then it should set investigadoresSearched to empty array", async () => {
      const searchTerm = "GlobalSearch"
      mockFetchInvestigadoresByQuery.mockRejectedValue(false)
      const { result } = renderTestHook({
        codigo: defaultCodigo,
        participaAdded: [mockParticipanteAdded1],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([])
      })
    })

    test("And a non-empty term is provided but no codigo, Then it should call fetchInvestigadoresByQuery and fetch/filter investigators", async () => {
      const searchTerm = "GlobalSearch"
      mockFetchInvestigadoresByQuery.mockResolvedValue([mockInvestigador3])
      const { result } = renderTestHook({
        codigo: "",
        participaAdded: [mockParticipanteAdded1],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).not.toHaveBeenCalled()
      expect(mockFetchInvestigadoresByQuery).toHaveBeenCalledWith(searchTerm)

      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador3,
        ])
      })
    })

    test("And a non-empty term is provided but no codigo and no participaAdded, Then it should call fetchInvestigadoresByQuery and fetch them", async () => {
      const searchTerm = "GlobalSearch"
      mockFetchInvestigadoresByQuery.mockResolvedValue([mockInvestigador3])
      const { result } = renderTestHook({
        codigo: "",
        participaAdded: [],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).not.toHaveBeenCalled()
      expect(mockFetchInvestigadoresByQuery).toHaveBeenCalledWith(searchTerm)

      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador3,
        ])
      })
    })

    test("And a non-empty term is provided but no codigo, no participaAdded and no investigadores returned, Then it should set investigadoresSearched to empty array", async () => {
      const searchTerm = "GlobalSearch"
      mockFetchInvestigadoresByQuery.mockResolvedValue(undefined)
      const { result } = renderTestHook({
        codigo: "",
        participaAdded: [],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      expect(result.current.query).toBe(searchTerm)
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).not.toHaveBeenCalled()
      expect(mockFetchInvestigadoresByQuery).toHaveBeenCalledWith(searchTerm)

      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([])
      })
    })

    test("And a non-empty term is provided but no codigo and fetchInvestigadoresByQuery fails, Then it should set investigadores searched to empty array", async () => {
      const searchTerm = "GlobalSearch"
      mockFetchInvestigadoresByQuery.mockRejectedValue(false)
      const { result } = renderTestHook({
        codigo: "",
        participaAdded: [mockParticipanteAdded1],
      })

      act(() => {
        result.current.handleSearch(searchTerm)
      })

      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([])
      })
    })

    test("And an empty term is provided, Then it should clear query and investigadoresSearched", async () => {
      const { result } = renderTestHook({ codigo: defaultCodigo })

      mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValueOnce([
        mockInvestigador1,
      ])
      act(() => {
        result.current.handleSearch("something")
      })
      await waitFor(() =>
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador1,
        ])
      )

      act(() => {
        result.current.handleSearch("")
      })

      expect(result.current.query).toBe("")

      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledTimes(1) // Only from 'something'
      expect(mockFetchInvestigadoresByQuery).not.toHaveBeenCalled()
      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([])
      })
    })
  })

  describe("When an investigator is selected (and effect for fetching nombresAutor runs)", () => {
    test("And setInvestigadorSelected is called with an investigator, Then it should update state and fetch their nombresAutor", async () => {
      const mockNombres = ["Nombre Autor A", "Nombre Autor B"]
      mockFetchNombresDeAutor.mockResolvedValue(mockNombres)
      const { result } = renderTestHook({ codigo: defaultCodigo })

      act(() => {
        result.current.setInvestigadorSelected(mockInvestigador1)
      })

      expect(result.current.investigadorSelected).toEqual(mockInvestigador1)
      expect(mockFetchNombresDeAutor).toHaveBeenCalledWith(
        mockInvestigador1.email
      )
      await waitFor(() => {
        expect(result.current.nombresAutorForSelected).toEqual(mockNombres)
      })
    })

    test("And setInvestigadorSelected is called with an investigator but the fetch for nombresAutor fails, Then it should set nombresAutor to empty array", async () => {
      mockFetchNombresDeAutor.mockRejectedValue(false)
      const { result } = renderTestHook({ codigo: defaultCodigo })

      act(() => {
        result.current.setInvestigadorSelected(mockInvestigador1)
      })

      expect(result.current.investigadorSelected).toEqual(mockInvestigador1)
      expect(mockFetchNombresDeAutor).toHaveBeenCalledWith(
        mockInvestigador1.email
      )
      await waitFor(() => {
        expect(result.current.nombresAutorForSelected).toEqual([])
      })
    })

    test("And setInvestigadorSelected is called with null, Then it should clear selected state and nombresAutorForSelected", async () => {
      const { result } = renderTestHook({ codigo: defaultCodigo })

      act(() => {
        result.current.setInvestigadorSelected(mockInvestigador1)
      })
      await waitFor(() =>
        expect(result.current.investigadorSelected).not.toBeNull()
      )

      act(() => {
        result.current.setInvestigadorSelected(null)
      })

      expect(result.current.investigadorSelected).toBeNull()

      expect(mockFetchNombresDeAutor).toHaveBeenCalledTimes(1) // Called for mockInvestigador1, not for null
      await waitFor(() => {
        expect(result.current.nombresAutorForSelected).toEqual([])
      })
    })
  })

  describe("When direct state setters are called", () => {
    test("setNombreDeAutor should update nombreDeAutor state", () => {
      const { result } = renderTestHook({ codigo: defaultCodigo })
      const newName = "Manual Nombre Autor"
      act(() => {
        result.current.setNombreDeAutor(newName)
      })
      expect(result.current.nombreDeAutor).toBe(newName)
    })

    test("setIsOtherSelected should update isOtherSelected state", () => {
      const { result } = renderTestHook({ codigo: defaultCodigo })
      act(() => {
        result.current.setIsOtherSelected(true)
      })
      expect(result.current.isOtherSelected).toBe(true)
      act(() => {
        result.current.setIsOtherSelected(false)
      })
      expect(result.current.isOtherSelected).toBe(false)
    })
  })

  describe("When props (codigo, participaAdded) change (triggering investigator search effect)", () => {
    test("And `codigo` prop changes with an active query, Then the search effect should re-run with new codigo", async () => {
      const initialProps = { codigo: "PROJ1", participaAdded: [] }
      const { result, rerender } = renderHook(useAddParticipante, {
        initialProps,
      })

      act(() => {
        result.current.handleSearch("test")
      })
      await waitFor(() =>
        expect(
          mockFetchInvestigadoresNotParticipatingInProject
        ).toHaveBeenCalledWith("test", "PROJ1")
      )

      mockFetchInvestigadoresNotParticipatingInProject.mockClear()
      const newProps = { ...initialProps, codigo: "PROJ2" }
      rerender(newProps)

      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledWith("test", "PROJ2")
    })

    test("And `participaAdded` prop changes with an active query, Then the search effect should re-run and re-filter", async () => {
      const initialProps = {
        codigo: defaultCodigo,
        participaAdded: [] as ParticipaType[],
      }
      mockFetchInvestigadoresNotParticipatingInProject.mockResolvedValue([
        mockInvestigador1,
        mockInvestigador2,
      ])
      const { result, rerender } = renderHook(useAddParticipante, {
        initialProps,
      })

      act(() => {
        result.current.handleSearch("findInv")
      })
      await waitFor(() =>
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador1,
          mockInvestigador2,
        ])
      )

      const newParticipaAdded = [mockParticipanteAdded1]
      const newProps = { ...initialProps, participaAdded: newParticipaAdded }
      rerender(newProps)

      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledTimes(2) // Called again
      await waitFor(() => {
        expect(result.current.investigadoresSearched).toEqual([
          mockInvestigador2,
        ])
      })
    })
  })

  describe("And testing debounced behavior of handleSearch with fake timers", () => {
    beforeEach(() => {
      mockUseDebouncedCallback.mockImplementation(
        jest.requireActual("use-debounce").useDebouncedCallback
      )
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    test("When handleSearch is called multiple times rapidly, Then setQuery should only be called once after delay", () => {
      const { result } = renderTestHook({ codigo: defaultCodigo })

      // Simulate multiple rapid calls to handleSearch (which calls the debounced setQuery)
      act(() => {
        result.current.handleSearch("t")
      })
      act(() => {
        result.current.handleSearch("te")
      })
      act(() => {
        result.current.handleSearch("tes")
      })
      act(() => {
        result.current.handleSearch("test")
      })

      expect(result.current.query).toBe("") // Query state should not have updated yet

      act(() => {
        jest.advanceTimersByTime(499) // Just before debounce delay
      })
      expect(result.current.query).toBe("")

      act(() => {
        jest.advanceTimersByTime(1) // Cross the 500ms debounce threshold
      })

      expect(result.current.query).toBe("test") // Now query state should be updated
      // And this change in query should trigger the useEffect for fetching
      expect(
        mockFetchInvestigadoresNotParticipatingInProject
      ).toHaveBeenCalledWith("test", defaultCodigo)
    })
  })
})
