import cx from "classnames"

export interface ButtonProps {
  children: React.ReactNode
  ariaLabel?: string
  autoFocus?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: keyof typeof ButtonVariant
}

const ButtonVariant = {
  fill: "p-2 text-secondary bg-primary hover:bg-primary-strong focus:bg-primary-strong border border-primary outline-2",
  border:
    "p-2 text-primary bg-secondary hover:text-primary-strong focus:text-primary-strong border border-primary outline-2",
  minimal:
    "text-primary border-none hover:text-primary-strong focus:text-primary-strong",
  custom: "",
}

const ButtonVariantDisabled = {
  fill: "p-2 text-secondary bg-primary-disabled border border-primary outline-2 ",
  border:
    "p-2 text-primary-disabled bg-secondary border border-primary outline-2 ",
  minimal: "text-primary-disabled border-none",
  custom: "",
}

export const Button = ({
  children,
  ariaLabel,
  autoFocus,
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
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      title={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
