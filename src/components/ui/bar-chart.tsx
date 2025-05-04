
import * as React from "react"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarChartProps) {
  const chartConfig = React.useMemo<ChartConfig>(() => {
    return Object.fromEntries(
      categories.map((category, i) => [
        category,
        {
          color: colors[i % colors.length],
        },
      ])
    )
  }, [categories, colors])

  return (
    <ChartContainer className={className} config={chartConfig}>
      {({ config }) => (
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart data={data}>
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickMargin={8}
              tickFormatter={(value) => valueFormatter(value)}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const categoryPayload = payload.find((p) => p.dataKey === categories[0])
              const value = categoryPayload?.value
              return (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              )
            }} />
            {categories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={config[category]?.color ?? colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
