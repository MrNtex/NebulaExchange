'use client'

import { fetchCryptoForUser } from '@/actions/fetchCryptoForUser';
import { PieChartComposition } from '@/components/charts/pie-chart';
import SignUp from '@/components/signup';
import Tile from '@/components/Tile';
import { useAuth } from '@/context/authcontext';
import DashboardProvider, { Token, useDashboard } from '@/context/dashboardcontext';
import { PortfolioChart } from '@/modules/dashboard/portfolio-line-chart';
import { Sign } from 'crypto';
import React, { useEffect } from 'react';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
    );
  }

function DashboardContent() {

  const { user, userDataObj} = useAuth();

  const { tokens, setTokens } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log('fetching crypto for user with id', user.uid);
        const response = await fetchCryptoForUser(user!.uid) as Token[];
        console.log(response);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-semibold col-span-4">💰 My portfolio value: </h1>
      <div>
        <div className='absolute z-10 p-8 text-5xl font-extralight'>
          $ 10,000
        </div>
        <div className='h-12'></div>
        <PortfolioChart/>
      </div>
      
      <Tile title="Visitors" colSpan={1}>
          <PieChartComposition />
        </Tile>
    </div>
  );
}
