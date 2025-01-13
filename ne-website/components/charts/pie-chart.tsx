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
import { useDashboard } from "@/context/dashboardcontext"
import { Skeleton } from "../ui/skeleton"
import { formatNumber } from "@/lib/numberUtils"

export const description = "A donut chart with text"

interface ChartData {
  Composition: string
  volume: number
  fill: string
}

const chartConfig = {
  Composition: {
    label: "Crypto",
  },
  bitcoin: {
    label: "bitcoin",
    color: "hsl(var(--chart-3))",
  },
  ethereum: {
    label: "ethereum",
    color: "hsl(var(--chart-1))",
  },
  PEPE: {
    label: "PEPE",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export interface PieChartCompositionProps {
  data: { name: string; amount: number }[];
}
export function PieChartComposition({ data }: PieChartCompositionProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48" />
        </CardContent>
      </Card>
    )
  }
  const chartData: ChartData[] = []

  const totalVolume = React.useMemo(() => {
    return data.reduce((curr, item) => curr + item.amount, 0)
  }, [])

  for (const item of data) {
    const chartItem = chartConfig[item.name.toLowerCase()]
    chartData.push({
      Composition: item.name,
      volume: item.amount,
      fill: chartItem ? chartItem.color : "hsl(var(--chart-3))",
    })
  }

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
                      className="fill-foreground text-lg font-bold text-white"
                    >
                      {formatNumber(totalVolume, "USD")}
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
