import Link from "next/link"

type CrumbProps = {
  crumb: {
    name: string
    url: string
  }
  level: number
  lastLevel: number
}

export const Crumb = ({ crumb, level, lastLevel }: CrumbProps) => {
  return (
    <li>
      <Link href={crumb.url}>{crumb.name}</Link>
      {level < lastLevel ? <span className="px-3">{">"}</span> : null}
    </li>
  )
}
