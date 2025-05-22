import { useMemo } from "react"

export type URLCrumb = {
  name: string
  url: string
}

export const useBreadcrumbs = (pathname: string): URLCrumb[] => {
  const breadcrumbs = useMemo(() => {
    if (pathname === "/home" || pathname === "/" || pathname === "")
      return [{ name: "Inicio", url: "/" }]
    const rawBreadcrumbs = pathname.split("/")
    if (!rawBreadcrumbs[rawBreadcrumbs.length - 1]) {
      rawBreadcrumbs.pop()
    }
    const breadcrumbs = rawBreadcrumbs.map((crumb, index, crumbs) => {
      const previousPath =
        crumbs
          .slice(0, index)
          .reduce(
            (finalPath, currentCrumb) => `${finalPath + currentCrumb}/`,
            ""
          ) || "/"

      const capizalizeCrumb = !crumb
        ? "Inicio"
        : crumb[0].toUpperCase() + crumb.slice(1)

      return {
        name: capizalizeCrumb,
        url: previousPath + crumb,
      }
    })
    return breadcrumbs
  }, [pathname])

  return breadcrumbs
}
