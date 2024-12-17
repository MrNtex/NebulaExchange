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
      const pair = `${base}/${target}`;

      // Limit to max 10 characters
      return pair.length > 10 ? `${pair.slice(0, 10)}...` : pair;
    },
  },
  {
    accessorKey: "market",
    header: "Market",
    cell: ({ row }) => {
      const marketName = row.original.market?.name || "N/A";
      const marketLogo = row.original.market?.logo;

      return (
        <a href={row.original.trade_url} target="_blank" rel="noreferrer noopener">
          <div className="flex items-center gap-2">
            {marketLogo && (
              <img
                src={marketLogo}
                alt={`${marketName} logo`}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span>{marketName}</span>
          </div>
        </a>
      );
    },
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
    cell: ({ row }) => {
      const trustScore = row.original.trust_score;

      let color = "bg-gray-400"; // Default: gray dot
      if (trustScore === "green") {
        return (
          <div className="w-3 h-3 rounded-full bg-green-400"/>
        );
      }
      if (trustScore === "red"){
        return (
          <div className="w-3 h-3 rounded-full bg-red-400"/>
        );
      }
      return (
        <div className="w-3 h-3 rounded-full bg-gray-400"/>
      );
      
    },
  },
  {
    accessorKey: "bid_ask_spread_percentage",
    header: "Spread (%)",
    cell: ({ row }) => row.original.bid_ask_spread_percentage?.toFixed(2) || "N/A",
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
];
