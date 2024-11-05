"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

const chartData = [
  { Composition: "BTC", volume: 275, fill: "hsl(var(--chart-3))" },
  { Composition: "ETH", volume: 200, fill: "hsl(var(--chart-1))" },
  { Composition: "PEPE", volume: 287, fill: "hsl(var(--chart-2))" },
]

const chartConfig = {
  Composition: {
    label: "Crypto",
  },
  BTC: {
    label: "BTC",
    color: "hsl(var(--chart-1))",
  },
  ETH: {
    label: "ETH",
    color: "hsl(var(--chart-2))",
  },
  PEPE: {
    label: "PEPE",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function PieChartComposition() {
  const totalVolume = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.volume, 0)
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="volume"
          nameKey="Composition"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold text-white"
                    >
                      {totalVolume.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Volume
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
