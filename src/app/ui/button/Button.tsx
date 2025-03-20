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
  fill: "text-background-color bg-font-color",
  border: "text-font-color bg-background-color",
  minimal: "text-font-color border-none",
}

const ButtonVariantDisabled = {
  fill: "text-background-color bg-font-color-disabled",
  border: "text-font-color-disabled bg-background-color",
  minimal: "text-font-color-disabled border-none",
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
        "flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-font-color outline-2",
        disabled ? ButtonVariantDisabled[variant] : ButtonVariant[variant],
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
