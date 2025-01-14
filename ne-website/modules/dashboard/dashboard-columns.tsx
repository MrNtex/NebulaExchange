"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from 'next/image'

import { Coin, CoinSimple } from "@/types/coins"
import { Crown } from "lucide-react"
import { formatNumber, roundTo } from "@/lib/numberUtils"
import FavButton from "@/modules/main_page/FavButton"
import ChangeMarker from "@/components/ChangeMarker"

export interface PortfolioDataTableProps extends CoinSimple {
  data: CoinSimple
  amount: number
  value: number
  boughtOn: Date
}

export const dashboardColumns: ColumnDef<PortfolioDataTableProps>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (row) => {
      return (
        <a className="flex items-center" href={`./coin/${row.row.original.id}`}>
          <Image
            src={row.row.original.image}
            alt={row.row.original.name}
            className="w-8 h-8 rounded-full"
            width={64}
            height={64}
          />
          <span className="ml-2 text-base">{row.row.original.name}</span>
          <div className="ml-2 flex items-center">
            <span className="text-gray-400 text-xs">{row.row.original.symbol.toUpperCase()}</span>
          </div>
        </a>
      )
    }
  },
  {
    accessorKey: 'current_price',
    header: 'Price',
    cell: (row) => {
      return (
        <p className="font0">{formatNumber(row.row.original.current_price, 'USD')}</p>
      )
    }
  },
  {
    accessorKey: 'price_change_percentage_24h',
    header: '24h Change',
    cell: (row) => {
      return (
        <ChangeMarker change={roundTo(row.row.original.price_change_percentage_24h, 1)}/>
      )
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (row) => {
      return (
        <p>{formatNumber(row.row.original.amount)}</p>
      )
    }
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: (row) => {
      return (
        <p>{formatNumber(row.row.original.value, 'USD')}</p>
      )
    }
  }
]

