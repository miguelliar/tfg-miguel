import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"

import type { ParticipaType } from "@/participa"
import { getStringDate } from "@/utils"

import type { ProyectoType } from "../types"
import { ProyectoCard } from "./ProyectoCard"

const mockDeleteProyecto = jest.fn()
const mockFetchParticipaByCodigoProyecto = jest.fn()
const mockUpdateProyectoItem = jest.fn()

jest.mock("@/db", () => ({
  deleteProyecto: () => mockDeleteProyecto(),
  fetchParticipaByCodigoProyecto: (codigo: string) =>
    mockFetchParticipaByCodigoProyecto(codigo),
  updateProyectoItem: (proyecto: ProyectoType) =>
    mockUpdateProyectoItem(proyecto),
}))

const mockCardModalOnClose = jest.fn()
jest.mock("@/ui", () => ({
  CardModal: jest.fn(({ children, option, onClose }) => {
    // Allow the test to trigger onClose
    mockCardModalOnClose.mockImplementation(onClose)
    return (
      <div data-testid="card-modal">
        {option && <div data-testid="card-modal-options">{option}</div>}
        {children}
        <button data-testid="card-modal-close-trigger" onClick={onClose}>
          Internal Close
        </button>
      </div>
    )
  }),
  DeleteButton: jest.fn(
    ({ deleteEvent, title, warningMessage, submitMessages }) => (
      <button
        data-testid="delete-button"
        onClick={deleteEvent}
        data-title={title}
        data-warning={warningMessage}
        data-submitmessages={JSON.stringify(submitMessages)}
      >
        Delete Proyecto
      </button>
    )
  ),
  EditButton: jest.fn(({ isEditMode, setEditMode }) => (
    <button
      data-testid="edit-button"
      onClick={() => act(() => setEditMode(!isEditMode))}
    >
      {isEditMode ? "Cancel Edit" : "Edit Proyecto"}
    </button>
  )),
  HorizontalCard: jest.fn(({ children, content, id }) => (
    <div data-testid={`horizontal-card-${id}`} data-content={content}>
      {children}
    </div>
  )),
}))

const mockRemoveQueryParam = jest.fn()
jest.mock("@/utils/hooks/useQueryParam", () => ({
  useQueryParam: jest.fn(() => ({
    removeQueryParam: mockRemoveQueryParam,
  })),
}))

let editProyectoFormProps: any = {}
jest.mock("../form", () => ({
  EditProyectoForm: jest.fn((props) => {
    editProyectoFormProps = props // Capture props to call them in tests
    return <div data-testid="edit-proyecto-form">Edit Proyecto Form</div>
  }),
}))

jest.mock("@heroicons/react/24/solid", () => ({
  ArrowTopRightOnSquareIcon: () => <div data-testid="arrow-icon" />,
  UsersIcon: () => <div data-testid="users-icon" />,
}))

// --- Test Data ---
const mockProyecto: ProyectoType = {
  codigo: "P001",
  ip: "Dr. Jane Doe",
  coip: "Dr. John Smith",
  titulo: "Amazing Research Project",
  financiado: "Yes Corp",
  inicio: new Date("2023-01-15"),
  fin: new Date("2024-06-30"),
}

const mockParticipaciones: ParticipaType[] = [
  {
    codigo: "P001",
    email: "alice@example.com",
    nombreAutor: "Alice Wonderland",
  },
  {
    codigo: "P001",
    email: "bob@example.com",
    nombreAutor: "Bob The Builder",
  },
]

const mockProyectoSinCoip: ProyectoType = {
  ...mockProyecto,
  codigo: "P002",
  coip: undefined,
}

const { getByText, getByTestId, queryByText, queryByTestId } = screen

