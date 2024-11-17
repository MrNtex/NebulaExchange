import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { Skeleton } from "../ui/skeleton";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface CryptoChartProps {
  coin: string;
}

const getPrices = async (coin: string) => {
  console.log("Fetching data from server for coin", coin);

  try {
    const data = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`
    );
    if (!data.ok) {
      throw new Error("Failed to fetch data");
    }
    const jsonData = await data.json();
    return jsonData.prices as Array<[number, number]>;
  } catch (error) {
    console.log("Error fetching data", error);
  }
};

function convertToChartData(prices: Array<[number, number]>): Array<{ hour: string; price: number }> {
  return prices.map(([timestamp, price]) => {
    return {
      hour: new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Convert timestamp to "HH:mm"
      price,
    };
  });
}

export function CryptoChart({ coin }: CryptoChartProps) {
  const [pricesData, setPricesData] = useState<Array<{ hour: string; price: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [days, setDays] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPrices(coin);

      if (data) {
        const chartData = convertToChartData(data);
        setPricesData(chartData); // Set the data after conversion
        console.log("Data fetched", chartData);
      } else {
        console.log("Error fetching data");
      }
      setLoading(false);
    };
    fetchData();
  }, [coin]);

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

  const padding = 0.1 * (maxPrice - minPrice); // Add padding to the Y-axis domain

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <AreaChart
          data={pricesData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]} // Set the Y-axis domain from the min to max price
            tickFormatter={(value) => `$${value}`} // Format the Y-axis ticks as currency
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
          <Area
            dataKey="price"
            type="linear"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
