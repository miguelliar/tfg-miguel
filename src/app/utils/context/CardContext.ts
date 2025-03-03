"use client"

import type { RefObject } from "react"
import { createContext } from "react"

export const CloseRefContext =
  createContext<RefObject<HTMLButtonElement> | null>(null)
