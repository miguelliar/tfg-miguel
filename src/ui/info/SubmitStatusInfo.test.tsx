import "@testing-library/jest-dom"

import { act, fireEvent, render, screen } from "@testing-library/react"

import type { ProyectoFileState } from "@/utils"

import { SubmitStatusInfo } from "./SubmitStatusInfo"

jest.mock("@heroicons/react/24/solid", () => ({
  CheckBadgeIcon: jest.fn(() => <svg data-testid="check-badge-icon" />),
  XCircleIcon: jest.fn(() => <svg data-testid="x-circle-icon" />),
}))

jest.mock("../button/Button", () => ({
  Button: jest.fn(({ children, onClick, className }) => {
    return (
      <button
        onClick={onClick}
        className={className}
        data-testid="custom-button"
      >
        {children}
      </button>
    )
  }),
}))

let mockCardModalOnClose: () => void
jest.mock("../cards/CardModal", () => ({
  CardModal: jest.fn(({ children, onClose }) => {
    mockCardModalOnClose = onClose
    return (
      <div data-testid="card-modal">
        {children}
        <button data-testid="card-modal-internal-close" onClick={onClose}>
          Internal Close
        </button>
      </div>
    )
  }),
}))

describe("Given the SubmitStatusInfo component", () => {
  let mockOnCloseSubmitMessage: jest.Mock
  const onSuccessMessage = "Todo ha ido de maravilla!"
  const onFailureMessage = "Algo ha fallado."

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnCloseSubmitMessage = jest.fn()
  })

  const renderComponent = (
    submittedStatus: ProyectoFileState["submittedStatus"],
    messages: { onSuccess?: string; onFailure?: string } = {}
  ) => {
    return render(
      <SubmitStatusInfo
        submittedStatus={submittedStatus}
        onCloseSubmitMessage={mockOnCloseSubmitMessage}
        messages={messages}
      />
    )
  }

  describe('When rendered with submittedStatus as "success"', () => {
    test('Then it should display the success icon, "Éxito" title, and the success message if provided', () => {
      renderComponent("success", { onSuccess: onSuccessMessage })

      expect(screen.getByTestId("check-badge-icon")).toBeInTheDocument()
      expect(screen.getByText("Éxito")).toBeInTheDocument()
      expect(screen.getByText(onSuccessMessage)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
    })

    test('Then it should display the success icon and "Éxito" title, and handle missing onSuccess message', () => {
      renderComponent("success", { onSuccess: undefined })

      expect(screen.getByTestId("check-badge-icon")).toBeInTheDocument()
      expect(screen.getByText("Éxito")).toBeInTheDocument()

      const messageParagraph = screen
        .getByText("Éxito")
        .closest("div")?.nextElementSibling
      expect(messageParagraph).not.toBeInTheDocument()
    })
  })

  describe('When rendered with submittedStatus as "error" (or any non-success state)', () => {
    test('Then it should display the error icon, "Error" title, and the failure message if provided', () => {
      renderComponent("error", { onFailure: onFailureMessage })

      expect(screen.getByTestId("x-circle-icon")).toBeInTheDocument()
      expect(screen.getByText("Error")).toBeInTheDocument()
      expect(screen.getByText(onFailureMessage)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
    })

    test('Then it should display the error icon and "Error" title, and handle missing onFailure message', () => {
      renderComponent("error", { onFailure: undefined })

      expect(screen.getByTestId("x-circle-icon")).toBeInTheDocument()
      expect(screen.getByText("Error")).toBeInTheDocument()
      const messageParagraph = screen
        .getByText("Error")
        .closest("div")?.nextElementSibling
      expect(messageParagraph).not.toBeInTheDocument()
    })
  })

  describe('When the "Cerrar" button (custom Button) is clicked', () => {
    test("Then the onCloseSubmitMessage callback should be invoked", () => {
      renderComponent("success")

      const cerrarButton = screen.getByRole("button", { name: "Cerrar" })
      fireEvent.click(cerrarButton)

      expect(mockOnCloseSubmitMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe("When the CardModal requests to be closed", () => {
    test("Then the onCloseSubmitMessage callback should be invoked", () => {
      renderComponent("error")

      expect(mockCardModalOnClose).toBeDefined()

      act(() => {
        if (mockCardModalOnClose) {
          mockCardModalOnClose()
        }
      })

      expect(mockOnCloseSubmitMessage).toHaveBeenCalledTimes(1)
    })
  })
})
