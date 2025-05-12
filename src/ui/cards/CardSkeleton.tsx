// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-md bg-secondary pb-2 pt-3 px-[14px] sm:px-7 border-primary border-2 shadow-sm min-w-96 min-h-62`}
    >
      <div className="flex justify-center items-center mb-[2px]">
        <div className="ml-2 h-6 w-24 rounded-md bg-accent-primary text-sm font-medium" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-[1px] items-center justify-center truncate">
          <div className="h-6 w-36 rounded-md bg-primary-strong" />
          <div className="h-6 w-52 rounded-md bg-primary" />
        </div>
        <div className="flex flex-col gap-[1px] items-center justify-center truncate">
          <div className="h-6 w-36 rounded-md bg-primary-strong" />
          <div className="h-20 w-full rounded-md bg-primary" />
        </div>
        <div className="flex flex-col gap-[1px] items-center justify-center truncate">
          <div className="h-6 w-36 rounded-md bg-primary-strong" />
          <div className="h-6 w-full rounded-md bg-primary" />
        </div>
        <div className="flex flex-row items-center justify-around truncate">
          <div className="flex flex-col items-center gap-[1px]">
            <div className="h-6 w-14 rounded-md bg-primary-strong" />
            <div className="h-6 w-20 rounded-md bg-primary" />
          </div>
          <div className="flex flex-col items-center gap-[1px]">
            <div className="h-6 w-8 rounded-md bg-primary-strong" />
            <div className="h-6 w-20 rounded-md bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-adaptable-big-mobile sm:grid-cols-adaptable-big gap-4 w-full">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}
