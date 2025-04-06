"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type {
  ChangeEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
} from "react"
import { useDebouncedCallback } from "use-debounce"

export const SearchInput = ({
  required,
  name,
  id,
  onChange,
  placeholder,
  defaultValue,
  onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") event.preventDefault()
  },
}: {
  required?: boolean
  name?: string
  id: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder: string
  defaultValue?: string
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}) => {
  return (
    <input
      required={required}
      name={name}
      id={id}
      className="peer block w-full rounded-md border border-gray-200 py-[9px] px-10 text-sm outline-2 placeholder:text-gray-500"
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      onKeyDown={onKeyDown}
    />
  )
}

export const Search = ({ queryParam = "query" }: { queryParam?: string }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams("")
    if (term) {
      params.set(queryParam, term)
    } else {
      params.delete(queryParam)
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex justify-center m-1">
      {
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label htmlFor="search" className="min-w-64">
          <p className="sr-only">Search</p>
          <SearchInput
            id="search"
            placeholder="Buscar..."
            onChange={(e) => {
              handleSearch(e.target.value)
            }}
            defaultValue={searchParams?.get(queryParam)?.toString()}
          />
        </label>
      }
      <MagnifyingGlassIcon className="relative -left-9 h-[18px] w-[18px] translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}
