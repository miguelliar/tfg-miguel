import cx from "classnames"

export interface ButtonProps {
  children: React.ReactNode
  ariaLabel?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: keyof typeof ButtonVariant
}

const ButtonVariant = {
  fill: "p-2 text-background-color bg-font-color hover:bg-font-color-accent focus:bg-font-color-accent border border-font-color outline-2",
  border:
    "p-2 text-font-color bg-background-color hover:text-font-color-accent focus:text-font-color-accent border border-font-color outline-2",
  minimal:
    "text-font-color border-none hover:text-font-color-accent focus:text-font-color-accent",
  custom: "",
}

const ButtonVariantDisabled = {
  fill: "p-2 text-background-color bg-font-color-disabled border border-font-color outline-2 ",
  border:
    "p-2 text-font-color-disabled bg-background-color border border-font-color outline-2 ",
  minimal: "text-font-color-disabled border-none",
  custom: "",
}

export const Button = ({
  children,
  ariaLabel,
  className,
  disabled = false,
  onClick,
  type = "button",
  variant = "border",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex flex-row text-nowrap max-h-fit rounded-md transition-all",
        disabled ? ButtonVariantDisabled[variant] : ButtonVariant[variant],
        className
      )}
      // eslint-disable-next-line react/button-has-type
      type={type}
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
