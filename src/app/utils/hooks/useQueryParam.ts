import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const useQueryParam = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const appendQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.set(key, value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const removeQueryParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete(key, value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return {
    appendQueryParam,
    removeQueryParam,
  }
}
