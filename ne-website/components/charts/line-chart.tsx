import { useEffect, useState } from "react";
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
import { Skeleton } from "../ui/skeleton";
import { roundTo } from "@/lib/numberUtils";
import { useCoin } from "@/context/coinContext";


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
  console.log("Fetching data from server for coin", coin.toLowerCase());

  try {
    const data = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart?vs_currency=usd&days=30`
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

function convertToChartData(prices: Array<[number, number]>): Array<{ date: string; price: number }> {
  return prices.map(([timestamp, price]) => {
    const dateObj = new Date(timestamp); // Convert the timestamp to milliseconds
    return {
      date: dateObj.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), // "MMM dd, HH:mm"
      price,
    };
  });
}

export function CryptoChart() {
  const [pricesData, setPricesData] = useState<Array<{ date: string; price: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [days, setDays] = useState<number>(1);

  const { coin } = useCoin();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPrices(coin?.name || "");

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

  const priceDifference = pricesData[pricesData.length - 1]?.price - pricesData[0]?.price;
  const isPriceIncreasing = priceDifference >= 0;

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
          <defs>
            <linearGradient id="price-gradient" x1="0" y1="0" x2="0" y2="1">
              {isPriceIncreasing ? (
                <>
                  <stop offset="0%" stopColor="green" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="green" stopOpacity={0.2} />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="red" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="red" stopOpacity={0.2} />
                </>
              )}
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
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
          <ReferenceLine
            y={maxPrice}
            stroke="green"
            opacity={0.2}
            strokeWidth={2}
            label={{
              value: `Peak: $${roundTo(maxPrice,2)}`,
              position: "left",
              offset: 10,
              fill: "green",
            }}
          />
          <ReferenceLine
            y={minPrice}
            stroke="red"
            opacity={0.2}
            strokeWidth={2}
            label={{
              value: `Dip: $${roundTo(minPrice,2)}`,
              position: "left",   // Place the label on the left
              offset: 20,         // Adjust the offset for spacing
              fill: "red",        // Color the label
              textAnchor: "middle", // Center align the label text
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
