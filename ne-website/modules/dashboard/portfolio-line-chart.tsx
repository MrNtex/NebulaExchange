import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../../components/ui/skeleton";
import { roundTo } from "@/lib/numberUtils";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


function getPrices() {
  const data: Array<{ date: string; price: number }> = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12); // Start from 12 months ago

  for (let i = 0; i < 48; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7); // Increment by 7 days (weekly data points)
    
    const price = parseFloat((1000 + Math.random() * 500 - Math.random() * 300).toFixed(2)); // Simulated price between 700 and 1500
    data.push({ date: date.toISOString().split('T')[0], price });
  }

  return data;


  // TODO: Fetch the data from the server
};

function convertToChartData(prices: Array<[number, number]>): Array<{ date: string; price: number }> {
  return prices.map(([timestamp, price]) => {
    const dateObj = new Date(timestamp); // Convert the timestamp to milliseconds
    return {
      date: dateObj.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), // "MMM dd, HH:mm"
      price,
    };
  });
}

export function PortfolioChart() {
  const [pricesData, setPricesData] = useState<Array<{ date: string; price: number }>>(getPrices());
  const [loading, setLoading] = useState<boolean>(false);
  const [days, setDays] = useState<number>(1);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  // Find the max and min values in the data for Y-axis scaling
  const minPrice = Math.min(...pricesData.map((data) => data.price));
  const maxPrice = Math.max(...pricesData.map((data) => data.price));

  const priceDifference = pricesData[pricesData.length - 1]?.price - pricesData[0]?.price;
  const isPriceIncreasing = priceDifference >= 0;

  const padding = 0.1 * (maxPrice - minPrice); // Add padding to the Y-axis domain

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[20vh] w-full rounded-lg" style={{ height: "20vh", backdropFilter: "blur(10px)", opacity: 0.7 }}>
        <AreaChart
          data={pricesData}
          margin={{
            top: 18,
            bottom: 18,
            left: 12,
            right: 12,
          }}
        >
          <defs>
            <linearGradient id="price-gradient" x1="0" y1="0" x2="0" y2="1">
              {isPriceIncreasing ? (
                <>
                  <stop offset="0%" stopColor="green" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="green" stopOpacity={0.1} />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="red" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="red" stopOpacity={0.1} />
                </>
              )}
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            label={true}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="price"
            type="linear"
            fill="url(#price-gradient)"
            fillOpacity={0.8}
            stroke={isPriceIncreasing ? "green" : "red"}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
