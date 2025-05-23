import "@testing-library/jest-dom"

import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"

import { CardModal } from "./CardModal"

jest.mock("@heroicons/react/24/solid", () => ({
  XMarkIcon: jest.fn(() => <svg data-testid="x-mark-icon" />),
}))

describe("Given the CardModal component", () => {
  let mockOnClose: jest.Mock
  const modalChildrenText = "This is the modal content."
  const modalOptionText = "Optional Action Button"

  beforeEach(() => {
    mockOnClose = jest.fn()
  })

  const renderModal = (optionNode?: React.ReactNode) => {
    return render(
      <CardModal onClose={mockOnClose} option={optionNode}>
        <p>{modalChildrenText}</p>
      </CardModal>
    )
  }

  describe("When it is rendered", () => {
    test("Then it should display its children content", () => {
      renderModal()
      expect(screen.getByText(modalChildrenText)).toBeInTheDocument()
    })

    test("Then it should display the close button with an XMarkIcon and correct ARIA label", () => {
      renderModal()
      const closeButton = screen.getByRole("button", { name: "Cerrar Modal" })
      expect(closeButton).toBeInTheDocument()
      expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument()
      expect(closeButton).toHaveAttribute("title", "Cerrar Modal")
    })

    test("Then it should display the optional content if provided", () => {
      renderModal(<button>{modalOptionText}</button>)
      expect(
        screen.getByRole("button", { name: modalOptionText })
      ).toBeInTheDocument()
    })

    test("Then it should not render a placeholder for optional content if not provided", () => {
      renderModal()

      expect(screen.queryByText(modalOptionText)).not.toBeInTheDocument()
    })
  })

  describe("When the close button is clicked", () => {
    test("Then the onClose callback should be invoked", () => {
      renderModal()
      const closeButton = screen.getByRole("button", { name: "Cerrar Modal" })
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe("When the overlay (backdrop) is clicked", () => {
    test("Then the onClose callback should be invoked", () => {
      renderModal()

      const overlay = screen
        .getByText(modalChildrenText)
        .closest('div[class*="bg-slate-600/50"]')
      expect(overlay).toBeInTheDocument()

      if (overlay) {
        fireEvent.click(overlay)
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe("When the modal content area (section) is clicked", () => {
    test("Then the onClose callback should NOT be invoked due to event propagation stopping", () => {
      renderModal()
      const contentSection = screen
        .getByText(modalChildrenText)
        .closest("section")
      expect(contentSection).toBeInTheDocument()

      if (contentSection) {
        fireEvent.click(contentSection)
        expect(mockOnClose).not.toHaveBeenCalled()
      }
    })
  })

  describe('When the "Escape" key is pressed', () => {
    test("Then the onClose callback should be invoked", () => {
      renderModal()
      const overlay = screen
        .getByText(modalChildrenText)
        .closest('div[class*="bg-slate-600/50"]')
      expect(overlay).toBeInTheDocument()

      if (overlay) {
        ;(overlay as HTMLElement).focus()
        fireEvent.keyDown(overlay, { key: "Escape", code: "Escape" })
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe("When interacting with the close button via keyboard", () => {
    test('And "Tab" key (without Shift) is pressed while close button is focused, Then onClose should be called', () => {
      renderModal()
      const closeButton = screen.getByRole("button", { name: "Cerrar Modal" })
      closeButton.focus()
      expect(closeButton).toHaveFocus()

      fireEvent.keyDown(closeButton, {
        key: "Tab",
        code: "Tab",
        shiftKey: false,
      })
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('And "Shift+Tab" is pressed while close button is focused, Then onClose should NOT be called by this specific handler', () => {
      renderModal()
      const closeButton = screen.getByRole("button", { name: "Cerrar Modal" })
      closeButton.focus()
      expect(closeButton).toHaveFocus()

      fireEvent.keyDown(closeButton, {
        key: "Tab",
        code: "Tab",
        shiftKey: true,
      })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    test('And another key (e.g., "Enter") is pressed while close button is focused, Then onClose should NOT be called by closeBtnOnKeyDown', () => {
      renderModal()
      const closeButton = screen.getByRole("button", { name: "Cerrar Modal" })
      closeButton.focus()
      expect(closeButton).toHaveFocus()

      fireEvent.keyDown(closeButton, { key: "Enter", code: "Enter" })

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })
})
