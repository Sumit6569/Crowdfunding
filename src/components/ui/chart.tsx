
import * as React from "react"

export interface ChartConfig {
  [key: string]: {
    color: string
  }
}

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode | ((props: { config: ChartConfig }) => React.ReactNode)
  className?: string
}

interface ChartTooltipContentProps {
  active: boolean
  payload: Array<any>
  formatter?: (value: number | string) => string
}

export function ChartContainer({ className, config, children }: ChartContainerProps) {
  return (
    <div className={className}>
      {typeof children === "function"
        ? children({ config })
        : children}
    </div>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  formatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-1">
        {payload.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium">
              {item.name}:
            </span>
            <span>
              {formatter ? formatter(item.value) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
