import cx from "classnames"
import Link from "next/link"

type CrumbProps = {
  crumb: {
    name: string
    url: string
  }
  level: number
}

export const Crumb = ({ crumb, level }: CrumbProps) => {
  return (
    <li>
      <Link
        className={cx("hover:font-bold hover:text-background-color")}
        href={crumb.url}
      >
        <span
          className={cx("sm:hidden", {
            hidden: level < 1,
          })}
        >
          ...
        </span>
        <span
          className={cx("sm:contents", {
            hidden: level > 0,
          })}
        >
          {crumb.name}
        </span>
      </Link>
      <span className="px-3">{">"}</span>
    </li>
  )
}
