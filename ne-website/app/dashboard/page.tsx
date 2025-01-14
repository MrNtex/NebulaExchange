'use client'

import { fetchCryptoForUser } from '@/actions/fetchCryptoForUser';
import ChangeMarker from '@/components/ChangeMarker';
import { PieChartComposition, PieChartCompositionProps } from '@/components/charts/pie-chart';
import { DataTable } from '@/components/coins_list/data-table';
import SignUp from '@/components/signup';
import Tile from '@/components/Tile';
import { useAuth } from '@/context/authcontext';
import DashboardProvider, { Token, useDashboard } from '@/context/dashboardcontext';
import { formatNumber } from '@/lib/numberUtils';
import { dashboardColumns, PortfolioDataTableProps } from '@/modules/dashboard/dashboard-columns';
import { PortfolioChart } from '@/modules/dashboard/portfolio-line-chart';
import { CoinSimple } from '@/types/coins';
import { Sign } from 'crypto';
import React, { use, useEffect, useState } from 'react';
import { Pie } from 'recharts';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
    );
  }

function DashboardContent() {

  const { user, userDataObj} = useAuth();

  const { tokens, setTokens, portfolioValue, setPortfolioValue } = useDashboard();

  const [portfolioChange, setPortfolioChange] = useState(0);
  const [coins, setCoins] = useState<PortfolioDataTableProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log('fetching crypto for user with id', user.uid);
        const response = await fetchCryptoForUser(user!.uid) as Token[];
        setTokens(response);
        console.log(response);
      }
    };

    fetchData();
  }, [user]);

  const [pieChart, setPieChart] = useState<PieChartCompositionProps['data']>([]);

  useEffect(() => {
    let totalValue = 0;
    let yesterday = 0;
    let coins: PortfolioDataTableProps[] = [];

    const getData = async () => {
      if (tokens.length > 0) {
        console.log('fetching prices for tokens', tokens);
        const prices = await Promise.all(
          tokens.map(async (token) => {
            const response = await fetch(`http://localhost:5000/api/coin/simple/${token.name}`);
            const data: CoinSimple = await response.json();
            const val = data.current_price * token.amount;
            totalValue += val;
            yesterday += (data.current_price * (100-data.price_change_percentage_24h)/100) * token.amount;
            pieChart.push({name: token.name, amount: data.current_price * token.amount});
            coins.push({
              ...data,
              data: data,
              amount: token.amount,
              boughtOn: token.purchased,
              value: val,
            });
          })
        );

      }

      setCoins(coins);
      setPortfolioValue(totalValue);
      setPortfolioChange(totalValue - yesterday);
    };

    getData();
  }, [tokens]);

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-semibold col-span-4">💰 My portfolio value: </h1>
      <div>
        <div className='absolute z-10 p-8 text-5xl font-extralight'>
          {formatNumber(portfolioValue, "USD")}
          <div className='text-xl font-semibold'>
            <ChangeMarker change={portfolioChange/(portfolioValue-portfolioChange)*100} value={portfolioChange} />
          </div>
        </div>
        <div className='h-12'></div>
        <PortfolioChart/>
      </div>
      
      <Tile title="Composition" colSpan={1}>
          <PieChartComposition data={pieChart} />
        </Tile>

      <div className='mt-4'>
        <DataTable columns={dashboardColumns} data={coins} />
      </div>
      
    </div>
  );
}
