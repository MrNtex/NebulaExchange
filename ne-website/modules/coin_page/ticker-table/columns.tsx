"use client"

import { Ticker } from "@/types/coins";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Ticker>[] = [
  {
    accessorKey: "pair",
    header: "Pair",
    cell: ({ row }) => {
      const base = row.original.base || "N/A";
      const target = row.original.target || "N/A";
      return `${base}/${target}`;
    },
  },
  {
    accessorKey: "market",
    header: "Market",
    cell: ({ row }) => row.original.market?.name || "N/A",
  },
  {
    accessorKey: "last",
    header: "Last Price",
  },
  {
    accessorKey: "volume",
    header: "Volume",
  },
  {
    accessorKey: "trust_score",
    header: "Trust Score",
  },
  {
    accessorKey: "bid_ask_spread_percentage",
    header: "Spread (%)",
    cell: ({ row }) => row.original.bid_ask_spread_percentage?.toFixed(2) || "N/A",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) =>
      row.original.timestamp
        ? new Date(row.original.timestamp).toLocaleString()
        : "N/A",
  },
  {
    accessorKey: "is_anomaly",
    header: "Anomaly",
    cell: ({ row }) => (row.original.is_anomaly ? "Yes" : "No"),
  },
  {
    accessorKey: "is_stale",
    header: "Stale",
    cell: ({ row }) => (row.original.is_stale ? "Yes" : "No"),
  },
  {
    accessorKey: "trade_url",
    header: "Trade URL",
    cell: ({ row }) =>
      row.original.trade_url ? (
        <a
          href={row.original.trade_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Trade
        </a>
      ) : (
        "N/A"
      ),
  },
];
