"use client";

import { Coin } from '@/types/coins';
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

async function getData(): Promise<Coin[]> {
  try {
    const data = await fetch(`http://localhost:5000/api/listcoins/marketcap?limit=100`);
    return data.json() as Promise<Coin[]>;
  } catch (error) {
    console.log('Error fetching data', error);
    return [];
  }
}


export default function CoinsTable() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchCoins = async () => {
      const data = await getData();
      setCoins(data);
    }
    fetchCoins();
  }, [page]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={coins} />
    </div>
  )
}
