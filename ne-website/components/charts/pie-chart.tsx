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

// Utility to generate random HSL color
const generateColor = () => {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.random() * 20 // 70% to 90%
  const lightness = 50 + Math.random() * 10 // 50% to 60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
interface ChartData {
  Composition: string
  volume: number
  fill: string
}

// Base chartConfig
const chartConfig: ChartConfig = {
  Composition: {
    label: "Crypto",
  },
}

export interface PieChartCompositionProps {
  data: { name: string; amount: number }[]
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
  }, [data])

  for (const item of data) {
    const coinName = item.name.toLowerCase()

    // Check if coin is already in config, if not add it dynamically
    if (!chartConfig[coinName]) {
      chartConfig[coinName] = {
        label: item.name,
        color: generateColor(),
      }
    }

    chartData.push({
      Composition: item.name,
      volume: item.amount,
      fill: chartConfig[coinName].color || generateColor(),
    })
  }
  console.log('Chart data', chartData)

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
