import "@testing-library/jest-dom"

import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"

import type { ProyectoMinimumDataType } from "../types"
import { ProyectoMiniCard } from "./ProyectoMiniCard"

// --- Mocks ---

const mockSetQueryParam = jest.fn()
jest.mock("@/utils/hooks/useQueryParam", () => ({
  useQueryParam: jest.fn(() => ({
    setQueryParam: mockSetQueryParam,
  })),
}))

let capturedShowMoreTextProps: any = {}

jest.mock("react-show-more-text", () => {
  const ShowMoreTextMock = (props: any) => {
    capturedShowMoreTextProps = props
    const [isExpanded, setIsExpanded] = React.useState(props.expanded || false)

    const toggleExpansion = () => {
      setIsExpanded(!isExpanded)
      if (props.onClick) {
        props.onClick(!isExpanded)
      }
    }

    return (
      <div data-testid="show-more-text-mock">
        {props.children}

        {!isExpanded && (
          <div
            onClick={toggleExpansion}
            data-testid="show-more-button-container"
          >
            {props.more}
          </div>
        )}
        {isExpanded && (
          <div
            onClick={toggleExpansion}
            data-testid="show-less-button-container"
          >
            {props.less}
          </div>
        )}
      </div>
    )
  }
  return ShowMoreTextMock
})

const mockProyectoData: ProyectoMinimumDataType = {
  codigo: "PROJ001",
  titulo:
    "Un título de proyecto muy interesante que es lo suficientemente largo como para necesitar ser truncado.",
}

const mockProyectoShortTitle: ProyectoMinimumDataType = {
  codigo: "PROJ002",
  titulo: "Título corto.",
}

// --- Tests ---
describe("ProyectoMiniCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedShowMoreTextProps = {}
  })

  describe("when it is rendered with project data", () => {
    beforeEach(() => {
      render(<ProyectoMiniCard proyecto={mockProyectoData} />)
    })

    test("should display the project code", () => {
      expect(screen.getByText(mockProyectoData.codigo)).toBeInTheDocument()
      expect(
        screen.getByRole("heading", { name: mockProyectoData.codigo })
      ).toBeInTheDocument()
    })

    test("should display the project title within ShowMoreText", () => {
      const showMoreTextMock = screen.getByTestId("show-more-text-mock")

      expect(showMoreTextMock).toHaveTextContent(mockProyectoData.titulo)
      expect(capturedShowMoreTextProps.lines).toBe(2)
    })

    test('should display the "Más..." button initially (from ShowMoreText)', () => {
      expect(screen.getByRole("button", { name: "Más..." })).toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "...Menos" })
      ).not.toBeInTheDocument()
    })

    test('should display the "Ver detalles" button', () => {
      expect(
        screen.getByRole("button", { name: "Ver detalles" })
      ).toBeInTheDocument()
    })

    test('setQueryParam function should be called with "codigo" when the "Ver detalles" button is clicked', () => {
      const detailsButton = screen.getByRole("button", { name: "Ver detalles" })
      fireEvent.click(detailsButton)

      expect(mockSetQueryParam).toHaveBeenCalledTimes(1)
      expect(mockSetQueryParam).toHaveBeenCalledWith(
        "codigo",
        mockProyectoData.codigo
      )
    })
  })

  describe('when the project title is long and the "Más..." button is clicked', () => {
    beforeEach(() => {
      render(<ProyectoMiniCard proyecto={mockProyectoData} />)
      const moreButton = screen.getByRole("button", { name: "Más..." })
      fireEvent.click(moreButton)
    })

    test('"...Menos" button should become visible and "Más..." should be hidden', () => {
      expect(
        screen.getByRole("button", { name: "...Menos" })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Más..." })
      ).not.toBeInTheDocument()
    })

    describe('and When the "...Menos" button is subsequently clicked', () => {
      beforeEach(() => {
        const lessButton = screen.getByRole("button", { name: "...Menos" })
        fireEvent.click(lessButton)
      })

      test('"Más..." button should become visible again and "...Menos" should be hidden', () => {
        expect(
          screen.getByRole("button", { name: "Más..." })
        ).toBeInTheDocument()
        expect(
          screen.queryByRole("button", { name: "...Menos" })
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("When rendered with a short title", () => {
    test('should still display the "Más..." button (as ShowMoreText controls this based on lines)', () => {
      render(<ProyectoMiniCard proyecto={mockProyectoShortTitle} />)
      expect(
        screen.getByText(mockProyectoShortTitle.codigo)
      ).toBeInTheDocument()
      expect(screen.getByTestId("show-more-text-mock")).toHaveTextContent(
        mockProyectoShortTitle.titulo
      )
      expect(screen.getByRole("button", { name: "Más..." })).toBeInTheDocument()
    })
  })
})
