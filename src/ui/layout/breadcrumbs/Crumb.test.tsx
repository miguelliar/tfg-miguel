import { render, screen, within } from "@testing-library/react"

import { Crumb, type CrumbProps } from "./Crumb"

const mockNextLinkProps: any[] = []
jest.mock("next/link", () => {
  return jest.fn().mockImplementation((props) => {
    mockNextLinkProps.push(props)
    return (
      <a href={props.href} className={props.className}>
        {props.children}
      </a>
    )
  })
})

describe("Given the Crumb component", () => {
  const defaultCrumbData = { name: "Proyectos", url: "/proyectos" }

  beforeEach(() => {
    jest.clearAllMocks()
    mockNextLinkProps.slice(0, mockNextLinkProps.length)
  })

  const renderCrumb = (props: Partial<CrumbProps> = {}) => {
    const finalProps: CrumbProps = {
      crumb: defaultCrumbData,
      level: 0, // Default level
      ...props,
    }
    return render(<Crumb {...finalProps} />)
  }

  test("When rendered, Then it should display an <li> element", () => {
    renderCrumb()

    const linkElement = screen.getByRole("link")
    expect(linkElement.closest("li")).toBeInTheDocument()
  })

  test("Then it should render a Next.js Link with correct href and hover class", () => {
    renderCrumb()
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      defaultCrumbData.url
    )
    expect(mockNextLinkProps[0].className).toContain("hover:font-bold")
  })

  test('Then it should always render the ">" separator after the link', () => {
    renderCrumb()

    const listItem = screen.getByRole("link").closest("li")
    expect(within(listItem!).getByText(">")).toBeInTheDocument()
    expect(within(listItem!).getByText(">")).toHaveClass("px-3")
  })

  describe("And the `level` prop is 0 (first rendered crumb)", () => {
    beforeEach(() => {
      renderCrumb({ level: 0 })
    })

    test("Then the ellipsis span should be hidden", () => {
      const linkContent = screen.getByRole("link", {
        name: `... ${defaultCrumbData.name}`,
      })

      const linkChildren = Array.from(linkContent.childNodes)
      const ellipsisSpan = linkChildren.find(
        (node) => node.textContent === "..."
      ) as HTMLElement

      expect(ellipsisSpan).toHaveClass("hidden") // Due to `level < 1`
      expect(ellipsisSpan).toHaveClass("sm:hidden")
    })

    test("Then the name span should be visible and display the crumb name", () => {
      const linkContent = screen.getByRole("link", {
        name: `... ${defaultCrumbData.name}`,
      })
      const nameSpan = Array.from(linkContent.childNodes).find(
        (node) => node.textContent === defaultCrumbData.name
      ) as HTMLElement

      expect(nameSpan).toBeInTheDocument()
      expect(nameSpan.textContent).toBe(defaultCrumbData.name)
      expect(nameSpan).not.toHaveClass("hidden") // Because level > 0 is false
      expect(nameSpan).toHaveClass("sm:contents")
    })

    test("Then the link content should effectively be the crumb name", () => {
      expect(
        screen.getByRole("link", { name: `... ${defaultCrumbData.name}` })
      ).toBeInTheDocument()
    })
  })

  describe("And the `level` prop is 1 or greater (subsequent crumbs)", () => {
    beforeEach(() => {
      renderCrumb({ level: 1 })
    })

    test("Then the ellipsis span should be configured to be visible on extra-small screens (sm:hidden) and not hidden by level", () => {
      const linkContent = screen.getByRole("link")
      const ellipsisSpan = Array.from(linkContent.childNodes).find(
        (node) => node.textContent === "..."
      ) as HTMLElement

      expect(ellipsisSpan).toBeInTheDocument() // It's part of the DOM
      expect(ellipsisSpan).not.toHaveClass("hidden") // `level < 1` is false, so no 'hidden' from this
      expect(ellipsisSpan).toHaveClass("sm:hidden")
    })

    test("Then the name span should be hidden", () => {
      const linkContent = screen.getByRole("link")
      const nameSpan = Array.from(linkContent.childNodes).find(
        (node) => node.textContent === defaultCrumbData.name
      ) as HTMLElement

      expect(nameSpan).toHaveClass("hidden")
      expect(nameSpan).toHaveClass("sm:contents")
    })
  })
})
