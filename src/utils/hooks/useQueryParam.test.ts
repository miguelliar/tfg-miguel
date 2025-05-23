import { act, renderHook } from "@testing-library/react"

import { useQueryParam } from "./useQueryParam"

const mockRouterReplace = jest.fn()
const mockUsePathname = jest.fn()
const mockUseSearchParams = jest.fn()

let currentSearchParams = new URLSearchParams()

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}))

describe("Given the useQueryParam hook", () => {
  const initialPathname = "/test-path"

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue(initialPathname)

    currentSearchParams = new URLSearchParams()
    mockUseSearchParams.mockImplementation(() => currentSearchParams)
  })

  const setInitialSearchParams = (params: string | Record<string, string>) => {
    currentSearchParams = new URLSearchParams(params)
  }

  describe("When appendQueryParam is called", () => {
    test("Then it should append a new parameter and call router.replace with sorted params", () => {
      setInitialSearchParams("a=1")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.appendQueryParam("b", "2")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&b=2`
      )
    })

    test("Then it should append to an existing parameter and call router.replace with sorted params", () => {
      setInitialSearchParams("a=1&c=3")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.appendQueryParam("a", "2")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&a=2&c=3`
      )
    })

    test("Then it should handle number values correctly and sort params", () => {
      setInitialSearchParams("z=last")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.appendQueryParam("count", 100)
      })

      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?count=100&z=last`
      )
    })
  })

  describe("When setQueryParam is called", () => {
    test("Then it should set a new parameter and call router.replace with sorted params", () => {
      setInitialSearchParams("c=3&a=1")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.setQueryParam("b", "2")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&b=2&c=3`
      )
    })

    test("Then it should replace an existing parameter and call router.replace with sorted params", () => {
      setInitialSearchParams("a=1&b=old&c=3")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.setQueryParam("b", "new")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&b=new&c=3`
      )
    })

    test("Then it should handle number values correctly", () => {
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.setQueryParam("page", 5)
      })

      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?page=5`
      )
    })
  })

  describe("When getAllQueryParams is called", () => {
    test("Then it should return all values for a given key", () => {
      setInitialSearchParams("a=1&b=2&a=3")
      const { result } = renderHook(() => useQueryParam())

      const values = result.current.getAllQueryParams("a")

      expect(values).toEqual(["1", "3"])
    })

    test("Then it should return an empty array if the key does not exist", () => {
      setInitialSearchParams("a=1")
      const { result } = renderHook(() => useQueryParam())

      const values = result.current.getAllQueryParams("nonexistent")

      expect(values).toEqual([])
    })
  })

  describe("When getQueryParam is called", () => {
    test("Then it should return the first value for a given key", () => {
      setInitialSearchParams("a=1&b=2&a=3")
      const { result } = renderHook(() => useQueryParam())

      const value = result.current.getQueryParam("a")

      expect(value).toBe("1")
    })

    test("Then it should return null if the key does not exist", () => {
      setInitialSearchParams("a=1")
      const { result } = renderHook(() => useQueryParam())

      const value = result.current.getQueryParam("nonexistent")

      expect(value).toBeNull()
    })
  })

  describe("When hasQueryParam is called", () => {
    beforeEach(() => {
      setInitialSearchParams("a=1&b=2&b=anotherB")
    })

    test("Then it should return true if the key exists", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.hasQueryParam("a")).toBe(true)
    })

    test("Then it should return false if the key does not exist", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.hasQueryParam("nonexistent")).toBe(false)
    })

    test("Then it should return true if the key and specific value exist", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.hasQueryParam("b", "anotherB")).toBe(true)
    })

    test("Then it should return false if the key exists but the specific value does not", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.hasQueryParam("b", "nonExistentValueForB")).toBe(
        false
      )
    })
  })

  describe("When removeQueryParam is called", () => {
    test("Then it should remove all instances of a key and call router.replace with sorted params", () => {
      setInitialSearchParams("a=1&b=2&a=3&c=4")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.removeQueryParam("a")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?b=2&c=4`
      )
    })

    test("Then it should remove a specific key-value pair and call router.replace with sorted params", () => {
      setInitialSearchParams("a=1&b=value1&b=value2&c=3")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.removeQueryParam("b", "value1")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&b=value2&c=3`
      )
    })

    test("Then it should do nothing (but still call replace with sorted params) if the key to remove does not exist", () => {
      setInitialSearchParams("a=1&b=2")
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.removeQueryParam("nonexistent")
      })

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?a=1&b=2`
      )
    })
  })

  describe("When initial searchParams is null (from useSearchParams)", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(null)
    })

    test("Then appendQueryParam should work correctly, starting from empty params", () => {
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.appendQueryParam("newKey", "newValue")
      })

      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?newKey=newValue`
      )
    })

    test("Then setQueryParam should work correctly, starting from empty params", () => {
      const { result } = renderHook(() => useQueryParam())

      act(() => {
        result.current.setQueryParam("newKey", "newValue")
      })

      expect(mockRouterReplace).toHaveBeenCalledWith(
        `${initialPathname}?newKey=newValue`
      )
    })

    test("Then getQueryParam should return null for any key", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.getQueryParam("anyKey")).toBeNull()
    })

    test("Then getAllQueryParam should return empty array for any key", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.getAllQueryParams("anyKey")).toStrictEqual([])
    })

    test("Then hasQueryParam should return false for any key", () => {
      const { result } = renderHook(() => useQueryParam())

      expect(result.current.hasQueryParam("anyKey")).toBe(false)
    })

    test("Then removeQueryParam should not have any effect on params", () => {
      const { result } = renderHook(() => useQueryParam())

      result.current.removeQueryParam("anyKey")

      expect(mockRouterReplace).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).toHaveBeenCalledWith(`${initialPathname}?`)
    })
  })
})
