"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export const Search = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0 justify-center m-2">
      <label htmlFor="search">
        <p className="sr-only">Search</p>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Buscar..."
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          defaultValue={searchParams?.get("query")?.toString()}
        />
      </label>
      <MagnifyingGlassIcon className="relative -left-9 top-1/2 h-[18px] w-[18px] translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}
