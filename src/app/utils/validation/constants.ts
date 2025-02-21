export const ERROR_MESSAGES = {
  PROYECTO: {
    EMPTY: {
      CODIGO: "El codigo no puede estar vacío",
      IP: "El investigador principal no puede estar vacío",
      TITULO: "El titulo no puede estar vacío",
      FINANCIADO: "La financiación no puede estar vacía",
      FECHA_INICIO: "La fecha de inicio no puede estar vacía",
    },
    INVALID_DATA: {
      DUPLICATED_IP:
        "El co-investigador principal no ser el mismo que el investigador principal",
      FIN_ANTES_INICIO:
        "La fecha de finalización no puede ser anterior a la de inicio",
    },
  },
  INVESTIGADOR: {
    EMPTY: {
      EMAIL: "El email del investigador no puede estar vacío",
      NOMBRE: "El nombre del investigador no puede estar vacío",
      APELLIDOS: "Los apellidos del investigador no pueden estar vacíos",
      UNIVERSIDAD: "La universidad no puede estar vacía",
      DEPARTAMENTO: "El departamento no puede estar vacío",
      AREA: "El area no puede estar vacía",
      FIGURA: "La figura no puede estar vacía",
    },
  },
}
