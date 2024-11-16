"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from 'next/image'

import { Coin } from "@/types/coins"
import { Crown } from "lucide-react"

export const columns: ColumnDef<Coin>[] = [
  {
    accessorKey: 'favButton',
    header: '',
    cell: (row) => {
      return (
        <Crown />
      )
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (row) => {
      return (
        <div className="flex items-center">
          <Image
            src={row.row.original.image}
            alt={row.row.original.name}
            className="w-8 h-8 rounded-full"
            width={64}
            height={64}
          />
          <span className="ml-2">{row.row.original.name}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'current_price',
    header: 'Price',
  },
  {
    accessorKey: 'price_change_percentage_24h',
    header: '24h Change',
  },
  {
    accessorKey: 'market_cap',
    header: 'Market Cap',
  },
]