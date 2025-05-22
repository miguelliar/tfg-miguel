import "@testing-library/jest-dom"

import { render, screen } from "@testing-library/react"

import { Breadcrumbs } from "./Breadcrumbs"
import type { CrumbProps } from "./Crumb"
import type { URLCrumb } from "./useBreadcrumbs"

const mockUsePathname = jest.fn()
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

const MockCrumbComponent = jest.fn(({ crumb, level }: CrumbProps) => (
  <li
    data-testid={`crumb-${crumb.name.toLowerCase().replace(/\s+/g, "-")}`}
    data-level={level}
  >
    <a href={crumb.url}>{crumb.name}</a>
    <span>&nbsp;/&nbsp;</span>{" "}
  </li>
))
jest.mock("./Crumb", () => ({
  Crumb: (props: CrumbProps) => MockCrumbComponent(props),
}))

const mockUseBreadcrumbs = jest.fn()
jest.mock("./useBreadcrumbs", () => ({
  useBreadcrumbs: (pathname: string) => mockUseBreadcrumbs(pathname),
}))

describe("Given the Breadcrumbs component", () => {
  const defaultPathname = "/test/path"

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue(defaultPathname)
    // Default return for useBreadcrumbs, tests will override as needed
    mockUseBreadcrumbs.mockReturnValue([
      { name: "Inicio", url: "/" },
      { name: "Test", url: "/test" },
      { name: "Path", url: "/test/path" },
    ])
  })

  test("When rendered, Then it should call usePathname and useBreadcrumbs with the pathname", () => {
    // Arrange
    const currentPath = "/current/page"
    mockUsePathname.mockReturnValue(currentPath)

    // Act
    render(<Breadcrumbs />)

    // Assert
    expect(mockUsePathname).toHaveBeenCalledTimes(1)
    expect(mockUseBreadcrumbs).toHaveBeenCalledTimes(1)
    expect(mockUseBreadcrumbs).toHaveBeenCalledWith(currentPath)
  })

  test("When usePathname returns null, Then useBreadcrumbs should be called with an empty string", () => {
    // Arrange
    mockUsePathname.mockReturnValue(null)

    // Act
    render(<Breadcrumbs />)

    // Assert
    expect(mockUseBreadcrumbs).toHaveBeenCalledWith("")
  })

  describe("And useBreadcrumbs returns different numbers of crumbs", () => {
    test("When 0 crumbs are returned, Then it should render an empty list", () => {
      mockUseBreadcrumbs.mockReturnValue([])
      render(<Breadcrumbs />)
      const list = screen.getByRole("list") // The <ol>
      expect(list.children).toHaveLength(0)
    })

    test('When 1 crumb is returned (e.g., only "Inicio"), Then it should render an empty list', () => {
      // slice(1, 0) is [], and 1 > 2 is false
      mockUseBreadcrumbs.mockReturnValue([{ name: "Inicio", url: "/" }])
      render(<Breadcrumbs />)
      const list = screen.getByRole("list")
      expect(list.children).toHaveLength(0)
    })

    test('When 2 crumbs are returned (e.g., "Inicio", "Page1"), Then it should render an empty list', () => {
      // slice(1, 1) is [], and 2 > 2 is false
      mockUseBreadcrumbs.mockReturnValue([
        { name: "Inicio", url: "/" },
        { name: "Page1", url: "/page1" },
      ])
      render(<Breadcrumbs />)
      const list = screen.getByRole("list")
      expect(list.children).toHaveLength(0)
    })

    test('When 3 crumbs are returned (e.g., "Inicio", "Page1", "Current"), Then it should render one Crumb component and the last crumb name as text', () => {
      // Arrange
      const crumbsData: URLCrumb[] = [
        { name: "Inicio", url: "/" }, // crumbs[0] - Sliced out by slice(1, ...)
        { name: "Page1", url: "/page1" }, // crumbs[1] - Becomes middleCrumb
        { name: "Current", url: "/page1/current" }, // crumbs[2] - Becomes last text item
      ]
      mockUseBreadcrumbs.mockReturnValue(crumbsData)

      // Act
      render(<Breadcrumbs />)

      // Assert
      // Middle crumb (Page1)
      expect(MockCrumbComponent).toHaveBeenCalledTimes(1)
      expect(MockCrumbComponent).toHaveBeenCalledWith({
        crumb: crumbsData[1],
        level: 0,
      })
      expect(
        screen.getByTestId(`crumb-${crumbsData[1].name.toLowerCase()}`)
      ).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "Page1" })).toHaveAttribute(
        "href",
        "/page1"
      )

      // Last crumb (Current)
      expect(screen.getByText(crumbsData[2].name)).toBeInTheDocument()
      expect(screen.getByText(crumbsData[2].name).tagName).toBe("LI")
      expect(screen.getByText(crumbsData[2].name)).toHaveClass(
        "text-primary font-bold"
      )
      expect(
        screen.queryByTestId(`crumb-${crumbsData[2].name.toLowerCase()}`)
      ).not.toBeInTheDocument() // Not rendered via Crumb component
    })

    test("When 4 crumbs are returned, Then it should render two Crumb components and the last crumb name as text", () => {
      // Arrange
      const crumbsData: URLCrumb[] = [
        { name: "Inicio", url: "/" },
        { name: "Level1", url: "/level1" },
        { name: "Level2", url: "/level1/level2" },
        { name: "CurrentPage", url: "/level1/level2/current" },
      ]
      mockUseBreadcrumbs.mockReturnValue(crumbsData)

      // Act
      render(<Breadcrumbs />)

      // Assert
      // Middle crumbs
      expect(MockCrumbComponent).toHaveBeenCalledTimes(2)
      expect(MockCrumbComponent).toHaveBeenNthCalledWith(1, {
        crumb: crumbsData[1],
        level: 0,
      })
      expect(MockCrumbComponent).toHaveBeenNthCalledWith(2, {
        crumb: crumbsData[2],
        level: 1,
      })

      expect(screen.getByTestId("crumb-level1")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "Level1" })).toHaveAttribute(
        "href",
        "/level1"
      )
      expect(screen.getByTestId("crumb-level2")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "Level2" })).toHaveAttribute(
        "href",
        "/level1/level2"
      )

      // Last crumb
      expect(screen.getByText(crumbsData[3].name)).toBeInTheDocument()
      expect(screen.getByText(crumbsData[3].name).tagName).toBe("LI")
      expect(
        screen.queryByTestId(`crumb-${crumbsData[3].name.toLowerCase()}`)
      ).not.toBeInTheDocument()
    })
  })
})
