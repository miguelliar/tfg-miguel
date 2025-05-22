import { renderHook } from "@testing-library/react"

import { useBreadcrumbs } from "./useBreadcrumbs" // Adjust path as needed

describe("useBreadcrumbs Hook", () => {
  describe("Given different pathnames", () => {
    test('When pathname is "/home", Then it should return a single "Inicio" breadcrumb for "/home"', () => {
      // Arrange
      const pathname = "/home"

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([{ name: "Inicio", url: "/" }])
    })

    test('When pathname is "/", Then it should return a single "Inicio" breadcrumbs for "/"', () => {
      // Arrange
      // "/".split("/") results in ["", ""]. Each "" crumb becomes "Inicio".
      // 1st crumb "": prevPath="/", url="/"
      const pathname = "/"

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([{ name: "Inicio", url: "/" }])
    })

    test('When pathname is a single level like "/proyectos", Then it should return "Inicio" and "Proyectos"', () => {
      // Arrange
      // "/proyectos".split("/") results in ["", "proyectos"]
      // 1st crumb "": name="Inicio", url="/"
      // 2nd crumb "proyectos": name="Proyectos", url="/proyectos"
      const pathname = "/proyectos"

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([
        { name: "Inicio", url: "/" },
        { name: "Proyectos", url: "/proyectos" },
      ])
    })

    test('When pathname is multi-level like "/proyectos/editar/P001", Then it should return all segments capitalized', () => {
      // Arrange
      const pathname = "/proyectos/editar/P001"
      // "/proyectos/editar/P001".split("/") -> ["", "proyectos", "editar", "P001"]

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([
        { name: "Inicio", url: "/" },
        { name: "Proyectos", url: "/proyectos" },
        { name: "Editar", url: "/proyectos/editar" },
        { name: "P001", url: "/proyectos/editar/P001" },
      ])
    })

    test('When pathname has segments needing capitalization like "/user-profile/view-settings", Then it should capitalize them', () => {
      // Arrange
      const pathname = "/user-profile/view-settings"
      // .split("/") -> ["", "user-profile", "view-settings"]

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([
        { name: "Inicio", url: "/" },
        { name: "User-profile", url: "/user-profile" }, // Note: only first letter of segment capitalized
        { name: "View-settings", url: "/user-profile/view-settings" },
      ])
    })

    test('When pathname does not start with a slash like "dashboard/reports", Then it should still construct URLs from root', () => {
      // Arrange
      // "dashboard/reports".split("/") -> ["dashboard", "reports"]
      // 1st crumb "dashboard": prevPath="/", name="Dashboard", url="/dashboard"
      // 2nd crumb "reports": prevPath="dashboard/", name="Reports", url="dashboard/reports"
      const pathname = "dashboard/reports"

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([
        { name: "Dashboard", url: "/dashboard" },
        { name: "Reports", url: "dashboard/reports" },
      ])
    })

    test('When pathname is an empty string "", Then it should return a single "Inicio" breadcrumb for "/"', () => {
      // Arrange
      // "".split("/") results in [""]
      // 1st crumb "": prevPath="/", name="Inicio", url="/"
      const pathname = ""

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([{ name: "Inicio", url: "/" }])
    })

    test('When pathname has trailing slash like "/proyectos/editar/", Then it should ignore last empty segment', () => {
      // Arrange
      const pathname = "/proyectos/editar/"
      // "/proyectos/editar/".split("/") -> ["", "proyectos", "editar", ""]
      // Last crumb "" will have name "Inicio" and url "/proyectos/editar/"

      // Act
      const { result } = renderHook(() => useBreadcrumbs(pathname))

      // Assert
      expect(result.current).toEqual([
        { name: "Inicio", url: "/" },
        { name: "Proyectos", url: "/proyectos" },
        { name: "Editar", url: "/proyectos/editar" },
      ])
    })
  })

  describe("Given the useMemo for memoization", () => {
    test("When pathname prop does not change, Then the breadcrumbs array instance should remain the same", () => {
      // Arrange
      const pathname = "/proyectos/detalle"
      const { result, rerender } = renderHook(
        ({ path }) => useBreadcrumbs(path),
        { initialProps: { path: pathname } }
      )
      const firstResult = result.current

      // Act: Rerender with the same pathname string value
      rerender({ path: pathname })
      const secondResult = result.current

      // Assert
      expect(secondResult).toBe(firstResult) // Check for instance equality
    })

    test("When pathname prop changes, Then the breadcrumbs array instance should be new", () => {
      // Arrange
      const initialPathname = "/proyectos/detalle"
      const { result, rerender } = renderHook(
        ({ path }) => useBreadcrumbs(path),
        { initialProps: { path: initialPathname } }
      )
      const firstResult = result.current

      // Act: Rerender with a new pathname string value
      const newPathname = "/investigadores"
      rerender({ path: newPathname })
      const secondResult = result.current

      // Assert
      expect(secondResult).not.toBe(firstResult) // Should be a new instance
      expect(secondResult).toEqual([
        // And verify the content for the new path
        { name: "Inicio", url: "/" },
        { name: "Investigadores", url: "/investigadores" },
      ])
    })
  })
})
