import "@testing-library/jest-dom"

import { fireEvent, render, screen } from "@testing-library/react"

import { EditButton } from "./EditButton"

jest.mock("@heroicons/react/24/outline", () => ({
  PencilIcon: jest.fn(() => <svg data-testid="inactive-pencil-icon" />),
}))
jest.mock("@heroicons/react/24/solid", () => ({
  PencilIcon: jest.fn(() => <svg data-testid="active-pencil-icon" />),
}))

const mockInnerButtonOnClick = jest.fn()
jest.mock("./Button", () => ({
  Button: jest.fn(
    ({ children, onClick, className, variant, ariaLabel, type = "button" }) => {
      mockInnerButtonOnClick.mockImplementation(onClick as any)
      return (
        <button
          type={type as "button" | "submit" | "reset"}
          onClick={onClick}
          className={className}
          data-variant={variant}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      )
    }
  ),
}))

describe("Given the EditButton component", () => {
  let mockSetEditMode: jest.Mock
  const customClassName = "my-custom-edit-class"

  beforeEach(() => {
    mockSetEditMode = jest.fn()
    jest.clearAllMocks()
  })

  describe("When it is rendered with isEditMode set to false", () => {
    beforeEach(() => {
      render(
        <EditButton
          isEditMode={false}
          setEditMode={mockSetEditMode}
          className={customClassName}
        />
      )
    })

    test('Then it should display the "Editar proyecto" title as aria-label', () => {
      expect(
        screen.getByRole("button", { name: "Editar proyecto" })
      ).toBeInTheDocument()
    })

    test("Then it should display the InactivePencilIcon", () => {
      expect(screen.getByTestId("inactive-pencil-icon")).toBeInTheDocument()
      expect(screen.queryByTestId("active-pencil-icon")).not.toBeInTheDocument()
    })

    test("Then the underlying Button component should receive correct props", () => {
      const buttonElement = screen.getByRole("button", {
        name: "Editar proyecto",
      })

      expect(buttonElement).toHaveClass("w-6", customClassName)
      expect(buttonElement).toHaveAttribute("data-variant", "minimal")
    })

    describe("And When the button is clicked", () => {
      test("Then setEditMode should be called with true", () => {
        const buttonElement = screen.getByRole("button", {
          name: "Editar proyecto",
        })
        fireEvent.click(buttonElement)
        expect(mockSetEditMode).toHaveBeenCalledTimes(1)
        expect(mockSetEditMode).toHaveBeenCalledWith(true)
      })
    })
  })

  describe("When it is rendered with isEditMode set to true", () => {
    beforeEach(() => {
      render(
        <EditButton
          isEditMode
          setEditMode={mockSetEditMode}
          className={customClassName}
        />
      )
    })

    test('Then it should display the "Finalizar de editar proyecto" title as aria-label', () => {
      expect(
        screen.getByRole("button", { name: "Finalizar de editar proyecto" })
      ).toBeInTheDocument()
    })

    test("Then it should display the ActivePencilIcon", () => {
      expect(screen.getByTestId("active-pencil-icon")).toBeInTheDocument()
      expect(
        screen.queryByTestId("inactive-pencil-icon")
      ).not.toBeInTheDocument()
    })

    describe("And When the button is clicked", () => {
      test("Then setEditMode should be called with false", () => {
        const buttonElement = screen.getByRole("button", {
          name: "Finalizar de editar proyecto",
        })
        fireEvent.click(buttonElement)
        expect(mockSetEditMode).toHaveBeenCalledTimes(1)
        expect(mockSetEditMode).toHaveBeenCalledWith(false)
      })
    })
  })
})