describe("ProyectoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchParticipaByCodigoProyecto.mockResolvedValue([
      ...mockParticipaciones,
    ])
    mockDeleteProyecto.mockResolvedValue({ success: true })
    mockUpdateProyectoItem.mockResolvedValue({ success: true })
  })

  it("renders project details correctly in view mode", async () => {
    render(<ProyectoCard proyecto={mockProyecto} />)

    expect(getByText(`Codigo: ${mockProyecto.codigo}`)).toBeInTheDocument()
    expect(getByText(mockProyecto.ip!)).toBeInTheDocument()
    expect(getByText(mockProyecto.coip!)).toBeInTheDocument()
    expect(getByText(mockProyecto.titulo!)).toBeInTheDocument()
    expect(getByText(mockProyecto.financiado!)).toBeInTheDocument()
    expect(
      getByText(getStringDate(mockProyecto.inicio, "Sin inicio") as string)
    ).toBeInTheDocument()
    expect(
      getByText(getStringDate(mockProyecto.fin, "Sin fin") as string)
    ).toBeInTheDocument()

    // Check for options (Edit/Delete buttons)
    expect(getByTestId("card-modal-options")).toBeInTheDocument()
    expect(getByTestId("edit-button")).toBeInTheDocument()
    expect(getByTestId("delete-button")).toBeInTheDocument()

    // Check participaciones are fetched and rendered
    expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledWith(
      mockProyecto.codigo
    )
    await waitFor(() => {
      expect(
        getByTestId("horizontal-card-alice@example.com")
      ).toBeInTheDocument()
    })
    const aliceCard = getByTestId("horizontal-card-alice@example.com")
    expect(aliceCard.querySelector("a")).toHaveAttribute(
      "href",
      "investigadores?email=alice%40example.com"
    )
  })

  it("does not render Co-IP when not provided", () => {
    render(<ProyectoCard proyecto={mockProyectoSinCoip} />)
    expect(queryByText("Co Investigador Principal:")).not.toBeInTheDocument()
  })

  it("fetches participaciones again when proyecto.codigo changes", async () => {
    const { rerender } = render(<ProyectoCard proyecto={mockProyecto} />)
    expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledTimes(1)
    expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledWith(
      mockProyecto.codigo
    )

    await waitFor(() =>
      expect(
        getByTestId("horizontal-card-alice@example.com")
      ).toBeInTheDocument()
    )

    const newProyecto = { ...mockProyecto, codigo: "P002" }
    mockFetchParticipaByCodigoProyecto.mockResolvedValueOnce([
      {
        codigoProyecto: "P002",
        email: "charlie@example.com",
        nombreAutor: "Charlie Brown",
      },
    ])

    rerender(<ProyectoCard proyecto={newProyecto} />)

    expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledTimes(2)
    expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledWith(
      newProyecto.codigo
    )

    await waitFor(() =>
      expect(
        getByTestId("horizontal-card-charlie@example.com")
      ).toBeInTheDocument()
    )
    expect(queryByText("Alice Wonderland")).not.toBeInTheDocument()
  })

  it("handles empty participaciones correctly when endpoint does not return participaciones", async () => {
    mockFetchParticipaByCodigoProyecto.mockResolvedValueOnce(undefined)

    render(<ProyectoCard proyecto={mockProyecto} />)

    await waitFor(() => {
      expect(mockFetchParticipaByCodigoProyecto).toHaveBeenCalledWith(
        mockProyecto.codigo
      )
    })
    expect(queryByText("Participantes")).not.toBeInTheDocument()
    expect(queryByTestId(/horizontal-card-/)).not.toBeInTheDocument()
  })

  it("calls removeQueryParam when CardModal onClose is triggered", async () => {
    render(<ProyectoCard proyecto={mockProyecto} />)

    const closeTrigger = getByTestId("card-modal-close-trigger")
    await act(async () => {
      fireEvent.click(closeTrigger)
    })

    expect(mockRemoveQueryParam).toHaveBeenCalledWith("codigo")
  })

  it("calls deleteProyecto when DeleteButton is clicked", async () => {
    render(<ProyectoCard proyecto={mockProyecto} />)
    const deleteButton = getByTestId("delete-button")

    expect(deleteButton).toHaveAttribute("data-title", "Borrar proyecto")
    expect(deleteButton).toHaveAttribute(
      "data-warning",
      `El proyecto ${mockProyecto.codigo} así como las participaciones del mismo serán eliminados`
    )

    await act(async () => {
      fireEvent.click(deleteButton)
    })

    expect(mockDeleteProyecto).toHaveBeenCalledTimes(1)
  })

  describe("when toggles to edit mode", () => {
    beforeEach(async () => {
      render(<ProyectoCard proyecto={mockProyecto} />)
      const editButton = getByTestId("edit-button")

      await act(async () => {
        fireEvent.click(editButton)
      })
    })

    it("shows EditProyectoForm", async () => {
      expect(getByTestId("edit-proyecto-form")).toBeInTheDocument()
      expect(queryByText(mockProyecto.ip!)).not.toBeInTheDocument()
    })

    it("exits when finishEditMode is called from form", async () => {
      await act(async () => {
        editProyectoFormProps.finishEditMode()
      })

      expect(queryByTestId("edit-proyecto-form")).not.toBeInTheDocument()
      expect(getByText(mockProyecto.ip!)).toBeInTheDocument()
    })

    it("calls updateProyectoItem when onUpdate is called from form with data", async () => {
      const updatedData = { ...mockProyecto, titulo: "Updated Title" }
      await act(async () => {
        editProyectoFormProps.onUpdate(updatedData)
      })

      expect(mockUpdateProyectoItem).toHaveBeenCalledWith(updatedData)
    })

    it("does not call updateProyectoItem when onUpdate is called from form without data", async () => {
      await act(async () => {
        editProyectoFormProps.onUpdate(undefined)
      })
      expect(mockUpdateProyectoItem).not.toHaveBeenCalled()
    })
  })
})
