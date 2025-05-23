import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { DeleteButton } from "./DeleteButton"

// --- Mocking Next.js navigation ---
const mockReplace = jest.fn()
const mockRefresh = jest.fn()
const mockPathname = "/current-test-path"

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}))

let cardModalOnCloseCallback: () => void
jest.mock("../cards/CardModal", () => ({
  CardModal: jest.fn(({ children, onClose }) => {
    cardModalOnCloseCallback = onClose
    return <div data-testid="card-modal">{children}</div>
  }),
}))

jest.mock("../info/SubmitStatusInfo", () => ({
  SubmitStatusInfo: jest.fn(
    ({ submittedStatus, onCloseSubmitMessage, messages }) => {
      return (
        <div
          data-testid="submit-status-info"
          data-status={submittedStatus}
          data-messages={JSON.stringify(messages)}
        >
          <button
            data-testid="submit-status-info-close-button"
            onClick={onCloseSubmitMessage}
          >
            Close Status Info
          </button>
          <p>
            {submittedStatus === "success"
              ? messages.onSuccess
              : messages.onFailure}
          </p>
        </div>
      )
    }
  ),
}))

jest.mock("./Button", () => ({
  Button: jest.fn(
    ({ children, onClick, variant, className, ariaLabel, type = "button" }) => (
      <button
        type={type as "button" | "submit" | "reset"}
        onClick={onClick}
        data-variant={variant}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  ),
}))

jest.mock("@heroicons/react/24/solid", () => ({
  TrashIcon: () => <svg data-testid="trash-icon" />,
}))

const mockTitle = "Delete Test Item"
const mockWarningMessage = "Are you sure you want to delete this item?"
const mockSubmitMessages = {
  onSuccess: "Item deleted successfully!",
  onFailure: "Failed to delete item.",
}

let mockDeleteEvent: jest.Mock<Promise<boolean | undefined>>

describe("Given the DeleteButton component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleteEvent = jest.fn(() => Promise.resolve(true))
  })

  const renderComponent = (props = {}) => {
    return render(
      <DeleteButton
        title={mockTitle}
        deleteEvent={mockDeleteEvent}
        warningMessage={mockWarningMessage}
        submitMessages={mockSubmitMessages}
        className="extra-class"
        {...props}
      />
    )
  }

  describe("When it is initially rendered", () => {
    test("Then the main trigger button with TrashIcon should be visible", () => {
      renderComponent()
      const triggerButton = screen.getByRole("button", { name: mockTitle })
      expect(triggerButton).toBeInTheDocument()
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument()
      expect(triggerButton).toHaveClass("extra-class")
    })

    test("Then the warning modal (CardModal) should not be visible", () => {
      renderComponent()
      expect(screen.queryByTestId("card-modal")).not.toBeInTheDocument()
    })

    test("Then the SubmitStatusInfo should not be visible", () => {
      renderComponent()
      expect(screen.queryByTestId("submit-status-info")).not.toBeInTheDocument()
    })
  })

  describe("When the main trigger button is clicked", () => {
    beforeEach(async () => {
      renderComponent()
      const triggerButton = screen.getByRole("button", { name: mockTitle })
      await act(async () => {
        fireEvent.click(triggerButton)
      })
    })

    test("Then the CardModal with the warning message should become visible", () => {
      expect(screen.getByTestId("card-modal")).toBeInTheDocument()
      expect(screen.getByText(mockWarningMessage)).toBeInTheDocument()
      expect(screen.getByText(/¿Deseas continuar\?/)).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Cancelar" })
      ).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Borrar" })).toBeInTheDocument()
    })

    describe('And When the "Cancelar" button inside the modal is clicked', () => {
      test("Then the CardModal should become hidden", async () => {
        const cancelButton = screen.getByRole("button", { name: "Cancelar" })
        await act(async () => {
          fireEvent.click(cancelButton)
        })
        expect(screen.queryByTestId("card-modal")).not.toBeInTheDocument()
      })
    })

    describe("And When the CardModal's onClose prop is triggered", () => {
      test("Then the CardModal should become hidden", async () => {
        expect(cardModalOnCloseCallback).toBeDefined()
        if (cardModalOnCloseCallback) {
          await act(async () => {
            cardModalOnCloseCallback()
          })
        }
        expect(screen.queryByTestId("card-modal")).not.toBeInTheDocument()
      })
    })
  })

  describe("When the deletion process is successful", () => {
    beforeEach(async () => {
      mockDeleteEvent.mockResolvedValue(true)
      renderComponent()

      const triggerButton = screen.getByRole("button", { name: mockTitle })
      await act(async () => {
        fireEvent.click(triggerButton)
      })

      const borrarButton = screen.getByRole("button", { name: "Borrar" })
      await act(async () => {
        fireEvent.click(borrarButton)
      })
    })

    test("Then deleteEvent should have been called", () => {
      expect(mockDeleteEvent).toHaveBeenCalledTimes(1)
    })

    test("Then a loading state should have been shown and then hidden", async () => {
      // This is tricky to test precisely without snapshotting during the loading state.
      // We know it sets isLoading true then false. We'll check the final state.
      // The "Cargando..." text is shown when isLoading is true AND isSuccessfulDelete is null or false.
      // After success, isLoading is false, isSuccessfulDelete is true.
      // So "Cargando..." should not be in the document after the process.
      await waitFor(() => {
        expect(screen.queryByText("Cargando...")).not.toBeInTheDocument()
      })
    })

    test("Then the CardModal content related to confirmation/loading should be gone", () => {
      // The modal itself might still be open (isWarningOpen = true), but its conditional content changes.
      // Check that the initial warning message and buttons are no longer there.
      expect(screen.queryByText(mockWarningMessage)).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Cancelar" })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Borrar" })
      ).not.toBeInTheDocument()
    })

    test('Then SubmitStatusInfo should be rendered with a "success" status and message', () => {
      const statusInfo = screen.getByTestId("submit-status-info")
      expect(statusInfo).toBeInTheDocument()
      expect(statusInfo).toHaveAttribute("data-status", "success")
      expect(statusInfo).toHaveTextContent(mockSubmitMessages.onSuccess)
    })

    describe("And When SubmitStatusInfo's onCloseSubmitMessage is triggered", () => {
      test("Then router.replace and router.refresh should be called", async () => {
        const closeButton = screen.getByTestId(
          "submit-status-info-close-button"
        )
        await act(async () => {
          fireEvent.click(closeButton)
        })

        expect(mockReplace).toHaveBeenCalledWith(mockPathname)
        expect(mockRefresh).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("When the deletion process fails", () => {
    beforeEach(async () => {
      mockDeleteEvent.mockResolvedValue(false)
      renderComponent()

      const triggerButton = screen.getByRole("button", { name: mockTitle })
      await act(async () => {
        fireEvent.click(triggerButton)
      })

      const borrarButton = screen.getByRole("button", { name: "Borrar" })
      await act(async () => {
        fireEvent.click(borrarButton)
      })
    })

    test("Then deleteEvent should have been called", () => {
      expect(mockDeleteEvent).toHaveBeenCalledTimes(1)
    })

    test('Then SubmitStatusInfo should be rendered with an "error" status and message', () => {
      const statusInfo = screen.getByTestId("submit-status-info")
      expect(statusInfo).toBeInTheDocument()
      expect(statusInfo).toHaveAttribute("data-status", "error")
      expect(statusInfo).toHaveTextContent(mockSubmitMessages.onFailure)
    })

    describe("And When SubmitStatusInfo's onCloseSubmitMessage is triggered", () => {
      test("Then router.replace and router.refresh should be called", async () => {
        const closeButton = screen.getByTestId(
          "submit-status-info-close-button"
        )
        await act(async () => {
          fireEvent.click(closeButton)
        })
        expect(mockReplace).toHaveBeenCalledWith(mockPathname)
        expect(mockRefresh).toHaveBeenCalledTimes(1)
      })
    })
  })

  test("should show loading indicator while deleteEvent is processing", async () => {
    // eslint-disable-next-line no-unused-vars
    let resolveDeleteEvent: (value: boolean | undefined) => void
    mockDeleteEvent.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDeleteEvent = resolve
        })
    )

    renderComponent()

    const triggerButton = screen.getByRole("button", { name: mockTitle })
    fireEvent.click(triggerButton)

    const borrarButton = screen.getByRole("button", { name: "Borrar" })

    act(() => {
      fireEvent.click(borrarButton)
    })

    expect(screen.getByText("Cargando...")).toBeInTheDocument()
    expect(screen.queryByText(mockWarningMessage)).not.toBeInTheDocument()

    await act(async () => {
      resolveDeleteEvent(true)
    })

    expect(screen.queryByText("Cargando...")).not.toBeInTheDocument()
    expect(screen.getByTestId("submit-status-info")).toBeInTheDocument()
    expect(screen.getByTestId("submit-status-info")).toHaveAttribute(
      "data-status",
      "success"
    )
  })
})
