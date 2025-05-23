"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const useQueryParam = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const appendQueryParam = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.append(key, value.toString())
    params.sort()
    router.replace(`${pathname}?${params.toString()}`)
  }

  const setQueryParam = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.set(key, value.toString())
    params.sort()
    router.replace(`${pathname}?${params.toString()}`)
  }

  const getAllQueryParams = (key: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    return params.getAll(key)
  }

  const getQueryParam = (key: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    return params.get(key)
  }

  const hasQueryParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    // return params.has(key, value) --> has a bug, therefore it cannot be used
    if (value !== undefined) {
      const allValuesForKey = params.getAll(key)
      return allValuesForKey.includes(value)
    }
    return params.has(key)
  }

  const removeQueryParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    // params.delete(key, value) has a bug and removes all values for that key
    if (value) {
      const allValuesForKey = params.getAll(key)
      const filtersAfterRemoveQuery = allValuesForKey.filter(
        (paramValue) => paramValue !== value
      )
      params.delete(key)
      filtersAfterRemoveQuery.forEach((paramValue) =>
        params.append(key, paramValue)
      )
      params.sort()
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return {
    appendQueryParam,
    getAllQueryParams,
    getQueryParam,
    hasQueryParam,
    removeQueryParam,
    setQueryParam,
  }
}
