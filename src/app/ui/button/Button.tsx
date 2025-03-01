import cx from "classnames"

const ButtonVariant = {
  fill: "text-background-color bg-font-color",
  border: "text-font-color bg-background-color",
  minimal: "text-font-color border-none",
}

export const Button = ({
  children,
  onClick,
  variant = "border",
  className,
  type = "button",
  ariaLabel,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: keyof typeof ButtonVariant
  type?: "button" | "submit" | "reset"
  ariaLabel?: string
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-gray-300 outline-2",
        ButtonVariant[variant],
        {
          "text-disabled-color": disabled,
        },
        className
      )}
      // eslint-disable-next-line react/button-has-type
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
